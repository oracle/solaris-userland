"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initialSourcesState = initialSourcesState;
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
exports.getExtensionNameBySourceUrl = getExtensionNameBySourceUrl;
exports.getSourceCount = getSourceCount;
exports.getSourceWithContent = getSourceWithContent;
exports.getSourceContent = getSourceContent;
exports.getSelectedSourceId = getSelectedSourceId;
exports.getProjectDirectoryRoot = getProjectDirectoryRoot;
exports.getSourceActorsForSource = getSourceActorsForSource;
exports.canLoadSource = canLoadSource;
exports.isSourceWithMap = isSourceWithMap;
exports.canPrettyPrintSource = canPrettyPrintSource;
exports.getBreakpointPositions = getBreakpointPositions;
exports.getBreakpointPositionsForSource = getBreakpointPositionsForSource;
exports.hasBreakpointPositions = hasBreakpointPositions;
exports.getBreakpointPositionsForLine = getBreakpointPositionsForLine;
exports.hasBreakpointPositionsForLine = hasBreakpointPositionsForLine;
exports.getBreakpointPositionsForLocation = getBreakpointPositionsForLocation;
exports.getBreakableLines = getBreakableLines;
exports.isSourceLoadingOrLoaded = isSourceLoadingOrLoaded;
exports.getBlackBoxList = getBlackBoxList;
exports.default = exports.getSelectedBreakableLines = exports.getDisplayedSources = exports.getSelectedSourceWithContent = exports.getSelectedSource = exports.getSelectedLocation = exports.resourceAsSourceBase = void 0;

var _reselect = require("devtools/client/shared/vendor/reselect");

loader.lazyRequireGetter(this, "_source", "devtools/client/debugger/src/utils/source");
loader.lazyRequireGetter(this, "_resource", "devtools/client/debugger/src/utils/resource/index");
loader.lazyRequireGetter(this, "_breakpointPositions", "devtools/client/debugger/src/utils/breakpoint/breakpointPositions");
loader.lazyRequireGetter(this, "_asyncValue", "devtools/client/debugger/src/utils/async-value");

var _devtoolsSourceMap = require("devtools/client/shared/source-map/index.js");

loader.lazyRequireGetter(this, "_prefs", "devtools/client/debugger/src/utils/prefs");
loader.lazyRequireGetter(this, "_sourceActors", "devtools/client/debugger/src/reducers/source-actors");
loader.lazyRequireGetter(this, "_threads", "devtools/client/debugger/src/reducers/threads");

var _lodash = require("devtools/client/shared/vendor/lodash");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

/**
 * Sources reducer
 * @module reducers/sources
 */
function initialSourcesState(state) {
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
    chromeAndExtensionsEnabled: _prefs.prefs.chromeAndExtensionsEnabled,
    focusedItem: null,
    tabsBlackBoxed: (state === null || state === void 0 ? void 0 : state.tabsBlackBoxed) ?? []
  };
}

function update(state = initialSourcesState(), action) {
  let location = null;

  switch (action.type) {
    case "ADD_SOURCE":
      return addSources(state, [action.source]);

    case "ADD_SOURCES":
      return addSources(state, action.sources);

    case "INSERT_SOURCE_ACTORS":
      return insertSourceActors(state, action);

    case "REMOVE_SOURCE_ACTORS":
      return removeSourceActors(state, action);

    case "SET_SELECTED_LOCATION":
      location = { ...action.location,
        url: action.source.url
      };

      if (action.source.url) {
        _prefs.prefs.pendingSelectedLocation = location;
      }

      return { ...state,
        selectedLocation: {
          sourceId: action.source.id,
          ...action.location
        },
        pendingSelectedLocation: location
      };

    case "CLEAR_SELECTED_LOCATION":
      location = {
        url: ""
      };
      _prefs.prefs.pendingSelectedLocation = location;
      return { ...state,
        selectedLocation: null,
        pendingSelectedLocation: location
      };

    case "SET_PENDING_SELECTED_LOCATION":
      location = {
        url: action.url,
        line: action.line,
        column: action.column
      };
      _prefs.prefs.pendingSelectedLocation = location;
      return { ...state,
        pendingSelectedLocation: location
      };

    case "LOAD_SOURCE_TEXT":
      return updateLoadedState(state, action);

    case "BLACKBOX_SOURCES":
      if (action.status === "done") {
        const {
          shouldBlackBox
        } = action;
        const {
          sources
        } = action.value;
        state = updateBlackBoxListSources(state, sources, shouldBlackBox);
        return updateBlackboxFlagSources(state, sources, shouldBlackBox);
      }

      break;

    case "BLACKBOX":
      if (action.status === "done") {
        const {
          id,
          url
        } = action.source;
        const {
          isBlackBoxed
        } = action.value;
        state = updateBlackBoxList(state, url, isBlackBoxed);
        return updateBlackboxFlag(state, id, isBlackBoxed);
      }

      break;

    case "SET_PROJECT_DIRECTORY_ROOT":
      return updateProjectDirectoryRoot(state, action.url);

    case "SET_ORIGINAL_BREAKABLE_LINES":
      {
        const {
          breakableLines,
          sourceId
        } = action;
        return { ...state,
          breakableLines: { ...state.breakableLines,
            [sourceId]: breakableLines
          }
        };
      }

    case "ADD_BREAKPOINT_POSITIONS":
      {
        const {
          source,
          positions
        } = action;
        const breakpointPositions = state.breakpointPositions[source.id];
        return { ...state,
          breakpointPositions: { ...state.breakpointPositions,
            [source.id]: { ...breakpointPositions,
              ...positions
            }
          }
        };
      }

    case "NAVIGATE":
      return { ...initialSourcesState(state),
        epoch: state.epoch + 1
      };

    case "SET_FOCUSED_SOURCE_ITEM":
      return { ...state,
        focusedItem: action.item
      };
  }

  return state;
}

const resourceAsSourceBase = (0, _resource.memoizeResourceShallow)(({
  content,
  ...source
}) => source);
exports.resourceAsSourceBase = resourceAsSourceBase;
const resourceAsSourceWithContent = (0, _resource.memoizeResourceShallow)(({
  content,
  ...source
}) => ({ ...source,
  content: (0, _asyncValue.asSettled)(content)
}));
/*
 * Add sources to the sources store
 * - Add the source to the sources store
 * - Add the source URL to the urls map
 */

function addSources(state, sources) {
  state = { ...state,
    urls: { ...state.urls
    },
    plainUrls: { ...state.plainUrls
    }
  };
  state.sources = (0, _resource.insertResources)(state.sources, sources.map(source => ({ ...source,
    content: null
  })));

  for (const source of sources) {
    // 1. Update the source url map
    const existing = state.urls[source.url] || [];

    if (!existing.includes(source.id)) {
      state.urls[source.url] = [...existing, source.id];
    } // 2. Update the plain url map


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
  const {
    items
  } = action;
  state = { ...state,
    actors: { ...state.actors
    }
  };

  for (const sourceActor of items) {
    state.actors[sourceActor.source] = [...(state.actors[sourceActor.source] || []), sourceActor.id];
  }

  const scriptActors = items.filter(item => item.introductionType === "scriptElement");

  if (scriptActors.length > 0) {
    const { ...breakpointPositions
    } = state.breakpointPositions; // If new HTML sources are being added, we need to clear the breakpoint
    // positions since the new source is a <script> with new breakpoints.

    for (const {
      source
    } of scriptActors) {
      delete breakpointPositions[source];
    }

    state = { ...state,
      breakpointPositions
    };
  }

  return state;
}
/*
 * Update sources when the worker list changes.
 * - filter source actor lists so that missing threads no longer appear
 * - NOTE: we do not remove sources for destroyed threads
 */


function removeSourceActors(state, action) {
  const {
    items
  } = action;
  const actors = new Set(items.map(item => item.id));
  const sources = new Set(items.map(item => item.source));
  state = { ...state,
    actors: { ...state.actors
    }
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
  // Only update prefs when projectDirectoryRoot isn't a thread actor,
  // because when debugger is reopened, thread actor will change. See bug 1596323.
  if (actorType(root) !== "thread") {
    _prefs.prefs.projectDirectoryRoot = root;
  }

  return updateRootRelativeValues(state, undefined, root);
}
/* Checks if a path is a thread actor or not
 * e.g returns 'thread' for "server0.conn1.child1/workerTarget42/thread1"
 */


function actorType(actor) {
  const match = actor.match(/\/([a-z]+)\d+/);
  return match ? match[1] : null;
}

function updateRootRelativeValues(state, sources, projectDirectoryRoot = state.projectDirectoryRoot) {
  const wrappedIdsOrIds = sources ? sources : (0, _resource.getResourceIds)(state.sources);
  state = { ...state,
    projectDirectoryRoot
  };
  const relativeURLUpdates = wrappedIdsOrIds.map(wrappedIdOrId => {
    const id = typeof wrappedIdOrId === "string" ? wrappedIdOrId : wrappedIdOrId.id;
    const source = (0, _resource.getResource)(state.sources, id);
    return {
      id,
      relativeUrl: (0, _source.getRelativeUrl)(source, state.projectDirectoryRoot)
    };
  });
  state.sources = (0, _resource.updateResources)(state.sources, relativeURLUpdates);
  return state;
}
/*
 * Update a source's loaded text content.
 */


function updateLoadedState(state, action) {
  const {
    sourceId
  } = action; // If there was a navigation between the time the action was started and
  // completed, we don't want to update the store.

  if (action.epoch !== state.epoch || !(0, _resource.hasResource)(state.sources, sourceId)) {
    return state;
  }

  let content;

  if (action.status === "start") {
    content = (0, _asyncValue.pending)();
  } else if (action.status === "error") {
    content = (0, _asyncValue.rejected)(action.error);
  } else if (typeof action.value.text === "string") {
    content = (0, _asyncValue.fulfilled)({
      type: "text",
      value: action.value.text,
      contentType: action.value.contentType
    });
  } else {
    content = (0, _asyncValue.fulfilled)({
      type: "wasm",
      value: action.value.text
    });
  }

  return { ...state,
    sources: (0, _resource.updateResources)(state.sources, [{
      id: sourceId,
      content
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

  return { ...state,
    sources: (0, _resource.updateResources)(state.sources, [{
      id: sourceId,
      isBlackBoxed
    }])
  };
}

function updateBlackboxFlagSources(state, sources, shouldBlackBox) {
  const sourcesToUpdate = [];

  for (const source of sources) {
    if (!(0, _resource.hasResource)(state.sources, source.id)) {
      // TODO: We may want to consider throwing here once we have a better
      // handle on async action flow control.
      continue;
    }

    sourcesToUpdate.push({
      id: source.id,
      isBlackBoxed: shouldBlackBox
    });
  }

  state.sources = (0, _resource.updateResources)(state.sources, sourcesToUpdate);
  return state;
}

function updateBlackboxTabs(tabs, url, isBlackBoxed) {
  const i = tabs.indexOf(url);

  if (i >= 0) {
    if (!isBlackBoxed) {
      tabs.splice(i, 1);
    }
  } else if (isBlackBoxed) {
    tabs.push(url);
  }
}

function updateBlackBoxList(state, url, isBlackBoxed) {
  const tabs = [...state.tabsBlackBoxed];
  updateBlackboxTabs(tabs, url, isBlackBoxed);
  return { ...state,
    tabsBlackBoxed: tabs
  };
}

function updateBlackBoxListSources(state, sources, shouldBlackBox) {
  const tabs = [...state.tabsBlackBoxed];
  sources.forEach(source => {
    updateBlackboxTabs(tabs, source.url, shouldBlackBox);
  });
  return { ...state,
    tabsBlackBoxed: tabs
  };
} // Selectors
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
  return (0, _resource.hasResource)(sources, id) ? (0, _resource.getMappedResource)(sources, id, resourceAsSourceBase) : null;
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

  return urls[url].map(id => (0, _resource.getMappedResource)(sources, id, resourceAsSourceBase));
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

const querySourceList = (0, _resource.makeReduceAllQuery)(resourceAsSourceBase, sources => sources.slice());

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

function getExtensionNameBySourceUrl(state, url) {
  const match = getSourceList(state).find(source => source.url && source.url.startsWith(url));

  if (match && match.extensionName) {
    return match.extensionName;
  }
}

function getSourceCount(state) {
  return getSourceList(state).length;
}

const getSelectedLocation = (0, _reselect.createSelector)(getSourcesState, sources => sources.selectedLocation);
exports.getSelectedLocation = getSelectedLocation;
const getSelectedSource = (0, _reselect.createSelector)(getSelectedLocation, getSources, (selectedLocation, sources) => {
  if (!selectedLocation) {
    return;
  }

  return getSourceInSources(sources, selectedLocation.sourceId);
});
exports.getSelectedSource = getSelectedSource;
const getSelectedSourceWithContent = (0, _reselect.createSelector)(getSelectedLocation, getSources, (selectedLocation, sources) => {
  const source = selectedLocation && getSourceInSources(sources, selectedLocation.sourceId);
  return source ? (0, _resource.getMappedResource)(sources, source.id, resourceAsSourceWithContent) : null;
});
exports.getSelectedSourceWithContent = getSelectedSourceWithContent;

function getSourceWithContent(state, id) {
  return (0, _resource.getMappedResource)(state.sources.sources, id, resourceAsSourceWithContent);
}

function getSourceContent(state, id) {
  const {
    content
  } = (0, _resource.getResource)(state.sources.sources, id);
  return (0, _asyncValue.asSettled)(content);
}

function getSelectedSourceId(state) {
  const source = getSelectedSource(state);
  return source === null || source === void 0 ? void 0 : source.id;
}

function getProjectDirectoryRoot(state) {
  return state.sources.projectDirectoryRoot;
}

const queryAllDisplayedSources = (0, _resource.makeReduceQuery)((0, _resource.makeMapWithArgs)((resource, ident, {
  projectDirectoryRoot,
  chromeAndExtensionsEnabled,
  debuggeeIsWebExtension,
  threadActors
}) => ({
  id: resource.id,
  displayed: (0, _source.underRoot)(resource, projectDirectoryRoot, threadActors) && (!resource.isExtension || chromeAndExtensionsEnabled || debuggeeIsWebExtension)
})), items => items.reduce((acc, {
  id,
  displayed
}) => {
  if (displayed) {
    acc.push(id);
  }

  return acc;
}, []));

function getAllDisplayedSources(state) {
  return queryAllDisplayedSources(state.sources.sources, {
    projectDirectoryRoot: state.sources.projectDirectoryRoot,
    chromeAndExtensionsEnabled: state.sources.chromeAndExtensionsEnabled,
    debuggeeIsWebExtension: state.threads.isWebExtension,
    threadActors: [(0, _threads.getMainThread)(state).actor, ...(0, _threads.getThreads)(state).map(t => t.actor)]
  });
}

const getDisplayedSourceIDs = (0, _reselect.createSelector)(_sourceActors.getAllThreadsBySource, getAllDisplayedSources, (threadsBySource, displayedSources) => {
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
const getDisplayedSources = (0, _reselect.createSelector)(state => state.sources.sources, getDisplayedSourceIDs, (sources, idsByThread) => {
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
exports.getDisplayedSources = getDisplayedSources;

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

function isSourceWithMap(state, id) {
  return getSourceActorsForSource(state, id).some(soureActor => soureActor.sourceMapURL);
}

function canPrettyPrintSource(state, id) {
  const source = getSourceWithContent(state, id);

  if (!source || (0, _source.isPretty)(source) || (0, _source.isOriginal)(source) || _prefs.prefs.clientSourceMapsEnabled && isSourceWithMap(state, id)) {
    return false;
  }

  const sourceContent = source.content && (0, _asyncValue.isFulfilled)(source.content) ? source.content.value : null;

  if (!sourceContent || !(0, _source.isJavaScript)(source, sourceContent)) {
    return false;
  }

  return true;
}

function getBreakpointPositions(state) {
  return state.sources.breakpointPositions;
}

function getBreakpointPositionsForSource(state, sourceId) {
  const positions = getBreakpointPositions(state);
  return positions === null || positions === void 0 ? void 0 : positions[sourceId];
}

function hasBreakpointPositions(state, sourceId) {
  return !!getBreakpointPositionsForSource(state, sourceId);
}

function getBreakpointPositionsForLine(state, sourceId, line) {
  const positions = getBreakpointPositionsForSource(state, sourceId);
  return positions === null || positions === void 0 ? void 0 : positions[line];
}

function hasBreakpointPositionsForLine(state, sourceId, line) {
  return !!getBreakpointPositionsForLine(state, sourceId, line);
}

function getBreakpointPositionsForLocation(state, location) {
  const {
    sourceId
  } = location;
  const positions = getBreakpointPositionsForSource(state, sourceId);
  return (0, _breakpointPositions.findPosition)(positions, location);
}

function getBreakableLines(state, sourceId) {
  if (!sourceId) {
    return null;
  }

  const source = getSource(state, sourceId);

  if (!source) {
    return null;
  }

  if ((0, _source.isOriginal)(source)) {
    return state.sources.breakableLines[sourceId];
  } // We pull generated file breakable lines directly from the source actors
  // so that breakable lines can be added as new source actors on HTML loads.


  return (0, _sourceActors.getBreakableLinesForSourceActors)(state.sourceActors, state.sources.actors[sourceId]);
}

const getSelectedBreakableLines = (0, _reselect.createSelector)(state => {
  const sourceId = getSelectedSourceId(state);
  return sourceId && getBreakableLines(state, sourceId);
}, breakableLines => new Set(breakableLines || []));
exports.getSelectedBreakableLines = getSelectedBreakableLines;

function isSourceLoadingOrLoaded(state, sourceId) {
  const {
    content
  } = (0, _resource.getResource)(state.sources.sources, sourceId);
  return content !== null;
}

function getBlackBoxList(state) {
  return state.sources.tabsBlackBoxed;
}

var _default = update;
exports.default = _default;