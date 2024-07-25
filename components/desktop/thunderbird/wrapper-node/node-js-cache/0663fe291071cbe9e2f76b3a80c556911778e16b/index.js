"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  setOverrideSource: true,
  removeOverrideSource: true
};
exports.setOverrideSource = setOverrideSource;
exports.removeOverrideSource = removeOverrideSource;
loader.lazyRequireGetter(this, "_blackbox", "devtools/client/debugger/src/actions/sources/blackbox");
Object.keys(_blackbox).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
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
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
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
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
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
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
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
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
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
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
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
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _symbols[key];
    }
  });
});

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function setOverrideSource(source, path) {
  return ({
    client,
    dispatch
  }) => {
    if (!source || !source.url) {
      return;
    }

    const {
      url
    } = source;
    client.setOverride(url, path);
    dispatch({
      type: "SET_OVERRIDE",
      url,
      path
    });
  };
}

function removeOverrideSource(source) {
  return ({
    client,
    dispatch
  }) => {
    if (!source || !source.url) {
      return;
    }

    const {
      url
    } = source;
    client.removeOverride(url);
    dispatch({
      type: "REMOVE_OVERRIDE",
      url
    });
  };
}