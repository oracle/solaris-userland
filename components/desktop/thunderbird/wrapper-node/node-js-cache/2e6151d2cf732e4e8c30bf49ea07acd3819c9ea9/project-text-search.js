"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addSearchQuery = addSearchQuery;
exports.addOngoingSearch = addOngoingSearch;
exports.addSearchResult = addSearchResult;
exports.clearSearchResults = clearSearchResults;
exports.clearSearch = clearSearch;
exports.updateSearchStatus = updateSearchStatus;
exports.closeProjectSearch = closeProjectSearch;
exports.stopOngoingSearch = stopOngoingSearch;
exports.searchSources = searchSources;
exports.searchSource = searchSource;
loader.lazyRequireGetter(this, "_asyncValue", "devtools/client/debugger/src/utils/async-value");
loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_location", "devtools/client/debugger/src/utils/location");
loader.lazyRequireGetter(this, "_source", "devtools/client/debugger/src/utils/source");
loader.lazyRequireGetter(this, "_loadSourceText", "devtools/client/debugger/src/actions/sources/loadSourceText");
loader.lazyRequireGetter(this, "_projectTextSearch", "devtools/client/debugger/src/selectors/project-text-search");
loader.lazyRequireGetter(this, "_projectTextSearch2", "devtools/client/debugger/src/reducers/project-text-search");
loader.lazyRequireGetter(this, "_constants", "devtools/client/debugger/src/constants");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

/**
 * Redux actions for the search state
 * @module actions/search
 */
function addSearchQuery(cx, query) {
  return {
    type: "ADD_QUERY",
    cx,
    query
  };
}

function addOngoingSearch(cx, ongoingSearch) {
  return {
    type: "ADD_ONGOING_SEARCH",
    cx,
    ongoingSearch
  };
}

function addSearchResult(cx, location, matches) {
  return {
    type: "ADD_SEARCH_RESULT",
    cx,
    location,
    matches
  };
}

function clearSearchResults(cx) {
  return {
    type: "CLEAR_SEARCH_RESULTS",
    cx
  };
}

function clearSearch(cx) {
  return {
    type: "CLEAR_SEARCH",
    cx
  };
}

function updateSearchStatus(cx, status) {
  return {
    type: "UPDATE_STATUS",
    cx,
    status
  };
}

function closeProjectSearch(cx) {
  return ({
    dispatch,
    getState
  }) => {
    dispatch(stopOngoingSearch(cx));
    dispatch({
      type: "CLOSE_PROJECT_SEARCH"
    });
  };
}

function stopOngoingSearch(cx) {
  return ({
    dispatch,
    getState
  }) => {
    const state = getState();
    const ongoingSearch = (0, _projectTextSearch.getProjectSearchOperation)(state);
    const status = (0, _projectTextSearch.getProjectSearchStatus)(state);

    if (ongoingSearch && status !== _projectTextSearch2.statusType.done) {
      ongoingSearch.cancel();
      dispatch(updateSearchStatus(cx, _projectTextSearch2.statusType.cancelled));
    }
  };
}

function searchSources(cx, query) {
  let cancelled = false;

  const search = async ({
    dispatch,
    getState
  }) => {
    dispatch(stopOngoingSearch(cx));
    await dispatch(addOngoingSearch(cx, search));
    await dispatch(clearSearchResults(cx));
    await dispatch(addSearchQuery(cx, query));
    dispatch(updateSearchStatus(cx, _projectTextSearch2.statusType.fetching));
    const searchOptions = (0, _selectors.getSearchOptions)(getState(), _constants.searchKeys.PROJECT_SEARCH);
    const validSources = (0, _selectors.getSourceList)(getState()).filter(source => !(0, _selectors.isSourceBlackBoxed)(getState(), source) && !(0, _source.matchesGlobPatterns)(source, searchOptions.excludePatterns)); // Sort original entries first so that search results are more useful.
    // Deprioritize third-party scripts, so their results show last.

    validSources.sort((a, b) => {
      function isThirdParty(source) {
        return (source === null || source === void 0 ? void 0 : source.url) && (source.url.includes("node_modules") || source.url.includes("bower_components"));
      }

      if (a.isOriginal && !isThirdParty(a)) {
        return -1;
      }

      if (b.isOriginal && !isThirdParty(b)) {
        return 1;
      }

      if (!isThirdParty(a) && isThirdParty(b)) {
        return -1;
      }

      if (isThirdParty(a) && !isThirdParty(b)) {
        return 1;
      }

      return 0;
    });

    for (const source of validSources) {
      if (cancelled) {
        return;
      }

      const sourceActor = (0, _selectors.getFirstSourceActorForGeneratedSource)(getState(), source.id);
      await dispatch((0, _loadSourceText.loadSourceText)(cx, source, sourceActor));
      await dispatch(searchSource(cx, source, sourceActor, query));
    }

    dispatch(updateSearchStatus(cx, _projectTextSearch2.statusType.done));
  };

  search.cancel = () => {
    cancelled = true;
  };

  return search;
}

function searchSource(cx, source, sourceActor, query) {
  return async ({
    dispatch,
    getState,
    searchWorker
  }) => {
    if (!source) {
      return;
    }

    const state = getState();
    const location = (0, _location.createLocation)({
      source,
      sourceActor
    });
    const options = (0, _selectors.getSearchOptions)(state, _constants.searchKeys.PROJECT_SEARCH);
    const content = (0, _selectors.getSettledSourceTextContent)(state, location);
    let matches = [];

    if (content && (0, _asyncValue.isFulfilled)(content) && content.value.type === "text") {
      matches = await searchWorker.findSourceMatches(content.value, query, options);
    }

    if (!matches.length) {
      return;
    }

    dispatch(addSearchResult(cx, location, matches));
  };
}