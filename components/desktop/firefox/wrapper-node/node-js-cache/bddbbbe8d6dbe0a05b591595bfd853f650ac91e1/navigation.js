"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.willNavigate = willNavigate;
exports.navigated = navigated;
loader.lazyRequireGetter(this, "_editor", "devtools/client/debugger/src/utils/editor/index");

var _sourceQueue = _interopRequireDefault(require("../utils/source-queue"));

loader.lazyRequireGetter(this, "_wasm", "devtools/client/debugger/src/utils/wasm");
loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_expressions", "devtools/client/debugger/src/actions/expressions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

/**
 * Redux actions for the navigation state
 * @module actions/navigation
 */

/**
 * @memberof actions/navigation
 * @static
 */
function willNavigate(event) {
  return async function ({
    dispatch,
    getState,
    client,
    sourceMapLoader,
    parserWorker
  }) {
    _sourceQueue.default.clear();

    sourceMapLoader.clearSourceMaps();
    (0, _wasm.clearWasmStates)();
    (0, _editor.clearDocuments)();
    parserWorker.clear();
    const thread = (0, _selectors.getMainThread)(getState());
    dispatch({
      type: "NAVIGATE",
      mainThread: { ...thread,
        url: event.url
      }
    });
  };
}
/**
 * @memberof actions/navigation
 * @static
 */


function navigated() {
  return async function ({
    getState,
    dispatch,
    panel
  }) {
    try {
      // Update the watched expressions once the page is fully loaded
      const threadcx = (0, _selectors.getThreadContext)(getState());
      await dispatch((0, _expressions.evaluateExpressions)(threadcx));
    } catch (e) {
      // This may throw if we resume during the page load.
      // browser_dbg-debugger-buttons.js highlights this, especially on MacOS or when ran many times
      console.error("Failed to update expression on navigation", e);
    }

    panel.emit("reloaded");
  };
}