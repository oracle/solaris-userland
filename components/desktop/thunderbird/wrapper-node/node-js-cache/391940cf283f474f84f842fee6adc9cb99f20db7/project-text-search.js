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
loader.lazyRequireGetter(this, "_search", "devtools/client/debugger/src/workers/search/index");
loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_source", "devtools/client/debugger/src/utils/source");
loader.lazyRequireGetter(this, "_loadSourceText", "devtools/client/debugger/src/actions/sources/loadSourceText");
loader.lazyRequireGetter(this, "_projectTextSearch", "devtools/client/debugger/src/reducers/project-text-search");

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

function addSearchResult(cx, sourceId, filepath, matches) {
  return {
    type: "ADD_SEARCH_RESULT",
    cx,
    result: {
      sourceId,
      filepath,
      matches
    }
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
    const ongoingSearch = (0, _projectTextSearch.getTextSearchOperation)(state);
    const status = (0, _projectTextSearch.getTextSearchStatus)(state);

    if (ongoingSearch && status !== _projectTextSearch.statusType.done) {
      ongoingSearch.cancel();
      dispatch(updateSearchStatus(cx, _projectTextSearch.statusType.cancelled));
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
    dispatch(updateSearchStatus(cx, _projectTextSearch.statusType.fetching));
    const validSources = (0, _selectors.getSourceList)(getState()).filter(source => !(0, _selectors.hasPrettySource)(getState(), source.id) && !(0, _source.isThirdParty)(source));

    for (const source of validSources) {
      if (cancelled) {
        return;
      }

      await dispatch((0, _loadSourceText.loadSourceText)({
        cx,
        source
      }));
      await dispatch(searchSource(cx, source.id, query));
    }

    dispatch(updateSearchStatus(cx, _projectTextSearch.statusType.done));
  };

  search.cancel = () => {
    cancelled = true;
  };

  return search;
}

function searchSource(cx, sourceId, query) {
  return async ({
    dispatch,
    getState
  }) => {
    const source = (0, _selectors.getSource)(getState(), sourceId);

    if (!source) {
      return;
    }

    const content = (0, _selectors.getSourceContent)(getState(), source.id);
    let matches = [];

    if (content && (0, _asyncValue.isFulfilled)(content) && content.value.type === "text") {
      matches = await (0, _search.findSourceMatches)(source.id, content.value, query);
    }

    if (!matches.length) {
      return;
    }

    dispatch(addSearchResult(cx, source.id, source.url, matches));
  };
}