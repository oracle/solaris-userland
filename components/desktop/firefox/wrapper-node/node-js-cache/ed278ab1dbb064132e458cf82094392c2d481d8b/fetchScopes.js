"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchScopes = fetchScopes;
loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_mapScopes", "devtools/client/debugger/src/actions/pause/mapScopes");
loader.lazyRequireGetter(this, "_inlinePreview", "devtools/client/debugger/src/actions/pause/inlinePreview");
loader.lazyRequireGetter(this, "_promise", "devtools/client/debugger/src/actions/utils/middleware/promise");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function fetchScopes(cx) {
  return async function ({
    dispatch,
    getState,
    client,
    sourceMaps
  }) {
    const frame = (0, _selectors.getSelectedFrame)(getState(), cx.thread);

    if (!frame || (0, _selectors.getGeneratedFrameScope)(getState(), frame.id)) {
      return;
    }

    const scopes = dispatch({
      type: "ADD_SCOPES",
      cx,
      thread: cx.thread,
      frame,
      [_promise.PROMISE]: client.getFrameScopes(frame)
    });
    scopes.then(() => {
      dispatch((0, _inlinePreview.generateInlinePreview)(cx, frame));
    });
    await dispatch((0, _mapScopes.mapScopes)(cx, scopes, frame));
  };
}