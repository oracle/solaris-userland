"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
loader.lazyRequireGetter(this, "_why", "devtools/client/debugger/src/utils/pause/why");
Object.keys(_why).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _why[key];
    }
  });
});