"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getContext = getContext;
exports.getThreadContext = getThreadContext;
exports.getPauseReason = getPauseReason;
exports.getPauseCommand = getPauseCommand;
exports.wasStepping = wasStepping;
exports.isStepping = isStepping;
exports.getCurrentThread = getCurrentThread;
exports.getIsPaused = getIsPaused;
exports.getPreviousPauseFrameLocation = getPreviousPauseFrameLocation;
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
exports.getFrameScope = getFrameScope;
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
exports.getInlinePreviewExpression = getInlinePreviewExpression;
exports.getChromeScopes = getChromeScopes;
exports.getLastExpandedScopes = getLastExpandedScopes;
exports.getPausePreviewLocation = getPausePreviewLocation;
exports.default = void 0;

var _devtoolsSourceMap = require("devtools/client/shared/source-map/index.js");

loader.lazyRequireGetter(this, "_prefs", "devtools/client/debugger/src/utils/prefs");
loader.lazyRequireGetter(this, "_sources", "devtools/client/debugger/src/reducers/sources");
loader.lazyRequireGetter(this, "_pause", "devtools/client/debugger/src/selectors/pause");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

/* eslint complexity: ["error", 35]*/

/**
 * Pause reducer
 * @module reducers/pause
 */
function createPauseState(thread = "UnknownThread") {
  return {
    cx: {
      navigateCounter: 0
    },
    threadcx: {
      navigateCounter: 0,
      thread,
      isPaused: false,
      pauseCounter: 0
    },
    previewLocation: null,
    highlightedCalls: null,
    threads: {},
    skipPausing: _prefs.prefs.skipPausing,
    mapScopes: _prefs.prefs.mapScopes,
    shouldPauseOnExceptions: _prefs.prefs.pauseOnExceptions,
    shouldPauseOnCaughtExceptions: _prefs.prefs.pauseOnCaughtExceptions
  };
}

const resumedPauseState = {
  frames: null,
  framesLoading: false,
  frameScopes: {
    generated: {},
    original: {},
    mappings: {}
  },
  selectedFrameId: null,
  why: null,
  inlinePreview: {},
  highlightedCalls: null
};

const createInitialPauseState = () => ({ ...resumedPauseState,
  isWaitingOnBreak: false,
  command: null,
  lastCommand: null,
  previousLocation: null,
  expandedScopes: new Set(),
  lastExpandedScopes: []
});

function getThreadPauseState(state, thread) {
  // Thread state is lazily initialized so that we don't have to keep track of
  // the current set of worker threads.
  return state.threads[thread] || createInitialPauseState();
}

function update(state = createPauseState(), action) {
  // Actions need to specify any thread they are operating on. These helpers
  // manage updating the pause state for that thread.
  const threadState = () => {
    if (!action.thread) {
      throw new Error(`Missing thread in action ${action.type}`);
    }

    return getThreadPauseState(state, action.thread);
  };

  const updateThreadState = newThreadState => {
    if (!action.thread) {
      throw new Error(`Missing thread in action ${action.type}`);
    }

    return { ...state,
      threads: { ...state.threads,
        [action.thread]: { ...threadState(),
          ...newThreadState
        }
      }
    };
  };

  switch (action.type) {
    case "SELECT_THREAD":
      {
        return { ...state,
          threadcx: { ...state.threadcx,
            thread: action.thread,
            isPaused: !!threadState().frames,
            pauseCounter: state.threadcx.pauseCounter + 1
          }
        };
      }

    case "PAUSED":
      {
        const {
          thread,
          frame,
          why
        } = action;
        state = { ...state,
          previewLocation: null,
          threadcx: { ...state.threadcx,
            pauseCounter: state.threadcx.pauseCounter + 1,
            thread,
            isPaused: true
          }
        };
        return updateThreadState({
          isWaitingOnBreak: false,
          selectedFrameId: frame ? frame.id : undefined,
          frames: frame ? [frame] : undefined,
          framesLoading: true,
          frameScopes: { ...resumedPauseState.frameScopes
          },
          why
        });
      }

    case "FETCHED_FRAMES":
      {
        const {
          frames
        } = action;
        return updateThreadState({
          frames,
          framesLoading: false
        });
      }

    case "PREVIEW_PAUSED_LOCATION":
      {
        return { ...state,
          previewLocation: action.location
        };
      }

    case "CLEAR_PREVIEW_PAUSED_LOCATION":
      {
        return { ...state,
          previewLocation: null
        };
      }

    case "MAP_FRAMES":
      {
        const {
          selectedFrameId,
          frames
        } = action;
        return updateThreadState({
          frames,
          selectedFrameId
        });
      }

    case "MAP_FRAME_DISPLAY_NAMES":
      {
        const {
          frames
        } = action;
        return updateThreadState({
          frames
        });
      }

    case "ADD_SCOPES":
      {
        const {
          frame,
          status,
          value
        } = action;
        const selectedFrameId = frame.id;
        const generated = { ...threadState().frameScopes.generated,
          [selectedFrameId]: {
            pending: status !== "done",
            scope: value
          }
        };
        return updateThreadState({
          frameScopes: { ...threadState().frameScopes,
            generated
          }
        });
      }

    case "MAP_SCOPES":
      {
        const {
          frame,
          status,
          value
        } = action;
        const selectedFrameId = frame.id;
        const original = { ...threadState().frameScopes.original,
          [selectedFrameId]: {
            pending: status !== "done",
            scope: value === null || value === void 0 ? void 0 : value.scope
          }
        };
        const mappings = { ...threadState().frameScopes.mappings,
          [selectedFrameId]: value === null || value === void 0 ? void 0 : value.mappings
        };
        return updateThreadState({
          frameScopes: { ...threadState().frameScopes,
            original,
            mappings
          }
        });
      }

    case "BREAK_ON_NEXT":
      return updateThreadState({
        isWaitingOnBreak: true
      });

    case "SELECT_FRAME":
      return updateThreadState({
        selectedFrameId: action.frame.id
      });

    case "CONNECT":
      return { ...createPauseState(action.mainThread.actor)
      };

    case "PAUSE_ON_EXCEPTIONS":
      {
        const {
          shouldPauseOnExceptions,
          shouldPauseOnCaughtExceptions
        } = action;
        _prefs.prefs.pauseOnExceptions = shouldPauseOnExceptions;
        _prefs.prefs.pauseOnCaughtExceptions = shouldPauseOnCaughtExceptions; // Preserving for the old debugger

        _prefs.prefs.ignoreCaughtExceptions = !shouldPauseOnCaughtExceptions;
        return { ...state,
          shouldPauseOnExceptions,
          shouldPauseOnCaughtExceptions
        };
      }

    case "COMMAND":
      if (action.status === "start") {
        return updateThreadState({ ...resumedPauseState,
          command: action.command,
          lastCommand: action.command,
          previousLocation: getPauseLocation(threadState(), action)
        });
      }

      return updateThreadState({
        command: null
      });

    case "RESUME":
      {
        if (action.thread == state.threadcx.thread) {
          state = { ...state,
            threadcx: { ...state.threadcx,
              pauseCounter: state.threadcx.pauseCounter + 1,
              isPaused: false
            }
          };
        }

        return updateThreadState({ ...resumedPauseState,
          wasStepping: !!action.wasStepping,
          expandedScopes: new Set(),
          lastExpandedScopes: [...threadState().expandedScopes]
        });
      }

    case "EVALUATE_EXPRESSION":
      return updateThreadState({
        command: action.status === "start" ? "expression" : null
      });

    case "NAVIGATE":
      {
        const navigateCounter = state.cx.navigateCounter + 1;
        return { ...state,
          cx: {
            navigateCounter
          },
          threadcx: {
            navigateCounter,
            thread: action.mainThread.actor,
            pauseCounter: 0,
            isPaused: false
          },
          threads: {
            [action.mainThread.actor]: { ...getThreadPauseState(state, action.mainThread.actor),
              ...resumedPauseState
            }
          }
        };
      }

    case "TOGGLE_SKIP_PAUSING":
      {
        const {
          skipPausing
        } = action;
        _prefs.prefs.skipPausing = skipPausing;
        return { ...state,
          skipPausing
        };
      }

    case "TOGGLE_MAP_SCOPES":
      {
        const {
          mapScopes
        } = action;
        _prefs.prefs.mapScopes = mapScopes;
        return { ...state,
          mapScopes
        };
      }

    case "SET_EXPANDED_SCOPE":
      {
        const {
          path,
          expanded
        } = action;
        const expandedScopes = new Set(threadState().expandedScopes);

        if (expanded) {
          expandedScopes.add(path);
        } else {
          expandedScopes.delete(path);
        }

        return updateThreadState({
          expandedScopes
        });
      }

    case "ADD_INLINE_PREVIEW":
      {
        const {
          frame,
          previews
        } = action;
        const selectedFrameId = frame.id;
        return updateThreadState({
          inlinePreview: { ...threadState().inlinePreview,
            [selectedFrameId]: previews
          }
        });
      }

    case "HIGHLIGHT_CALLS":
      {
        const {
          highlightedCalls
        } = action;
        return updateThreadState({ ...threadState(),
          highlightedCalls
        });
      }

    case "UNHIGHLIGHT_CALLS":
      {
        return updateThreadState({ ...threadState(),
          highlightedCalls: null
        });
      }
  }

  return state;
}

function getPauseLocation(state, action) {
  const {
    frames,
    previousLocation
  } = state; // NOTE: We store the previous location so that we ensure that we
  // do not stop at the same location twice when we step over.

  if (action.command !== "stepOver") {
    return null;
  }

  const frame = frames === null || frames === void 0 ? void 0 : frames[0];

  if (!frame) {
    return previousLocation;
  }

  return {
    location: frame.location,
    generatedLocation: frame.generatedLocation
  };
} // Selectors


function getContext(state) {
  return state.pause.cx;
}

function getThreadContext(state) {
  return state.pause.threadcx;
}

function getPauseReason(state, thread) {
  return getThreadPauseState(state.pause, thread).why;
}

function getPauseCommand(state, thread) {
  return getThreadPauseState(state.pause, thread).command;
}

function wasStepping(state, thread) {
  return getThreadPauseState(state.pause, thread).wasStepping;
}

function isStepping(state, thread) {
  return ["stepIn", "stepOver", "stepOut"].includes(getPauseCommand(state, thread));
}

function getCurrentThread(state) {
  return getThreadContext(state).thread;
}

function getIsPaused(state, thread) {
  return !!getThreadPauseState(state.pause, thread).frames;
}

function getPreviousPauseFrameLocation(state, thread) {
  return getThreadPauseState(state.pause, thread).previousLocation;
}

function isEvaluatingExpression(state, thread) {
  return getThreadPauseState(state.pause, thread).command === "expression";
}

function getIsWaitingOnBreak(state, thread) {
  return getThreadPauseState(state.pause, thread).isWaitingOnBreak;
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
  } = getThreadPauseState(state.pause, thread);
  return framesLoading ? null : frames;
}

function getCurrentThreadFrames(state) {
  const {
    frames,
    framesLoading
  } = getThreadPauseState(state.pause, getCurrentThread(state));
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
}

function getFrameScopes(state, thread) {
  return getThreadPauseState(state.pause, thread).frameScopes;
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
}

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
  return getThreadPauseState(state.pause, thread).selectedFrameId;
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
  return getThreadPauseState(state.pause, thread).highlightedCalls;
}

function isMapScopesEnabled(state) {
  return state.pause.mapScopes;
}

function getInlinePreviews(state, thread, frameId) {
  return getThreadPauseState(state.pause, thread).inlinePreview[getGeneratedFrameId(frameId)];
}

function getSelectedInlinePreviews(state) {
  const thread = getCurrentThread(state);
  const frameId = getSelectedFrameId(state, thread);

  if (!frameId) {
    return null;
  }

  return getInlinePreviews(state, thread, frameId);
}

function getInlinePreviewExpression(state, thread, frameId, line, expression) {
  var _previews$line;

  const previews = getThreadPauseState(state.pause, thread).inlinePreview[getGeneratedFrameId(frameId)];
  return previews === null || previews === void 0 ? void 0 : (_previews$line = previews[line]) === null || _previews$line === void 0 ? void 0 : _previews$line[expression];
} // NOTE: currently only used for chrome


function getChromeScopes(state, thread) {
  const frame = (0, _pause.getSelectedFrame)(state, thread);
  return frame === null || frame === void 0 ? void 0 : frame.scopeChain;
}

function getLastExpandedScopes(state, thread) {
  return getThreadPauseState(state.pause, thread).lastExpandedScopes;
}

function getPausePreviewLocation(state) {
  return state.pause.previewLocation;
}

var _default = update;
exports.default = _default;