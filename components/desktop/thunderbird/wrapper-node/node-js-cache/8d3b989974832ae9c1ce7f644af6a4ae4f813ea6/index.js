"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "selectThread", {
  enumerable: true,
  get: function () {
    return _commands.selectThread;
  }
});
Object.defineProperty(exports, "stepIn", {
  enumerable: true,
  get: function () {
    return _commands.stepIn;
  }
});
Object.defineProperty(exports, "stepOver", {
  enumerable: true,
  get: function () {
    return _commands.stepOver;
  }
});
Object.defineProperty(exports, "stepOut", {
  enumerable: true,
  get: function () {
    return _commands.stepOut;
  }
});
Object.defineProperty(exports, "resume", {
  enumerable: true,
  get: function () {
    return _commands.resume;
  }
});
Object.defineProperty(exports, "restart", {
  enumerable: true,
  get: function () {
    return _commands.restart;
  }
});
Object.defineProperty(exports, "fetchFrames", {
  enumerable: true,
  get: function () {
    return _fetchFrames.fetchFrames;
  }
});
Object.defineProperty(exports, "fetchScopes", {
  enumerable: true,
  get: function () {
    return _fetchScopes.fetchScopes;
  }
});
Object.defineProperty(exports, "paused", {
  enumerable: true,
  get: function () {
    return _paused.paused;
  }
});
Object.defineProperty(exports, "resumed", {
  enumerable: true,
  get: function () {
    return _resumed.resumed;
  }
});
Object.defineProperty(exports, "continueToHere", {
  enumerable: true,
  get: function () {
    return _continueToHere.continueToHere;
  }
});
Object.defineProperty(exports, "breakOnNext", {
  enumerable: true,
  get: function () {
    return _breakOnNext.breakOnNext;
  }
});
Object.defineProperty(exports, "resetBreakpointsPaneState", {
  enumerable: true,
  get: function () {
    return _resetBreakpointsPaneState.resetBreakpointsPaneState;
  }
});
Object.defineProperty(exports, "mapFrames", {
  enumerable: true,
  get: function () {
    return _mapFrames.mapFrames;
  }
});
Object.defineProperty(exports, "updateAllFrameDisplayNames", {
  enumerable: true,
  get: function () {
    return _mapFrames.updateAllFrameDisplayNames;
  }
});
Object.defineProperty(exports, "pauseOnDebuggerStatement", {
  enumerable: true,
  get: function () {
    return _pauseOnDebuggerStatement.pauseOnDebuggerStatement;
  }
});
Object.defineProperty(exports, "pauseOnExceptions", {
  enumerable: true,
  get: function () {
    return _pauseOnExceptions.pauseOnExceptions;
  }
});
Object.defineProperty(exports, "selectFrame", {
  enumerable: true,
  get: function () {
    return _selectFrame.selectFrame;
  }
});
Object.defineProperty(exports, "toggleSkipPausing", {
  enumerable: true,
  get: function () {
    return _skipPausing.toggleSkipPausing;
  }
});
Object.defineProperty(exports, "setSkipPausing", {
  enumerable: true,
  get: function () {
    return _skipPausing.setSkipPausing;
  }
});
Object.defineProperty(exports, "toggleMapScopes", {
  enumerable: true,
  get: function () {
    return _mapScopes.toggleMapScopes;
  }
});
Object.defineProperty(exports, "setExpandedScope", {
  enumerable: true,
  get: function () {
    return _expandScopes.setExpandedScope;
  }
});
Object.defineProperty(exports, "generateInlinePreview", {
  enumerable: true,
  get: function () {
    return _inlinePreview.generateInlinePreview;
  }
});
loader.lazyRequireGetter(this, "_commands", "devtools/client/debugger/src/actions/pause/commands");
loader.lazyRequireGetter(this, "_fetchFrames", "devtools/client/debugger/src/actions/pause/fetchFrames");
loader.lazyRequireGetter(this, "_fetchScopes", "devtools/client/debugger/src/actions/pause/fetchScopes");
loader.lazyRequireGetter(this, "_paused", "devtools/client/debugger/src/actions/pause/paused");
loader.lazyRequireGetter(this, "_resumed", "devtools/client/debugger/src/actions/pause/resumed");
loader.lazyRequireGetter(this, "_continueToHere", "devtools/client/debugger/src/actions/pause/continueToHere");
loader.lazyRequireGetter(this, "_breakOnNext", "devtools/client/debugger/src/actions/pause/breakOnNext");
loader.lazyRequireGetter(this, "_resetBreakpointsPaneState", "devtools/client/debugger/src/actions/pause/resetBreakpointsPaneState");
loader.lazyRequireGetter(this, "_mapFrames", "devtools/client/debugger/src/actions/pause/mapFrames");
loader.lazyRequireGetter(this, "_pauseOnDebuggerStatement", "devtools/client/debugger/src/actions/pause/pauseOnDebuggerStatement");
loader.lazyRequireGetter(this, "_pauseOnExceptions", "devtools/client/debugger/src/actions/pause/pauseOnExceptions");
loader.lazyRequireGetter(this, "_selectFrame", "devtools/client/debugger/src/actions/pause/selectFrame");
loader.lazyRequireGetter(this, "_skipPausing", "devtools/client/debugger/src/actions/pause/skipPausing");
loader.lazyRequireGetter(this, "_mapScopes", "devtools/client/debugger/src/actions/pause/mapScopes");
loader.lazyRequireGetter(this, "_expandScopes", "devtools/client/debugger/src/actions/pause/expandScopes");
loader.lazyRequireGetter(this, "_inlinePreview", "devtools/client/debugger/src/actions/pause/inlinePreview");