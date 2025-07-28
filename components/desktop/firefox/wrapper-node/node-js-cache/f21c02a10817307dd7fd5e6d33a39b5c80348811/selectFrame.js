"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectFrame = selectFrame;
loader.lazyRequireGetter(this, "_index", "devtools/client/debugger/src/actions/sources/index");
loader.lazyRequireGetter(this, "_expressions", "devtools/client/debugger/src/actions/expressions");
loader.lazyRequireGetter(this, "_fetchScopes", "devtools/client/debugger/src/actions/pause/fetchScopes");
loader.lazyRequireGetter(this, "_context", "devtools/client/debugger/src/utils/context");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

/**
 * @memberof actions/pause
 * @static
 */
function selectFrame(frame) {
  return async ({
    dispatch,
    getState
  }) => {
    // Frames that aren't on-stack do not support evalling and may not
    // have live inspectable scopes, so we do not allow selecting them.
    if (frame.state !== "on-stack") {
      dispatch((0, _index.selectLocation)(frame.location));
      return;
    }

    dispatch({
      type: "SELECT_FRAME",
      frame
    }); // It's important that we wait for selectLocation to finish because
    // we rely on the source being loaded.

    await dispatch((0, _index.selectLocation)(frame.location));
    (0, _context.validateSelectedFrame)(getState(), frame);
    await dispatch((0, _expressions.evaluateExpressions)(frame));
    (0, _context.validateSelectedFrame)(getState(), frame);
    await dispatch((0, _fetchScopes.fetchScopes)());
    (0, _context.validateSelectedFrame)(getState(), frame);
  };
}