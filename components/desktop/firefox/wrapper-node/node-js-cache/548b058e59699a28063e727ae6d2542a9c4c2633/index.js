"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
loader.lazyRequireGetter(this, "_annotateFrames", "devtools/client/debugger/src/utils/pause/frames/annotateFrames");
Object.keys(_annotateFrames).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _annotateFrames[key];
    }
  });
});
loader.lazyRequireGetter(this, "_collapseFrames", "devtools/client/debugger/src/utils/pause/frames/collapseFrames");
Object.keys(_collapseFrames).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _collapseFrames[key];
    }
  });
});
loader.lazyRequireGetter(this, "_displayName", "devtools/client/debugger/src/utils/pause/frames/displayName");
Object.keys(_displayName).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _displayName[key];
    }
  });
});
loader.lazyRequireGetter(this, "_getLibraryFromUrl", "devtools/client/debugger/src/utils/pause/frames/getLibraryFromUrl");
Object.keys(_getLibraryFromUrl).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _getLibraryFromUrl[key];
    }
  });
});