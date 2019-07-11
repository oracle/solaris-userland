"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSelectedBreakableLines = exports.getDisplayedSources = exports.getSelectedSourceWithContent = exports.getSelectedSource = exports.getSelectedLocation = undefined;
exports.initialSourcesState = initialSourcesState;
exports.getBlackBoxList = getBlackBoxList;
exports.getSourceThreads = getSourceThreads;
exports.getSourceInSources = getSourceInSources;
exports.getSource = getSource;
exports.getSourceFromId = getSourceFromId;
exports.getSourceByActorId = getSourceByActorId;
exports.getSourcesByURLInSources = getSourcesByURLInSources;
exports.getSourcesByURL = getSourcesByURL;
exports.getSourceByURL = getSourceByURL;
exports.getSpecificSourceByURLInSources = getSpecificSourceByURLInSources;
exports.getSpecificSourceByURL = getSpecificSourceByURL;
exports.getOriginalSourceByURL = getOriginalSourceByURL;
exports.getGeneratedSourceByURL = getGeneratedSourceByURL;
exports.getGeneratedSource = getGeneratedSource;
exports.getGeneratedSourceById = getGeneratedSourceById;
exports.getPendingSelectedLocation = getPendingSelectedLocation;
exports.getPrettySource = getPrettySource;
exports.hasPrettySource = hasPrettySource;
exports.getSourcesUrlsInSources = getSourcesUrlsInSources;
exports.getHasSiblingOfSameName = getHasSiblingOfSameName;
exports.getSources = getSources;
exports.getSourcesEpoch = getSourcesEpoch;
exports.getUrls = getUrls;
exports.getPlainUrls = getPlainUrls;
exports.getSourceList = getSourceList;
exports.getDisplayedSourcesList = getDisplayedSourcesList;
exports.getSourceCount = getSourceCount;
exports.getSourceWithContent = getSourceWithContent;
exports.getSourceContent = getSourceContent;
exports.getSelectedSourceId = getSelectedSourceId;
exports.getProjectDirectoryRoot = getProjectDirectoryRoot;
exports.getSourceActorsForSource = getSourceActorsForSource;
exports.canLoadSource = canLoadSource;
exports.getBreakpointPositions = getBreakpointPositions;
exports.getBreakpointPositionsForSource = getBreakpointPositionsForSource;
exports.hasBreakpointPositions = hasBreakpointPositions;
exports.hasBreakpointPositionsForLine = hasBreakpointPositionsForLine;
exports.getBreakpointPositionsForLocation = getBreakpointPositionsForLocation;
exports.getBreakableLines = getBreakableLines;
exports.isSourceLoadingOrLoaded = isSourceLoadingOrLoaded;

var _reselect = require("devtools/client/debugger/dist/vendors").vendored["reselect"];

var _source = require("../utils/source");

var _resource = require("../utils/resource/index");

var _breakpointPositions = require("../utils/breakpoint/breakpointPositions");

var _asyncValue = require("../utils/async-value");

var asyncValue = _interopRequireWildcard(_asyncValue);

var _devtoolsSourceMap = require("devtools/client/shared/source-map/index.js");

var _prefs = require("../utils/prefs");

var _sourceActors = require("./source-actors");

var _lodash = require("devtools/client/shared/vendor/lodash");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function initialSourcesState() {
  return {
    sources: (0, _resource.createInitial)(),
    urls: {},
    plainUrls: {},
    content: {},
    actors: {},
    breakpointPositions: {},
    breakableLines: {},
    epoch: 1,
    selectedLocation: undefined,
    pendingSelectedLocation: _prefs.prefs.pendingSelectedLocation,
    projectDirectoryRoot: _prefs.prefs.projectDirectoryRoot,
    chromeAndExtenstionsEnabled: _prefs.prefs.chromeAndExtenstionsEnabled,
    focusedItem: null
  };
} /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

/**
 * Sources reducer
 * @module reducers/sources
 */

function update(state = initialSourcesState(), action) {
  let location = null;

  switch (action.type) {
    case "CLEAR_SOURCE_MAP_URL":
      return clearSourceMaps(state, action.sourceId);
    case "ADD_SOURCE":
      return addSources(state, [action.source]);

    case "ADD_SOURCES":
      return addSources(state, action.sources);

    case "INSERT_SOURCE_ACTORS":
      return insertSourceActors(state, action);

    case "REMOVE_SOURCE_ACTORS":
      return removeSourceActors(state, action);

    case "SET_SELECTED_LOCATION":
      location = {
        ...action.location,
        url: action.source.url
      };

      if (action.source.url) {
        _prefs.prefs.pendingSelectedLocation = location;
      }

      return {
        ...state,
        selectedLocation: {
          sourceId: action.source.id,
          ...action.location
        },
        pendingSelectedLocation: location
      };

    case "CLEAR_SELECTED_LOCATION":
      location = { url: "" };
      _prefs.prefs.pendingSelectedLocation = location;

      return {
        ...state,
        selectedLocation: null,
        pendingSelectedLocation: location
      };

    case "SET_PENDING_SELECTED_LOCATION":
      location = {
        url: action.url,
        line: action.line
      };

      _prefs.prefs.pendingSelectedLocation = location;
      return { ...state, pendingSelectedLocation: location };

    case "LOAD_SOURCE_TEXT":
      return updateLoadedState(state, action);

    case "BLACKBOX":
      if (action.status === "done") {
        const { id, url } = action.source;
        const { isBlackBoxed } = action.value;
        updateBlackBoxList(url, isBlackBoxed);
        return updateBlackboxFlag(state, id, isBlackBoxed);
      }
      break;

    case "SET_PROJECT_DIRECTORY_ROOT":
      return updateProjectDirectoryRoot(state, action.url);

    case "SET_BREAKABLE_LINES":
      {
        const { breakableLines, sourceId } = action;
        return {
          ...state,
          breakableLines: {
            ...state.breakableLines,
            [sourceId]: breakableLines
          }
        };
      }

    case "ADD_BREAKPOINT_POSITIONS":
      {
        const { source, positions } = action;
        const breakpointPositions = state.breakpointPositions[source.id];

        return {
          ...state,
          breakpointPositions: {
            ...state.breakpointPositions,
            [source.id]: { ...breakpointPositions, ...positions }
          }
        };
      }
    case "NAVIGATE":
      return {
        ...initialSourcesState(),
        epoch: state.epoch + 1
      };

    case "SET_FOCUSED_SOURCE_ITEM":
      return { ...state, focusedItem: action.item };
  }

  return state;
}

function resourceAsSource(r) {
  return r;
}

/*
 * Add sources to the sources store
 * - Add the source to the sources store
 * - Add the source URL to the urls map
 */
function addSources(state, sources) {
  state = {
    ...state,
    content: { ...state.content },
    urls: { ...state.urls },
    plainUrls: { ...state.plainUrls }
  };

  state.sources = (0, _resource.insertResources)(state.sources, sources);

  for (const source of sources) {
    // 1. Add the source to the sources map
    state.content[source.id] = null;

    // 2. Update the source url map
    const existing = state.urls[source.url] || [];
    if (!existing.includes(source.id)) {
      state.urls[source.url] = [...existing, source.id];
    }

    // 3. Update the plain url map
    if (source.url) {
      const plainUrl = (0, _source.getPlainUrl)(source.url);
      const existingPlainUrls = state.plainUrls[plainUrl] || [];
      if (!existingPlainUrls.includes(source.url)) {
        state.plainUrls[plainUrl] = [...existingPlainUrls, source.url];
      }
    }
  }

  state = updateRootRelativeValues(state, sources);

  return state;
}

function insertSourceActors(state, action) {
  const { items } = action;
  state = {
    ...state,
    actors: { ...state.actors }
  };

  for (const sourceActor of items) {
    state.actors[sourceActor.source] = [...(state.actors[sourceActor.source] || []), sourceActor.id];
  }

  const scriptActors = items.filter(item => item.introductionType === "scriptElement");
  if (scriptActors.length > 0) {
    const { ...breakpointPositions } = state.breakpointPositions;

    // If new HTML sources are being added, we need to clear the breakpoint
    // positions since the new source is a <script> with new breakpoints.
    for (const { source } of scriptActors) {
      delete breakpointPositions[source];
    }

    state = { ...state, breakpointPositions };
  }

  return state;
}

/*
 * Update sources when the worker list changes.
 * - filter source actor lists so that missing threads no longer appear
 * - NOTE: we do not remove sources for destroyed threads
 */
function removeSourceActors(state, action) {
  const { items } = action;

  const actors = new Set(items.map(item => item.id));
  const sources = new Set(items.map(item => item.source));

  state = {
    ...state,
    actors: { ...state.actors }
  };

  for (const source of sources) {
    state.actors[source] = state.actors[source].filter(id => !actors.has(id));
  }

  return state;
}

/*
 * Update sources when the project directory root changes
 */
function updateProjectDirectoryRoot(state, root) {
  _prefs.prefs.projectDirectoryRoot = root;

  return updateRootRelativeValues({
    ...state,
    projectDirectoryRoot: root
  });
}

function updateRootRelativeValues(state, sources) {
  const ids = sources ? sources.map(source => source.id) : (0, _resource.getResourceIds)(state.sources);

  state = {
    ...state
  };

  const relativeURLUpdates = [];
  for (const id of ids) {
    const source = (0, _resource.getResource)(state.sources, id);

    relativeURLUpdates.push({
      id,
      relativeUrl: (0, _source.getRelativeUrl)(source, state.projectDirectoryRoot)
    });
  }

  state.sources = (0, _resource.updateResources)(state.sources, relativeURLUpdates);

  return state;
}

/*
 * Update a source's loaded text content.
 */
function updateLoadedState(state, action) {
  const { sourceId } = action;

  // If there was a navigation between the time the action was started and
  // completed, we don't want to update the store.
  if (action.epoch !== state.epoch || !(sourceId in state.content)) {
    return state;
  }

  let content;
  if (action.status === "start") {
    content = asyncValue.pending();
  } else if (action.status === "error") {
    content = asyncValue.rejected(action.error);
  } else if (typeof action.value.text === "string") {
    content = asyncValue.fulfilled({
      type: "text",
      value: action.value.text,
      contentType: action.value.contentType
    });
  } else {
    content = asyncValue.fulfilled({
      type: "wasm",
      value: action.value.text
    });
  }

  return {
    ...state,
    content: {
      ...state.content,
      [sourceId]: content
    }
  };
}

function clearSourceMaps(state, sourceId) {
  if (!(0, _resource.hasResource)(state.sources, sourceId)) {
    return state;
  }

  return {
    ...state,
    sources: (0, _resource.updateResources)(state.sources, [{
      id: sourceId,
      sourceMapURL: ""
    }])
  };
}

/*
 * Update a source when its state changes
 * e.g. the text was loaded, it was blackboxed
 */
function updateBlackboxFlag(state, sourceId, isBlackBoxed) {
  // If there is no existing version of the source, it means that we probably
  // ended up here as a result of an async action, and the sources were cleared
  // between the action starting and the source being updated.
  if (!(0, _resource.hasResource)(state.sources, sourceId)) {
    // TODO: We may want to consider throwing here once we have a better
    // handle on async action flow control.
    return state;
  }

  return {
    ...state,
    sources: (0, _resource.updateResources)(state.sources, [{
      id: sourceId,
      isBlackBoxed
    }])
  };
}

function updateBlackBoxList(url, isBlackBoxed) {
  const tabs = getBlackBoxList();
  const i = tabs.indexOf(url);
  if (i >= 0) {
    if (!isBlackBoxed) {
      tabs.splice(i, 1);
    }
  } else if (isBlackBoxed) {
    tabs.push(url);
  }
  _prefs.prefs.tabsBlackBoxed = tabs;
}

function getBlackBoxList() {
  return _prefs.prefs.tabsBlackBoxed || [];
}

// Selectors

// Unfortunately, it's really hard to make these functions accept just
// the state that we care about and still type it with Flow. The
// problem is that we want to re-export all selectors from a single
// module for the UI, and all of those selectors should take the
// top-level app state, so we'd have to "wrap" them to automatically
// pick off the piece of state we're interested in. It's impossible
// (right now) to type those wrapped functions.


const getSourcesState = state => state.sources;

function getSourceThreads(state, source) {
  return (0, _lodash.uniq)((0, _sourceActors.getSourceActors)(state, state.sources.actors[source.id]).map(actor => actor.thread));
}

function getSourceInSources(sources, id) {
  return (0, _resource.hasResource)(sources, id) ? (0, _resource.getResource)(sources, id) : null;
}

function getSource(state, id) {
  return getSourceInSources(getSources(state), id);
}

function getSourceFromId(state, id) {
  const source = getSource(state, id);
  if (!source) {
    throw new Error(`source ${id} does not exist`);
  }
  return source;
}

function getSourceByActorId(state, actorId) {
  if (!(0, _sourceActors.hasSourceActor)(state, actorId)) {
    return null;
  }

  return getSource(state, (0, _sourceActors.getSourceActor)(state, actorId).source);
}

function getSourcesByURLInSources(sources, urls, url) {
  if (!url || !urls[url]) {
    return [];
  }
  return urls[url].map(id => (0, _resource.getResource)(sources, id));
}

function getSourcesByURL(state, url) {
  return getSourcesByURLInSources(getSources(state), getUrls(state), url);
}

function getSourceByURL(state, url) {
  const foundSources = getSourcesByURL(state, url);
  return foundSources ? foundSources[0] : null;
}

function getSpecificSourceByURLInSources(sources, urls, url, isOriginal) {
  const foundSources = getSourcesByURLInSources(sources, urls, url);
  if (foundSources) {
    return foundSources.find(source => (0, _source.isOriginal)(source) == isOriginal);
  }
  return null;
}

function getSpecificSourceByURL(state, url, isOriginal) {
  return getSpecificSourceByURLInSources(getSources(state), getUrls(state), url, isOriginal);
}

function getOriginalSourceByURL(state, url) {
  return getSpecificSourceByURL(state, url, true);
}

function getGeneratedSourceByURL(state, url) {
  return getSpecificSourceByURL(state, url, false);
}

function getGeneratedSource(state, source) {
  if (!source) {
    return null;
  }

  if ((0, _source.isGenerated)(source)) {
    return source;
  }

  return getSourceFromId(state, (0, _devtoolsSourceMap.originalToGeneratedId)(source.id));
}

function getGeneratedSourceById(state, sourceId) {
  const generatedSourceId = (0, _devtoolsSourceMap.originalToGeneratedId)(sourceId);
  return getSourceFromId(state, generatedSourceId);
}

function getPendingSelectedLocation(state) {
  return state.sources.pendingSelectedLocation;
}

function getPrettySource(state, id) {
  if (!id) {
    return;
  }

  const source = getSource(state, id);
  if (!source) {
    return;
  }

  return getOriginalSourceByURL(state, (0, _source.getPrettySourceURL)(source.url));
}

function hasPrettySource(state, id) {
  return !!getPrettySource(state, id);
}

function getSourcesUrlsInSources(state, url) {
  if (!url) {
    return [];
  }

  const plainUrl = (0, _source.getPlainUrl)(url);
  return getPlainUrls(state)[plainUrl] || [];
}

function getHasSiblingOfSameName(state, source) {
  if (!source) {
    return false;
  }

  return getSourcesUrlsInSources(state, source.url).length > 1;
}

const querySourceList = (0, _resource.makeReduceAllQuery)(resourceAsSource, sources => sources.slice());

function getSources(state) {
  return state.sources.sources;
}

function getSourcesEpoch(state) {
  return state.sources.epoch;
}

function getUrls(state) {
  return state.sources.urls;
}

function getPlainUrls(state) {
  return state.sources.plainUrls;
}

function getSourceList(state) {
  return querySourceList(getSources(state));
}

function getDisplayedSourcesList(state) {
  return Object.values(getDisplayedSources(state)).flatMap(Object.values);
}

function getSourceCount(state) {
  return getSourceList(state).length;
}

const getSelectedLocation = exports.getSelectedLocation = (0, _reselect.createSelector)(getSourcesState, sources => sources.selectedLocation);

const getSelectedSource = exports.getSelectedSource = (0, _reselect.createSelector)(getSelectedLocation, getSources, (selectedLocation, sources) => {
  if (!selectedLocation) {
    return;
  }

  return getSourceInSources(sources, selectedLocation.sourceId);
});

const getSelectedSourceWithContent = exports.getSelectedSourceWithContent = (0, _reselect.createSelector)(getSelectedLocation, getSources, state => state.sources.content, (selectedLocation, sources, content) => {
  const source = selectedLocation && getSourceInSources(sources, selectedLocation.sourceId);
  return source ? getSourceWithContentInner(sources, content, source.id) : null;
});
function getSourceWithContent(state, id) {
  return getSourceWithContentInner(state.sources.sources, state.sources.content, id);
}
function getSourceContent(state, id) {
  // Assert the resource exists.
  (0, _resource.getResource)(state.sources.sources, id);
  const content = state.sources.content[id];

  if (!content || content.state === "pending") {
    return null;
  }

  return content;
}

const contentLookup = new WeakMap();
function getSourceWithContentInner(sources, content, id) {
  const source = (0, _resource.getResource)(sources, id);
  let contentValue = content[source.id];

  let result = contentLookup.get(source);
  if (!result || result.content !== contentValue) {
    if (contentValue && contentValue.state === "pending") {
      contentValue = null;
    }
    result = {
      source,
      content: contentValue
    };
    contentLookup.set(source, result);
  }

  return result;
}

function getSelectedSourceId(state) {
  const source = getSelectedSource(state);
  return source && source.id;
}

function getProjectDirectoryRoot(state) {
  return state.sources.projectDirectoryRoot;
}

const queryAllDisplayedSources = (0, _resource.makeReduceQuery)((0, _resource.makeMapWithArgs)((resource, ident, {
  projectDirectoryRoot,
  chromeAndExtensionsEnabled,
  debuggeeIsWebExtension
}) => ({
  id: resource.id,
  displayed: (0, _source.underRoot)(resource, projectDirectoryRoot) && (!resource.isExtension || chromeAndExtensionsEnabled || debuggeeIsWebExtension)
})), items => items.reduce((acc, { id, displayed }) => {
  if (displayed) {
    acc.push(id);
  }
  return acc;
}, []));

function getAllDisplayedSources(state) {
  return queryAllDisplayedSources(state.sources.sources, {
    projectDirectoryRoot: state.sources.projectDirectoryRoot,
    chromeAndExtensionsEnabled: state.sources.chromeAndExtenstionsEnabled,
    debuggeeIsWebExtension: state.debuggee.isWebExtension
  });
}

const getDisplayedSourceIDs = (0, _reselect.createSelector)(_sourceActors.getThreadsBySource, getAllDisplayedSources, (threadsBySource, displayedSources) => {
  const sourceIDsByThread = {};

  for (const sourceId of displayedSources) {
    const threads = threadsBySource[sourceId] || threadsBySource[(0, _devtoolsSourceMap.originalToGeneratedId)(sourceId)] || [];

    for (const thread of threads) {
      if (!sourceIDsByThread[thread]) {
        sourceIDsByThread[thread] = new Set();
      }
      sourceIDsByThread[thread].add(sourceId);
    }
  }
  return sourceIDsByThread;
});

const getDisplayedSources = exports.getDisplayedSources = (0, _reselect.createSelector)(state => state.sources.sources, getDisplayedSourceIDs, (sources, idsByThread) => {
  const result = {};

  for (const thread of Object.keys(idsByThread)) {
    for (const id of idsByThread[thread]) {
      if (!result[thread]) {
        result[thread] = {};
      }
      result[thread][id] = (0, _resource.getResource)(sources, id);
    }
  }

  return result;
});

function getSourceActorsForSource(state, id) {
  const actors = state.sources.actors[id];
  if (!actors) {
    return [];
  }

  return (0, _sourceActors.getSourceActors)(state, actors);
}

function canLoadSource(state, sourceId) {
  // Return false if we know that loadSourceText() will fail if called on this
  // source. This is used to avoid viewing such sources in the debugger.
  const source = getSource(state, sourceId);
  if (!source) {
    return false;
  }

  if ((0, _source.isOriginal)(source)) {
    return true;
  }

  const actors = getSourceActorsForSource(state, sourceId);
  return actors.length != 0;
}

function getBreakpointPositions(state) {
  return state.sources.breakpointPositions;
}

function getBreakpointPositionsForSource(state, sourceId) {
  const positions = getBreakpointPositions(state);
  return positions && positions[sourceId];
}

function hasBreakpointPositions(state, sourceId) {
  return !!getBreakpointPositionsForSource(state, sourceId);
}

function hasBreakpointPositionsForLine(state, sourceId, line) {
  const positions = getBreakpointPositionsForSource(state, sourceId);
  return !!(positions && positions[line]);
}

function getBreakpointPositionsForLocation(state, location) {
  const { sourceId } = location;
  const positions = getBreakpointPositionsForSource(state, sourceId);
  return (0, _breakpointPositions.findPosition)(positions, location);
}

function getBreakableLines(state, sourceId) {
  if (!sourceId) {
    return null;
  }

  return state.sources.breakableLines[sourceId];
}

const getSelectedBreakableLines = exports.getSelectedBreakableLines = (0, _reselect.createSelector)(state => {
  const sourceId = getSelectedSourceId(state);
  return sourceId && state.sources.breakableLines[sourceId];
}, breakableLines => new Set(breakableLines || []));

function isSourceLoadingOrLoaded(state, sourceId) {
  const content = state.sources.content[sourceId];
  return content !== null;
}

exports.default = update;