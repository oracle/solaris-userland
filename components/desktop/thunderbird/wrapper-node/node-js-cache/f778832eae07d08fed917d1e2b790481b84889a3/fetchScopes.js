"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchScopes = fetchScopes;
loader.lazyRequireGetter(this, "_index", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_mapScopes", "devtools/client/debugger/src/actions/pause/mapScopes");
loader.lazyRequireGetter(this, "_inlinePreview", "devtools/client/debugger/src/actions/pause/inlinePreview");
loader.lazyRequireGetter(this, "_promise", "devtools/client/debugger/src/actions/utils/middleware/promise");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function fetchScopes(selectedFrame) {
  return async function ({
    dispatch,
    getState,
    client
  }) {
    // See if we already fetched the scopes.
    // We may have pause on multiple thread and re-select a paused thread
    // for which we already fetched the scopes.
    // Ignore pending scopes as the previous action may have been cancelled
    // by context assertions.
    let scopes = (0, _index.getGeneratedFrameScope)(getState(), selectedFrame);

    if (!scopes?.scope) {
      scopes = dispatch({
        type: "ADD_SCOPES",
        selectedFrame,
        [_promise.PROMISE]: client.getFrameScopes(selectedFrame)
      });
      scopes.then(() => {
        dispatch((0, _inlinePreview.generateInlinePreview)(selectedFrame));
      });
    }

    if (!(0, _index.getOriginalFrameScope)(getState(), selectedFrame)) {
      await dispatch((0, _mapScopes.mapScopes)(selectedFrame, scopes));
    }
  };
}