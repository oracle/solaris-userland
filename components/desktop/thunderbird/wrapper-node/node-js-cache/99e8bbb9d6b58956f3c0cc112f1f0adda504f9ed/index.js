"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
loader.lazyRequireGetter(this, "_blackbox", "devtools/client/debugger/src/actions/sources/blackbox");
Object.keys(_blackbox).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _blackbox[key];
    }
  });
});
loader.lazyRequireGetter(this, "_breakableLines", "devtools/client/debugger/src/actions/sources/breakableLines");
Object.keys(_breakableLines).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _breakableLines[key];
    }
  });
});
loader.lazyRequireGetter(this, "_loadSourceText", "devtools/client/debugger/src/actions/sources/loadSourceText");
Object.keys(_loadSourceText).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _loadSourceText[key];
    }
  });
});
loader.lazyRequireGetter(this, "_newSources", "devtools/client/debugger/src/actions/sources/newSources");
Object.keys(_newSources).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _newSources[key];
    }
  });
});
loader.lazyRequireGetter(this, "_prettyPrint", "devtools/client/debugger/src/actions/sources/prettyPrint");
Object.keys(_prettyPrint).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _prettyPrint[key];
    }
  });
});
loader.lazyRequireGetter(this, "_select", "devtools/client/debugger/src/actions/sources/select");
Object.keys(_select).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _select[key];
    }
  });
});
loader.lazyRequireGetter(this, "_symbols", "devtools/client/debugger/src/actions/sources/symbols");
Object.keys(_symbols).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _symbols[key];
    }
  });
});