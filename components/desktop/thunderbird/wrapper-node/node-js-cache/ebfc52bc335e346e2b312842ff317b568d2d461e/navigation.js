"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.willNavigate = willNavigate;
exports.connect = connect;
exports.navigated = navigated;

var _editor = require("../utils/editor/index");

var _sourceQueue = require("../utils/source-queue");

var _sourceQueue2 = _interopRequireDefault(_sourceQueue);

var _sources = require("../reducers/sources");

var _utils = require("../utils/utils");

var _sources2 = require("./sources/index");

var _debuggee = require("./debuggee");

var _wasm = require("../utils/wasm");

var _selectors = require("../selectors/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Redux actions for the navigation state
 * @module actions/navigation
 */

/**
 * @memberof actions/navigation
 * @static
 */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

function willNavigate(event) {
  return async function ({
    dispatch,
    getState,
    client,
    sourceMaps,
    parser
  }) {
    _sourceQueue2.default.clear();
    sourceMaps.clearSourceMaps();
    (0, _wasm.clearWasmStates)();
    (0, _editor.clearDocuments)();
    parser.clear();
    client.detachWorkers();
    const thread = (0, _selectors.getMainThread)(getState());

    dispatch({
      type: "NAVIGATE",
      mainThread: { ...thread, url: event.url }
    });
  };
}

function connect(url, actor, canRewind, isWebExtension) {
  return async function ({ dispatch }) {
    await dispatch((0, _debuggee.updateWorkers)());
    dispatch({
      type: "CONNECT",
      mainThread: { url, actor, type: -1, name: "" },
      canRewind,
      isWebExtension
    });
  };
}

/**
 * @memberof actions/navigation
 * @static
 */
function navigated() {
  return async function ({ dispatch, getState, client, panel }) {
    // this time out is used to wait for sources. If we have 0 sources,
    // it is likely that the sources are being loaded from the bfcache,
    // and we should make an explicit request to the server to load them.
    await (0, _utils.waitForMs)(100);
    if ((0, _sources.getSourceList)(getState()).length == 0) {
      const sources = await client.fetchSources();
      dispatch((0, _sources2.newGeneratedSources)(sources));
    }
    panel.emit("reloaded");
  };
}