"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasSource = hasSource;
exports.getSource = getSource;
exports.getSourceFromId = getSourceFromId;
exports.getSourceByActorId = getSourceByActorId;
exports.getSourceByURL = getSourceByURL;
exports.getSpecificSourceByURL = getSpecificSourceByURL;
exports.getGeneratedSourceByURL = getGeneratedSourceByURL;
exports.getGeneratedSource = getGeneratedSource;
exports.getPendingSelectedLocation = getPendingSelectedLocation;
exports.getPrettySource = getPrettySource;
exports.getSourceList = getSourceList;
exports.getSourceCount = getSourceCount;
exports.getSelectedLocation = getSelectedLocation;
exports.getSelectedMappedSource = getSelectedMappedSource;
exports.isSelectedMappedSourceLoading = isSelectedMappedSourceLoading;
exports.getSelectedSourceId = getSelectedSourceId;
exports.getShouldSelectOriginalLocation = getShouldSelectOriginalLocation;
exports.getShouldHighlightSelectedLocation = getShouldHighlightSelectedLocation;
exports.getShouldScrollToSelectedLocation = getShouldScrollToSelectedLocation;
exports.getFirstSourceActorForGeneratedSource = getFirstSourceActorForGeneratedSource;
exports.getSourceActorsForSource = getSourceActorsForSource;
exports.isSourceWithMap = isSourceWithMap;
exports.canPrettyPrintSource = canPrettyPrintSource;
exports.getPrettyPrintMessage = getPrettyPrintMessage;
exports.getBreakpointPositionsForSource = getBreakpointPositionsForSource;
exports.hasBreakpointPositions = hasBreakpointPositions;
exports.getBreakpointPositionsForLine = getBreakpointPositionsForLine;
exports.getBreakpointPositionsForLocation = getBreakpointPositionsForLocation;
exports.getBreakableLines = getBreakableLines;
exports.isSourceOverridden = isSourceOverridden;
exports.getSourcesToRemoveForThread = getSourcesToRemoveForThread;
exports.getSelectedBreakableLines = exports.getSelectedSource = void 0;

var _reselect = require("devtools/client/shared/vendor/reselect");

loader.lazyRequireGetter(this, "_source", "devtools/client/debugger/src/utils/source");
loader.lazyRequireGetter(this, "_breakpointPositions", "devtools/client/debugger/src/utils/breakpoint/breakpointPositions");
loader.lazyRequireGetter(this, "_asyncValue", "devtools/client/debugger/src/utils/async-value");

var _index = require("devtools/client/shared/source-map-loader/index");

loader.lazyRequireGetter(this, "_prefs", "devtools/client/debugger/src/utils/prefs");
loader.lazyRequireGetter(this, "_sources", "devtools/client/debugger/src/reducers/sources");
loader.lazyRequireGetter(this, "_sourceActors", "devtools/client/debugger/src/selectors/source-actors");
loader.lazyRequireGetter(this, "_sourcesContent", "devtools/client/debugger/src/selectors/sources-content");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function hasSource(state, id) {
  return state.sources.mutableSources.has(id);
}

function getSource(state, id) {
  return state.sources.mutableSources.get(id);
}

function getSourceFromId(state, id) {
  const source = getSource(state, id);

  if (!source) {
    console.warn(`source ${id} does not exist`);
  }

  return source;
}

function getSourceByActorId(state, actorId) {
  if (!(0, _sourceActors.hasSourceActor)(state, actorId)) {
    return null;
  }

  return getSource(state, (0, _sourceActors.getSourceActor)(state, actorId).source);
}

function getSourcesByURL(state, url) {
  return state.sources.mutableSourcesPerUrl.get(url) || [];
}

function getSourceByURL(state, url) {
  const foundSources = getSourcesByURL(state, url);
  return foundSources[0];
} // This is used by tabs selectors


function getSpecificSourceByURL(state, url, isOriginal) {
  const foundSources = getSourcesByURL(state, url);
  return foundSources.find(source => source.isOriginal == isOriginal);
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

  if (!source.isOriginal) {
    return source;
  }

  return getSourceFromId(state, (0, _index.originalToGeneratedId)(source.id));
}

function getPendingSelectedLocation(state) {
  return state.sources.pendingSelectedLocation;
}

function getPrettySource(state, id) {
  if (!id) {
    return null;
  }

  const source = getSource(state, id);

  if (!source) {
    return null;
  }

  return getOriginalSourceByURL(state, (0, _source.getPrettySourceURL)(source.url));
} // This is only used by Project Search and tests.


function getSourceList(state) {
  return [...state.sources.mutableSources.values()];
} // This is only used by tests and create.js


function getSourceCount(state) {
  return state.sources.mutableSources.size;
}

function getSelectedLocation(state) {
  return state.sources.selectedLocation;
}
/**
 * Return the "mapped" location for the currently selected location:
 * - When selecting a location in an original source, returns
 *   the related location in the bundle source.
 *
 * - When selecting a location in a bundle source, returns
 *   the related location in the original source. This may return undefined
 *   while we are still computing this information. (we need to query the asynchronous SourceMap service)
 *
 * - Otherwise, when selecting a location in a source unrelated to source map
 *   or a pretty printed source, returns null.
 */


function getSelectedMappedSource(state) {
  const selectedLocation = getSelectedLocation(state);

  if (!selectedLocation) {
    return null;
  } // Don't map pretty printed to its related compressed source


  if (selectedLocation.source.isPrettyPrinted) {
    return null;
  } // If we are on a bundle with a functional source-map,
  // the `selectLocation` action should compute the `selectedOriginalLocation` field.


  if (!selectedLocation.source.isOriginal && (0, _sourceActors.isSourceActorWithSourceMap)(state, selectedLocation.sourceActor.id)) {
    const {
      selectedOriginalLocation
    } = state.sources; // Return undefined if we are still loading the source map.
    // `selectedOriginalLocation` will be set to undefined instead of null

    if (selectedOriginalLocation && selectedOriginalLocation != _sources.UNDEFINED_LOCATION && selectedOriginalLocation != _sources.NO_LOCATION) {
      return selectedOriginalLocation.source;
    }

    return null;
  }

  const mappedSource = getGeneratedSource(state, selectedLocation.source); // getGeneratedSource will return the exact same source object on sources
  // that don't map to any original source. In this case, return null
  // as that's most likely a regular source, not using source maps.

  if (mappedSource == selectedLocation.source) {
    return null;
  }

  return mappedSource || null;
}
/**
 * Helps knowing if we are still computing the mapped location for the currently selected source.
 */


function isSelectedMappedSourceLoading(state) {
  const {
    selectedOriginalLocation
  } = state.sources; // This `selectedOriginalLocation` attribute is set to UNDEFINED_LOCATION when selecting a new source attribute
  // and later on, when the source map is processed, it will switch to either a valid location object, or NO_LOCATION if no valid one if found.

  return selectedOriginalLocation === _sources.UNDEFINED_LOCATION;
}

const getSelectedSource = (0, _reselect.createSelector)(getSelectedLocation, selectedLocation => {
  if (!selectedLocation) {
    return undefined;
  }

  return selectedLocation.source;
}); // This is used by tests and pause reducers

exports.getSelectedSource = getSelectedSource;

function getSelectedSourceId(state) {
  const source = getSelectedSource(state);
  return source?.id;
}

function getShouldSelectOriginalLocation(state) {
  return state.sources.shouldSelectOriginalLocation;
}

function getShouldHighlightSelectedLocation(state) {
  return state.sources.shouldHighlightSelectedLocation;
}

function getShouldScrollToSelectedLocation(state) {
  return state.sources.shouldScrollToSelectedLocation;
}
/**
 * Gets the first source actor for the source and/or thread
 * provided.
 *
 * @param {Object} state
 * @param {String} sourceId
 *         The source used
 * @param {String} [threadId]
 *         The thread to check, this is optional.
 * @param {Object} sourceActor
 *
 */


function getFirstSourceActorForGeneratedSource(state, sourceId, threadId) {
  let source = getSource(state, sourceId); // The source may have been removed if we are being called by async code

  if (!source) {
    return null;
  }

  if (source.isOriginal) {
    source = getSource(state, (0, _index.originalToGeneratedId)(source.id));
  }

  const actors = getSourceActorsForSource(state, source.id);

  if (threadId) {
    return actors.find(actorInfo => actorInfo.thread == threadId) || null;
  }

  return actors[0] || null;
}
/**
 * Get the source actor of the source
 *
 * @param {Object} state
 * @param {String} id
 *        The source id
 * @return {Array<Object>}
 *         List of source actors
 */


function getSourceActorsForSource(state, id) {
  return state.sources.mutableSourceActors.get(id) || [];
}

function isSourceWithMap(state, id) {
  const actors = getSourceActorsForSource(state, id);
  return actors.some(actor => (0, _sourceActors.isSourceActorWithSourceMap)(state, actor.id));
}

function canPrettyPrintSource(state, location) {
  const sourceId = location.source.id;
  const source = getSource(state, sourceId);

  if (!source || (0, _source.isPretty)(source) || source.isOriginal || _prefs.prefs.clientSourceMapsEnabled && isSourceWithMap(state, sourceId)) {
    return false;
  }

  const content = (0, _sourcesContent.getSourceTextContent)(state, location);
  const sourceContent = content && (0, _asyncValue.isFulfilled)(content) ? content.value : null;

  if (!sourceContent || !(0, _source.isJavaScript)(source, sourceContent) && !source.isHTML) {
    return false;
  }

  return true;
}

function getPrettyPrintMessage(state, location) {
  const source = location.source;

  if (!source) {
    return L10N.getStr("sourceTabs.prettyPrint");
  }

  if ((0, _source.isPretty)(source)) {
    return L10N.getStr("sourceFooter.prettyPrint.isPrettyPrintedMessage");
  }

  if (source.isOriginal) {
    return L10N.getStr("sourceFooter.prettyPrint.isOriginalMessage");
  }

  if (_prefs.prefs.clientSourceMapsEnabled && isSourceWithMap(state, source.id)) {
    return L10N.getStr("sourceFooter.prettyPrint.hasSourceMapMessage");
  }

  const content = (0, _sourcesContent.getSourceTextContent)(state, location);
  const sourceContent = content && (0, _asyncValue.isFulfilled)(content) ? content.value : null;

  if (!sourceContent) {
    return L10N.getStr("sourceFooter.prettyPrint.noContentMessage");
  }

  if (!(0, _source.isJavaScript)(source, sourceContent) && !source.isHTML) {
    return L10N.getStr("sourceFooter.prettyPrint.isNotJavascriptMessage");
  }

  return L10N.getStr("sourceTabs.prettyPrint");
}

function getBreakpointPositionsForSource(state, sourceId) {
  return state.sources.mutableBreakpointPositions.get(sourceId);
} // This is only used by one test


function hasBreakpointPositions(state, sourceId) {
  return !!getBreakpointPositionsForSource(state, sourceId);
}

function getBreakpointPositionsForLine(state, sourceId, line) {
  const positions = getBreakpointPositionsForSource(state, sourceId);
  return positions?.[line];
}

function getBreakpointPositionsForLocation(state, location) {
  const sourceId = location.source.id;
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
    return state.sources.mutableOriginalBreakableLines.get(sourceId);
  }

  const sourceActors = getSourceActorsForSource(state, sourceId);

  if (!sourceActors.length) {
    return null;
  } // We pull generated file breakable lines directly from the source actors
  // so that breakable lines can be added as new source actors on HTML loads.


  return (0, _sourceActors.getBreakableLinesForSourceActors)(state, sourceActors, source.isHTML);
}

const getSelectedBreakableLines = (0, _reselect.createSelector)(state => {
  const sourceId = getSelectedSourceId(state);

  if (!sourceId) {
    return null;
  }

  const breakableLines = getBreakableLines(state, sourceId); // Ignore the breakable lines if they are still being fetched from the server

  if (!breakableLines || breakableLines instanceof Promise) {
    return null;
  }

  return breakableLines;
}, breakableLines => new Set(breakableLines || []));
exports.getSelectedBreakableLines = getSelectedBreakableLines;

function isSourceOverridden(toolboxState, source) {
  if (!source || !source.url) {
    return false;
  }

  return !!toolboxState.networkOverrides.mutableOverrides[source.url];
}
/**
 * Compute the list of source actors and source objects to be removed
 * when removing a given target/thread.
 *
 * @param {String} threadActorID
 *        The thread to be removed.
 * @return {Object}
 *         An object with two arrays:
 *         - actors: list of source actor objects to remove
 *         - sources: list of source objects to remove
 */


function getSourcesToRemoveForThread(state, threadActorID) {
  const sourcesToRemove = [];
  const actorsToRemove = [];

  for (const [sourceId, actorsForSource] of state.sources.mutableSourceActors.entries()) {
    let removedActorsCount = 0; // Find all actors for the current source which belongs to the given thread actor

    for (const actor of actorsForSource) {
      if (actor.thread == threadActorID) {
        actorsToRemove.push(actor);
        removedActorsCount++;
      }
    } // If we are about to remove all source actors for the current source,
    // or if for some unexpected reason we have a source with no actors,
    // notify the caller to also remove this source.


    if (removedActorsCount == actorsForSource.length || !actorsForSource.length) {
      sourcesToRemove.push(state.sources.mutableSources.get(sourceId)); // Also remove any original sources related to this generated source

      const originalSourceIds = state.sources.mutableOriginalSources.get(sourceId);

      if (originalSourceIds?.length > 0) {
        for (const originalSourceId of originalSourceIds) {
          sourcesToRemove.push(state.sources.mutableSources.get(originalSourceId));
        }
      }
    }
  }

  return {
    actors: actorsToRemove,
    sources: sourcesToRemove
  };
}