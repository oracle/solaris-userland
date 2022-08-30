"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasSource = hasSource;
exports.getSource = getSource;
exports.getSourceFromId = getSourceFromId;
exports.getLocationSource = getLocationSource;
exports.getSourceByActorId = getSourceByActorId;
exports.getSourceByURL = getSourceByURL;
exports.getSpecificSourceByURL = getSpecificSourceByURL;
exports.getGeneratedSourceByURL = getGeneratedSourceByURL;
exports.getGeneratedSource = getGeneratedSource;
exports.getPendingSelectedLocation = getPendingSelectedLocation;
exports.getPrettySource = getPrettySource;
exports.hasPrettySource = hasPrettySource;
exports.getSourcesUrlsInSources = getSourcesUrlsInSources;
exports.getHasSiblingOfSameName = getHasSiblingOfSameName;
exports.getSourcesMap = getSourcesMap;
exports.getDisplayedSourcesList = getDisplayedSourcesList;
exports.getExtensionNameBySourceUrl = getExtensionNameBySourceUrl;
exports.getSourceCount = getSourceCount;
exports.getSelectedLocation = getSelectedLocation;
exports.getSelectedSourceId = getSelectedSourceId;
exports.getProjectDirectoryRoot = getProjectDirectoryRoot;
exports.getProjectDirectoryRootName = getProjectDirectoryRootName;
exports.getSourceActorsForSource = getSourceActorsForSource;
exports.isSourceWithMap = isSourceWithMap;
exports.canPrettyPrintSource = canPrettyPrintSource;
exports.getBreakpointPositions = getBreakpointPositions;
exports.getBreakpointPositionsForSource = getBreakpointPositionsForSource;
exports.hasBreakpointPositions = hasBreakpointPositions;
exports.getBreakpointPositionsForLine = getBreakpointPositionsForLine;
exports.getBreakpointPositionsForLocation = getBreakpointPositionsForLocation;
exports.getBreakableLines = getBreakableLines;
exports.getBlackBoxRanges = getBlackBoxRanges;
exports.getSelectedBreakableLines = exports.getDisplayedSources = exports.getSelectedSource = exports.getSourceList = void 0;

var _reselect = require("devtools/client/shared/vendor/reselect");

loader.lazyRequireGetter(this, "_shallowEqual", "devtools/client/debugger/src/utils/shallow-equal");
loader.lazyRequireGetter(this, "_source", "devtools/client/debugger/src/utils/source");
loader.lazyRequireGetter(this, "_url", "devtools/client/debugger/src/utils/url");
loader.lazyRequireGetter(this, "_breakpointPositions", "devtools/client/debugger/src/utils/breakpoint/breakpointPositions");
loader.lazyRequireGetter(this, "_asyncValue", "devtools/client/debugger/src/utils/async-value");

var _devtoolsSourceMap = require("devtools/client/shared/source-map/index.js");

loader.lazyRequireGetter(this, "_prefs", "devtools/client/debugger/src/utils/prefs");
loader.lazyRequireGetter(this, "_sourceActors", "devtools/client/debugger/src/selectors/source-actors");
loader.lazyRequireGetter(this, "_sourcesContent", "devtools/client/debugger/src/selectors/sources-content");
loader.lazyRequireGetter(this, "_threads", "devtools/client/debugger/src/selectors/threads");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function hasSource(state, id) {
  return state.sources.sources.has(id);
}

function getSource(state, id) {
  return state.sources.sources.get(id);
}

function getSourceFromId(state, id) {
  const source = getSource(state, id);

  if (!source) {
    console.warn(`source ${id} does not exist`);
  }

  return source;
}

function getLocationSource(state, location) {
  return getSource(state, location.sourceId);
}

function getSourceByActorId(state, actorId) {
  if (!(0, _sourceActors.hasSourceActor)(state, actorId)) {
    return null;
  }

  return getSource(state, (0, _sourceActors.getSourceActor)(state, actorId).source);
}

function getSourcesByURL(state, url) {
  const urls = getUrls(state);

  if (!url || !urls[url]) {
    return [];
  }

  return urls[url].map(id => getSource(state, id));
}

function getSourceByURL(state, url) {
  const foundSources = getSourcesByURL(state, url);
  return foundSources ? foundSources[0] : null;
} // This is used by tabs selectors


function getSpecificSourceByURL(state, url, isOriginal) {
  const foundSources = getSourcesByURL(state, url);

  if (foundSources) {
    return foundSources.find(source => source.isOriginal == isOriginal);
  }

  return null;
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
} // This is only used by jest tests


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
} // This is only used externaly by tabs and breakpointSources selectors


function getSourcesMap(state) {
  return state.sources.sources;
}

function getUrls(state) {
  return state.sources.urls;
}

function getPlainUrls(state) {
  return state.sources.plainUrls;
}

const getSourceList = (0, _reselect.createSelector)(getSourcesMap, sourcesMap => {
  return [...sourcesMap.values()];
}, {
  equalityCheck: _shallowEqual.shallowEqual,
  resultEqualityCheck: _shallowEqual.shallowEqual
});
exports.getSourceList = getSourceList;

function getDisplayedSourcesList(state) {
  return Object.values(getDisplayedSources(state)).flatMap(Object.values);
}

function getExtensionNameBySourceUrl(state, url) {
  const match = getSourceList(state).find(source => source.url && source.url.startsWith(url));

  if (match && match.extensionName) {
    return match.extensionName;
  }
} // This is only used by tests


function getSourceCount(state) {
  return getSourcesMap(state).size;
}

function getSelectedLocation(state) {
  return state.sources.selectedLocation;
}

const getSelectedSource = (0, _reselect.createSelector)(getSelectedLocation, getSourcesMap, (selectedLocation, sourcesMap) => {
  if (!selectedLocation) {
    return;
  }

  return sourcesMap.get(selectedLocation.sourceId);
}); // This is used by tests and pause reducers

exports.getSelectedSource = getSelectedSource;

function getSelectedSourceId(state) {
  const source = getSelectedSource(state);
  return source === null || source === void 0 ? void 0 : source.id;
}

function getProjectDirectoryRoot(state) {
  return state.sources.projectDirectoryRoot;
}

function getProjectDirectoryRootName(state) {
  return state.sources.projectDirectoryRootName;
}

const getDisplayedSourceIDs = (0, _reselect.createSelector)(getSourcesMap, state => state.sources.sourcesWithUrls, state => state.sources.projectDirectoryRoot, state => state.sources.chromeAndExtensionsEnabled, state => state.threads.isWebExtension, _threads.getAllThreads, (sourcesMap, sourcesWithUrls, projectDirectoryRoot, chromeAndExtensionsEnabled, debuggeeIsWebExtension, threads) => {
  const rootWithoutThreadActor = (0, _source.removeThreadActorId)(projectDirectoryRoot, threads);
  const sourceIDsByThread = {};

  for (const id of sourcesWithUrls) {
    const source = sourcesMap.get(id);
    const displayed = (0, _source.isDescendantOfRoot)(source, rootWithoutThreadActor) && (!source.isExtension || chromeAndExtensionsEnabled || debuggeeIsWebExtension);

    if (!displayed) {
      continue;
    }

    const thread = source.thread;

    if (!sourceIDsByThread[thread]) {
      sourceIDsByThread[thread] = new Set();
    }

    sourceIDsByThread[thread].add(id);
  }

  return sourceIDsByThread;
});
const getDisplayedSources = (0, _reselect.createSelector)(getSourcesMap, getDisplayedSourceIDs, (sourcesMap, idsByThread) => {
  const result = {};

  for (const thread of Object.keys(idsByThread)) {
    const entriesByNoQueryURL = Object.create(null);

    for (const id of idsByThread[thread]) {
      if (!result[thread]) {
        result[thread] = {};
      }

      const source = sourcesMap.get(id);
      const entry = { ...source,
        displayURL: source.url
      };
      result[thread][id] = entry;
      const noQueryURL = (0, _url.stripQuery)(entry.displayURL);

      if (!entriesByNoQueryURL[noQueryURL]) {
        entriesByNoQueryURL[noQueryURL] = [];
      }

      entriesByNoQueryURL[noQueryURL].push(entry);
    } // If the URL does not compete with another without the query string,
    // we exclude the query string when rendering the source URL to keep the
    // UI more easily readable.


    for (const noQueryURL in entriesByNoQueryURL) {
      const entries = entriesByNoQueryURL[noQueryURL];

      if (entries.length === 1) {
        entries[0].displayURL = noQueryURL;
      }
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

function isSourceWithMap(state, id) {
  return getSourceActorsForSource(state, id).some(sourceActor => sourceActor.sourceMapURL);
}

function canPrettyPrintSource(state, id) {
  const source = getSource(state, id);

  if (!source || (0, _source.isPretty)(source) || source.isOriginal || _prefs.prefs.clientSourceMapsEnabled && isSourceWithMap(state, id)) {
    return false;
  }

  const content = (0, _sourcesContent.getSourceTextContent)(state, id);
  const sourceContent = content && (0, _asyncValue.isFulfilled)(content) ? content.value : null;

  if (!sourceContent || !(0, _source.isJavaScript)(source, sourceContent)) {
    return false;
  }

  return true;
} // Used by visibleColumnBreakpoints selectors


function getBreakpointPositions(state) {
  return state.sources.breakpointPositions;
}

function getBreakpointPositionsForSource(state, sourceId) {
  const positions = getBreakpointPositions(state);
  return positions === null || positions === void 0 ? void 0 : positions[sourceId];
} // This is only used by one test


function hasBreakpointPositions(state, sourceId) {
  return !!getBreakpointPositionsForSource(state, sourceId);
}

function getBreakpointPositionsForLine(state, sourceId, line) {
  const positions = getBreakpointPositionsForSource(state, sourceId);
  return positions === null || positions === void 0 ? void 0 : positions[line];
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

  if (source.isOriginal) {
    return state.sources.breakableLines[sourceId];
  }

  const sourceActorIDs = state.sources.actors[sourceId];

  if (!(sourceActorIDs === null || sourceActorIDs === void 0 ? void 0 : sourceActorIDs.length)) {
    return null;
  } // We pull generated file breakable lines directly from the source actors
  // so that breakable lines can be added as new source actors on HTML loads.


  return (0, _sourceActors.getBreakableLinesForSourceActors)(state, sourceActorIDs, source.isHTML);
}

const getSelectedBreakableLines = (0, _reselect.createSelector)(state => {
  const sourceId = getSelectedSourceId(state);
  return sourceId && getBreakableLines(state, sourceId);
}, breakableLines => new Set(breakableLines || []));
exports.getSelectedBreakableLines = getSelectedBreakableLines;

function getBlackBoxRanges(state) {
  return state.sources.blackboxedRanges;
}