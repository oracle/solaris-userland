"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  getClosestBreakpoint: true,
  getBreakpointAtLocation: true,
  getBreakpointsAtLine: true,
  getClosestBreakpointPosition: true,
  getBreakpointSources: true,
  getCallStackFrames: true,
  isLineInScope: true,
  isSelectedFrameVisible: true,
  getVisibleBreakpoints: true,
  getFirstVisibleBreakpoints: true
};
Object.defineProperty(exports, "getClosestBreakpoint", {
  enumerable: true,
  get: function () {
    return _breakpointAtLocation.getClosestBreakpoint;
  }
});
Object.defineProperty(exports, "getBreakpointAtLocation", {
  enumerable: true,
  get: function () {
    return _breakpointAtLocation.getBreakpointAtLocation;
  }
});
Object.defineProperty(exports, "getBreakpointsAtLine", {
  enumerable: true,
  get: function () {
    return _breakpointAtLocation.getBreakpointsAtLine;
  }
});
Object.defineProperty(exports, "getClosestBreakpointPosition", {
  enumerable: true,
  get: function () {
    return _breakpointAtLocation.getClosestBreakpointPosition;
  }
});
Object.defineProperty(exports, "getBreakpointSources", {
  enumerable: true,
  get: function () {
    return _breakpointSources.getBreakpointSources;
  }
});
Object.defineProperty(exports, "getCallStackFrames", {
  enumerable: true,
  get: function () {
    return _getCallStackFrames.getCallStackFrames;
  }
});
Object.defineProperty(exports, "isLineInScope", {
  enumerable: true,
  get: function () {
    return _isLineInScope.isLineInScope;
  }
});
Object.defineProperty(exports, "isSelectedFrameVisible", {
  enumerable: true,
  get: function () {
    return _isSelectedFrameVisible.isSelectedFrameVisible;
  }
});
Object.defineProperty(exports, "getVisibleBreakpoints", {
  enumerable: true,
  get: function () {
    return _visibleBreakpoints.getVisibleBreakpoints;
  }
});
Object.defineProperty(exports, "getFirstVisibleBreakpoints", {
  enumerable: true,
  get: function () {
    return _visibleBreakpoints.getFirstVisibleBreakpoints;
  }
});
loader.lazyRequireGetter(this, "_ast", "devtools/client/debugger/src/selectors/ast");
Object.keys(_ast).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _ast[key];
    }
  });
});
loader.lazyRequireGetter(this, "_breakpoints", "devtools/client/debugger/src/selectors/breakpoints");
Object.keys(_breakpoints).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _breakpoints[key];
    }
  });
});
loader.lazyRequireGetter(this, "_breakpointAtLocation", "devtools/client/debugger/src/selectors/breakpointAtLocation");
loader.lazyRequireGetter(this, "_breakpointSources", "devtools/client/debugger/src/selectors/breakpointSources");
loader.lazyRequireGetter(this, "_eventListeners", "devtools/client/debugger/src/selectors/event-listeners");
Object.keys(_eventListeners).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _eventListeners[key];
    }
  });
});
loader.lazyRequireGetter(this, "_exceptions", "devtools/client/debugger/src/selectors/exceptions");
Object.keys(_exceptions).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _exceptions[key];
    }
  });
});
loader.lazyRequireGetter(this, "_expressions", "devtools/client/debugger/src/selectors/expressions");
Object.keys(_expressions).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _expressions[key];
    }
  });
});
loader.lazyRequireGetter(this, "_fileSearch", "devtools/client/debugger/src/selectors/file-search");
Object.keys(_fileSearch).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _fileSearch[key];
    }
  });
});
loader.lazyRequireGetter(this, "_getCallStackFrames", "devtools/client/debugger/src/selectors/getCallStackFrames");
loader.lazyRequireGetter(this, "_isLineInScope", "devtools/client/debugger/src/selectors/isLineInScope");
loader.lazyRequireGetter(this, "_isSelectedFrameVisible", "devtools/client/debugger/src/selectors/isSelectedFrameVisible");
loader.lazyRequireGetter(this, "_pause", "devtools/client/debugger/src/selectors/pause");
Object.keys(_pause).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _pause[key];
    }
  });
});
loader.lazyRequireGetter(this, "_pendingBreakpoints", "devtools/client/debugger/src/selectors/pending-breakpoints");
Object.keys(_pendingBreakpoints).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _pendingBreakpoints[key];
    }
  });
});
loader.lazyRequireGetter(this, "_preview", "devtools/client/debugger/src/selectors/preview");
Object.keys(_preview).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _preview[key];
    }
  });
});
loader.lazyRequireGetter(this, "_projectTextSearch", "devtools/client/debugger/src/selectors/project-text-search");
Object.keys(_projectTextSearch).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _projectTextSearch[key];
    }
  });
});
loader.lazyRequireGetter(this, "_quickOpen", "devtools/client/debugger/src/selectors/quick-open");
Object.keys(_quickOpen).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _quickOpen[key];
    }
  });
});
loader.lazyRequireGetter(this, "_sourceActors", "devtools/client/debugger/src/selectors/source-actors");
Object.keys(_sourceActors).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _sourceActors[key];
    }
  });
});
loader.lazyRequireGetter(this, "_sourceTree", "devtools/client/debugger/src/selectors/source-tree");
Object.keys(_sourceTree).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _sourceTree[key];
    }
  });
});
loader.lazyRequireGetter(this, "_sourcesContent", "devtools/client/debugger/src/selectors/sources-content");
Object.keys(_sourcesContent).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _sourcesContent[key];
    }
  });
});
loader.lazyRequireGetter(this, "_sources", "devtools/client/debugger/src/selectors/sources");
Object.keys(_sources).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _sources[key];
    }
  });
});
loader.lazyRequireGetter(this, "_tabs", "devtools/client/debugger/src/selectors/tabs");
Object.keys(_tabs).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _tabs[key];
    }
  });
});
loader.lazyRequireGetter(this, "_threads", "devtools/client/debugger/src/selectors/threads");
Object.keys(_threads).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _threads[key];
    }
  });
});
loader.lazyRequireGetter(this, "_ui", "devtools/client/debugger/src/selectors/ui");
Object.keys(_ui).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _ui[key];
    }
  });
});
loader.lazyRequireGetter(this, "_visibleBreakpoints", "devtools/client/debugger/src/selectors/visibleBreakpoints");
loader.lazyRequireGetter(this, "_visibleColumnBreakpoints", "devtools/client/debugger/src/selectors/visibleColumnBreakpoints");
Object.keys(_visibleColumnBreakpoints).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _visibleColumnBreakpoints[key];
    }
  });
});

var _index = require("devtools/client/shared/components/reps/index");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
const {
  reducer
} = _index.objectInspector;
Object.keys(reducer).forEach(function (key) {
  if (key === "default" || key === "__esModule") {
    return;
  }

  Object.defineProperty(exports, key, {
    enumerable: true,
    get: reducer[key]
  });
});