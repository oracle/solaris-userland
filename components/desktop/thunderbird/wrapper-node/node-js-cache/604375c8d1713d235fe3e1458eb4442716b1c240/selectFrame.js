"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectFrame = selectFrame;
loader.lazyRequireGetter(this, "_sources", "devtools/client/debugger/src/actions/sources/index");
loader.lazyRequireGetter(this, "_expressions", "devtools/client/debugger/src/actions/expressions");
loader.lazyRequireGetter(this, "_fetchScopes", "devtools/client/debugger/src/actions/pause/fetchScopes");

var _assert = _interopRequireDefault(require("../../utils/assert"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

/**
 * @memberof actions/pause
 * @static
 */
function selectFrame(cx, frame) {
  return async ({
    dispatch,
    client,
    getState,
    sourceMaps
  }) => {
    (0, _assert.default)(cx.thread == frame.thread, "Thread mismatch"); // Frames that aren't on-stack do not support evalling and may not
    // have live inspectable scopes, so we do not allow selecting them.

    if (frame.state !== "on-stack") {
      return dispatch((0, _sources.selectLocation)(cx, frame.location));
    }

    dispatch({
      type: "SELECT_FRAME",
      cx,
      thread: cx.thread,
      frame
    }); // It's important that we wait for selectLocation to finish because
    // we rely on the source being loaded and symbols fetched below.

    await dispatch((0, _sources.selectLocation)(cx, frame.location));
    dispatch((0, _expressions.evaluateExpressions)(cx));
    dispatch((0, _fetchScopes.fetchScopes)(cx));
  };
}