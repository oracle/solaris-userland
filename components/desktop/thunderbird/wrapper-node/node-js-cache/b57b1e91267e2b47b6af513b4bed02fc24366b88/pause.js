"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSelectedFrame = getSelectedFrame;
exports.getContext = getContext;
exports.getThreadContext = getThreadContext;
exports.getPauseReason = getPauseReason;
exports.getPauseCommand = getPauseCommand;
exports.isStepping = isStepping;
exports.getCurrentThread = getCurrentThread;
exports.getIsPaused = getIsPaused;
exports.getIsCurrentThreadPaused = getIsCurrentThreadPaused;
exports.isEvaluatingExpression = isEvaluatingExpression;
exports.getIsWaitingOnBreak = getIsWaitingOnBreak;
exports.getShouldPauseOnExceptions = getShouldPauseOnExceptions;
exports.getShouldPauseOnCaughtExceptions = getShouldPauseOnCaughtExceptions;
exports.getFrames = getFrames;
exports.getCurrentThreadFrames = getCurrentThreadFrames;
exports.getGeneratedFrameScope = getGeneratedFrameScope;
exports.getOriginalFrameScope = getOriginalFrameScope;
exports.getFrameScopes = getFrameScopes;
exports.getSelectedFrameBindings = getSelectedFrameBindings;
exports.getSelectedScope = getSelectedScope;
exports.getSelectedOriginalScope = getSelectedOriginalScope;
exports.getSelectedGeneratedScope = getSelectedGeneratedScope;
exports.getSelectedScopeMappings = getSelectedScopeMappings;
exports.getSelectedFrameId = getSelectedFrameId;
exports.isTopFrameSelected = isTopFrameSelected;
exports.getTopFrame = getTopFrame;
exports.getSkipPausing = getSkipPausing;
exports.getHighlightedCalls = getHighlightedCalls;
exports.isMapScopesEnabled = isMapScopesEnabled;
exports.getInlinePreviews = getInlinePreviews;
exports.getSelectedInlinePreviews = getSelectedInlinePreviews;
exports.getLastExpandedScopes = getLastExpandedScopes;
exports.getPausePreviewLocation = getPausePreviewLocation;
exports.getVisibleSelectedFrame = void 0;
loader.lazyRequireGetter(this, "_pause", "devtools/client/debugger/src/reducers/pause");
loader.lazyRequireGetter(this, "_sources", "devtools/client/debugger/src/selectors/sources");

var _devtoolsSourceMap = require("devtools/client/shared/source-map/index.js");

loader.lazyRequireGetter(this, "_selectedLocation", "devtools/client/debugger/src/utils/selected-location");

var _reselect = require("devtools/client/shared/vendor/reselect");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
// eslint-disable-next-line
const getSelectedFrames = (0, _reselect.createSelector)(state => state.pause.threads, threadPauseState => {
  const selectedFrames = {};

  for (const thread in threadPauseState) {
    const pausedThread = threadPauseState[thread];
    const {
      selectedFrameId,
      frames
    } = pausedThread;

    if (frames) {
      selectedFrames[thread] = frames.find(frame => frame.id == selectedFrameId);
    }
  }

  return selectedFrames;
});

function getSelectedFrame(state, thread) {
  const selectedFrames = getSelectedFrames(state);
  return selectedFrames[thread];
}

const getVisibleSelectedFrame = (0, _reselect.createSelector)(_sources.getSelectedLocation, getSelectedFrames, getCurrentThread, (selectedLocation, selectedFrames, thread) => {
  const selectedFrame = selectedFrames[thread];

  if (!selectedFrame) {
    return null;
  }

  const {
    id,
    displayName
  } = selectedFrame;
  return {
    id,
    displayName,
    location: (0, _selectedLocation.getSelectedLocation)(selectedFrame, selectedLocation)
  };
});
exports.getVisibleSelectedFrame = getVisibleSelectedFrame;

function getContext(state) {
  return state.pause.cx;
}

function getThreadContext(state) {
  return state.pause.threadcx;
}

function getPauseReason(state, thread) {
  return (0, _pause.getThreadPauseState)(state.pause, thread).why;
}

function getPauseCommand(state, thread) {
  return (0, _pause.getThreadPauseState)(state.pause, thread).command;
}

function isStepping(state, thread) {
  return ["stepIn", "stepOver", "stepOut"].includes(getPauseCommand(state, thread));
}

function getCurrentThread(state) {
  return getThreadContext(state).thread;
}

function getIsPaused(state, thread) {
  return (0, _pause.getThreadPauseState)(state.pause, thread).isPaused;
}

function getIsCurrentThreadPaused(state) {
  return getIsPaused(state, getCurrentThread(state));
}

function isEvaluatingExpression(state, thread) {
  return (0, _pause.getThreadPauseState)(state.pause, thread).command === "expression";
}

function getIsWaitingOnBreak(state, thread) {
  return (0, _pause.getThreadPauseState)(state.pause, thread).isWaitingOnBreak;
}

function getShouldPauseOnExceptions(state) {
  return state.pause.shouldPauseOnExceptions;
}

function getShouldPauseOnCaughtExceptions(state) {
  return state.pause.shouldPauseOnCaughtExceptions;
}

function getFrames(state, thread) {
  const {
    frames,
    framesLoading
  } = (0, _pause.getThreadPauseState)(state.pause, thread);
  return framesLoading ? null : frames;
}

function getCurrentThreadFrames(state) {
  const {
    frames,
    framesLoading
  } = (0, _pause.getThreadPauseState)(state.pause, getCurrentThread(state));
  return framesLoading ? null : frames;
}

function getGeneratedFrameId(frameId) {
  if (frameId.includes("-originalFrame")) {
    // The mapFrames can add original stack frames -- get generated frameId.
    return frameId.substr(0, frameId.lastIndexOf("-originalFrame"));
  }

  return frameId;
}

function getGeneratedFrameScope(state, thread, frameId) {
  if (!frameId) {
    return null;
  }

  return getFrameScopes(state, thread).generated[getGeneratedFrameId(frameId)];
}

function getOriginalFrameScope(state, thread, sourceId, frameId) {
  if (!frameId || !sourceId) {
    return null;
  }

  const isGenerated = (0, _devtoolsSourceMap.isGeneratedId)(sourceId);
  const original = getFrameScopes(state, thread).original[getGeneratedFrameId(frameId)];

  if (!isGenerated && original && (original.pending || original.scope)) {
    return original;
  }

  return null;
} // This is only used by tests


function getFrameScopes(state, thread) {
  return (0, _pause.getThreadPauseState)(state.pause, thread).frameScopes;
}

function getSelectedFrameBindings(state, thread) {
  const scopes = getFrameScopes(state, thread);
  const selectedFrameId = getSelectedFrameId(state, thread);

  if (!scopes || !selectedFrameId) {
    return null;
  }

  const frameScope = scopes.generated[selectedFrameId];

  if (!frameScope || frameScope.pending) {
    return;
  }

  let currentScope = frameScope.scope;
  let frameBindings = [];

  while (currentScope && currentScope.type != "object") {
    if (currentScope.bindings) {
      const bindings = Object.keys(currentScope.bindings.variables);
      const args = [].concat(...currentScope.bindings.arguments.map(argument => Object.keys(argument)));
      frameBindings = [...frameBindings, ...bindings, ...args];
    }

    currentScope = currentScope.parent;
  }

  return frameBindings;
}

function getFrameScope(state, thread, sourceId, frameId) {
  return getOriginalFrameScope(state, thread, sourceId, frameId) || getGeneratedFrameScope(state, thread, frameId);
} // This is only used by tests


function getSelectedScope(state, thread) {
  const sourceId = (0, _sources.getSelectedSourceId)(state);
  const frameId = getSelectedFrameId(state, thread);
  const frameScope = getFrameScope(state, thread, sourceId, frameId);

  if (!frameScope) {
    return null;
  }

  return frameScope.scope || null;
}

function getSelectedOriginalScope(state, thread) {
  const sourceId = (0, _sources.getSelectedSourceId)(state);
  const frameId = getSelectedFrameId(state, thread);
  return getOriginalFrameScope(state, thread, sourceId, frameId);
}

function getSelectedGeneratedScope(state, thread) {
  const frameId = getSelectedFrameId(state, thread);
  return getGeneratedFrameScope(state, thread, frameId);
}

function getSelectedScopeMappings(state, thread) {
  const frameId = getSelectedFrameId(state, thread);

  if (!frameId) {
    return null;
  }

  return getFrameScopes(state, thread).mappings[frameId];
}

function getSelectedFrameId(state, thread) {
  return (0, _pause.getThreadPauseState)(state.pause, thread).selectedFrameId;
}

function isTopFrameSelected(state, thread) {
  const selectedFrameId = getSelectedFrameId(state, thread);
  const topFrame = getTopFrame(state, thread);
  return selectedFrameId == (topFrame === null || topFrame === void 0 ? void 0 : topFrame.id);
}

function getTopFrame(state, thread) {
  const frames = getFrames(state, thread);
  return frames === null || frames === void 0 ? void 0 : frames[0];
}

function getSkipPausing(state) {
  return state.pause.skipPausing;
}

function getHighlightedCalls(state, thread) {
  return (0, _pause.getThreadPauseState)(state.pause, thread).highlightedCalls;
}

function isMapScopesEnabled(state) {
  return state.pause.mapScopes;
}

function getInlinePreviews(state, thread, frameId) {
  return (0, _pause.getThreadPauseState)(state.pause, thread).inlinePreview[getGeneratedFrameId(frameId)];
} // This is only used by tests


function getSelectedInlinePreviews(state) {
  const thread = getCurrentThread(state);
  const frameId = getSelectedFrameId(state, thread);

  if (!frameId) {
    return null;
  }

  return getInlinePreviews(state, thread, frameId);
}

function getLastExpandedScopes(state, thread) {
  return (0, _pause.getThreadPauseState)(state.pause, thread).lastExpandedScopes;
}

function getPausePreviewLocation(state) {
  return state.pause.previewLocation;
}