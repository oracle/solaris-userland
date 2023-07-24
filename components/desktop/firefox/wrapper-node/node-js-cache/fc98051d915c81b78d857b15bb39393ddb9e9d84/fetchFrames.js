"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchFrames = fetchFrames;
loader.lazyRequireGetter(this, "_context", "devtools/client/debugger/src/utils/context");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function fetchFrames(cx) {
  return async function ({
    dispatch,
    client,
    getState
  }) {
    const {
      thread
    } = cx;
    let frames;

    try {
      frames = await client.getFrames(thread);
    } catch (e) {
      // getFrames will fail if the thread has resumed. In this case the thread
      // should no longer be valid and the frames we would have fetched would be
      // discarded anyways.
      if ((0, _context.isValidThreadContext)(getState(), cx)) {
        throw e;
      }
    }

    dispatch({
      type: "FETCHED_FRAMES",
      thread,
      frames,
      cx
    });
  };
}