"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getContext = getContext;
exports.getThreadContext = getThreadContext;
exports.getNavigateCounter = getNavigateCounter;
exports.getPauseReason = getPauseReason;
exports.getShouldBreakpointsPaneOpenOnPause = getShouldBreakpointsPaneOpenOnPause;
exports.getPauseCommand = getPauseCommand;
exports.isStepping = isStepping;
exports.getCurrentThread = getCurrentThread;
exports.getIsPaused = getIsPaused;
exports.getIsCurrentThreadPaused = getIsCurrentThreadPaused;
exports.isEvaluatingExpression = isEvaluatingExpression;
exports.getIsWaitingOnBreak = getIsWaitingOnBreak;
exports.getShouldPauseOnDebuggerStatement = getShouldPauseOnDebuggerStatement;
exports.getShouldPauseOnExceptions = getShouldPauseOnExceptions;
exports.getShouldPauseOnCaughtExceptions = getShouldPauseOnCaughtExceptions;
exports.getFrames = getFrames;
exports.getGeneratedFrameScope = getGeneratedFrameScope;
exports.getOriginalFrameScope = getOriginalFrameScope;
exports.getFrameScopes = getFrameScopes;
exports.getSelectedFrameBindings = getSelectedFrameBindings;
exports.getSelectedScope = getSelectedScope;
exports.getSelectedOriginalScope = getSelectedOriginalScope;
exports.getSelectedScopeMappings = getSelectedScopeMappings;
exports.getSelectedFrameId = getSelectedFrameId;
exports.isTopFrameSelected = isTopFrameSelected;
exports.getTopFrame = getTopFrame;
exports.getCurrentlyFetchedTopFrame = getCurrentlyFetchedTopFrame;
exports.hasFrame = hasFrame;
exports.getSkipPausing = getSkipPausing;
exports.isMapScopesEnabled = isMapScopesEnabled;
exports.getSelectedFrameInlinePreviews = getSelectedFrameInlinePreviews;
exports.getInlinePreviews = getInlinePreviews;
exports.getLastExpandedScopes = getLastExpandedScopes;
exports.getCurrentThreadFrames = exports.getVisibleSelectedFrame = exports.getSelectedFrame = void 0;
loader.lazyRequireGetter(this, "_pause", "devtools/client/debugger/src/reducers/pause");
loader.lazyRequireGetter(this, "_sources", "devtools/client/debugger/src/selectors/sources");
loader.lazyRequireGetter(this, "_sourceBlackbox", "devtools/client/debugger/src/selectors/source-blackbox");
loader.lazyRequireGetter(this, "_tracer", "devtools/client/debugger/src/selectors/tracer");
loader.lazyRequireGetter(this, "_selectedLocation", "devtools/client/debugger/src/utils/selected-location");
loader.lazyRequireGetter(this, "_source", "devtools/client/debugger/src/utils/source");

var _reselect = require("devtools/client/shared/vendor/reselect");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
// eslint-disable-next-line
const getSelectedFrame = (0, _reselect.createSelector)((state, thread) => state.pause.threads[thread || getCurrentThread(state)], threadPauseState => {
  if (!threadPauseState) {
    return null;
  }

  const {
    selectedFrameId,
    frames
  } = threadPauseState;

  if (frames) {
    return frames.find(frame => frame.id == selectedFrameId);
  }

  return null;
});
exports.getSelectedFrame = getSelectedFrame;
const getVisibleSelectedFrame = (0, _reselect.createSelector)(_sources.getSelectedLocation, state => getSelectedFrame(state, getCurrentThread(state)), (selectedLocation, selectedFrame) => {
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

function getNavigateCounter(state) {
  return state.pause.threadcx.navigateCounter;
}

function getPauseReason(state, thread) {
  return (0, _pause.getThreadPauseState)(state.pause, thread).why;
}

function getShouldBreakpointsPaneOpenOnPause(state, thread) {
  return (0, _pause.getThreadPauseState)(state.pause, thread).shouldBreakpointsPaneOpenOnPause;
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

function getShouldPauseOnDebuggerStatement(state) {
  return state.pause.shouldPauseOnDebuggerStatement;
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

const getCurrentThreadFrames = (0, _reselect.createSelector)(state => {
  const {
    frames,
    framesLoading
  } = (0, _pause.getThreadPauseState)(state.pause, getCurrentThread(state));

  if (framesLoading) {
    return [];
  }

  return frames;
}, _sourceBlackbox.getBlackBoxRanges, (frames, blackboxedRanges) => {
  return frames.filter(frame => !(0, _source.isFrameBlackBoxed)(frame, blackboxedRanges));
});
exports.getCurrentThreadFrames = getCurrentThreadFrames;

function getGeneratedFrameId(frameId) {
  if (frameId.includes("-originalFrame")) {
    // The mapFrames can add original stack frames -- get generated frameId.
    return frameId.substr(0, frameId.lastIndexOf("-originalFrame"));
  }

  return frameId;
} // This is Environment Scope information from the platform.
// See https://searchfox.org/mozilla-central/rev/b0e8e4ceb46cb3339cdcb90310fcc161ef4b9e3e/devtools/server/actors/environment.js#42-81


function getGeneratedFrameScope(state, frame) {
  if (!frame) {
    return null;
  }

  return getFrameScopes(state, frame.thread).generated[getGeneratedFrameId(frame.id)];
}

function getOriginalFrameScope(state, frame) {
  if (!frame) {
    return null;
  } // Only compute original scope if we are currently showing an original source.


  const source = (0, _sources.getSelectedSource)(state);

  if (!source || !source.isOriginal) {
    return null;
  }

  const original = getFrameScopes(state, frame.thread).original[getGeneratedFrameId(frame.id)];

  if (original && (original.pending || original.scope)) {
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
    return null;
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

function getSelectedScope(state) {
  const frame = getSelectedFrame(state);

  if (!frame) {
    return null;
  }

  let scopes; // For non-pretty printed original sources

  if (frame.location.source.isOriginal && !frame.location.source.isPrettyPrinted && !frame.generatedLocation?.source.isWasm) {
    scopes = getOriginalFrameScope(state, frame)?.scope; // Fallback to the generated scopes if there are no original scopes

    if (!scopes) {
      scopes = getGeneratedFrameScope(state, frame)?.scope;
    }
  } else {
    // For generated sources
    // For pretty printed sources - Even though are seen as original sources they do not include any rename of variables/function names.
    scopes = getGeneratedFrameScope(state, frame)?.scope;
  }

  return scopes;
}

function getSelectedOriginalScope(state, thread) {
  const frame = getSelectedFrame(state, thread);
  return getOriginalFrameScope(state, frame);
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
  const selectedFrameId = getSelectedFrameId(state, thread); // Consider that the top frame is selected when none is specified,
  // which happens when a JS Tracer frame is selected.

  if (!selectedFrameId) {
    return true;
  }

  const topFrame = getTopFrame(state, thread);
  return selectedFrameId == topFrame?.id;
}

function getTopFrame(state, thread) {
  const frames = getFrames(state, thread);
  return frames?.[0];
} // getTopFrame wouldn't return the top frame if the frames are still being fetched


function getCurrentlyFetchedTopFrame(state, thread) {
  const {
    frames
  } = (0, _pause.getThreadPauseState)(state.pause, thread);
  return frames?.[0];
}

function hasFrame(state, frame) {
  // Don't use getFrames as it returns null when the frames are still loading
  const {
    frames
  } = (0, _pause.getThreadPauseState)(state.pause, frame.thread);

  if (!frames) {
    return false;
  } // Compare IDs and not frame objects as they get cloned during mapping


  return frames.some(f => f.id == frame.id);
}

function getSkipPausing(state) {
  return state.pause.skipPausing;
}

function isMapScopesEnabled(state) {
  return state.pause.mapScopes;
}
/**
 * This selector only returns inline previews object for current paused location.
 * (it ignores the JS Tracer and ignore the selected location, which may different from paused location)
 */


function getSelectedFrameInlinePreviews(state) {
  const thread = getCurrentThread(state);
  const frame = getSelectedFrame(state, thread);

  if (!frame) {
    return null;
  }

  return (0, _pause.getThreadPauseState)(state.pause, thread).inlinePreview[getGeneratedFrameId(frame.id)];
}
/**
 * This selector returns the inline previews object for the selected location.
 * It considers both paused and traced previews and will only return values
 * if it matches the currently selected location.
 */


function getInlinePreviews(state) {
  const selectedSource = (0, _sources.getSelectedSource)(state);

  if (!selectedSource) {
    return null;
  } // We first check if a frame in the JS Tracer was selected and generated its previews


  if (state.tracerFrames?.previews) {
    const selectedTraceSource = (0, _tracer.getSelectedTraceSource)(state);

    if (selectedTraceSource) {
      if (selectedTraceSource.id == selectedSource.id) {
        return state.tracerFrames?.previews;
      } // If the "selected" versus "tracing selected" sources don't match, it means that we selected the original source
      // while the traced source is the generated one. We don't yet support showing inline previews in this configuration.


      return null;
    }
  } // Otherwise, we fallback to look if we were paused and the inline preview is available


  const thread = getCurrentThread(state);
  const frame = getSelectedFrame(state, thread); // When we are paused, we also check if the selected source matches the paused original or generated location.

  if (!frame || frame.location.source.id != selectedSource.id && frame.generatedLocation.source.id != selectedSource.id) {
    return null;
  }

  return (0, _pause.getThreadPauseState)(state.pause, thread).inlinePreview[getGeneratedFrameId(frame.id)];
}

function getLastExpandedScopes(state, thread) {
  return (0, _pause.getThreadPauseState)(state.pause, thread).lastExpandedScopes;
}