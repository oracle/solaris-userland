"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resumed = resumed;
loader.lazyRequireGetter(this, "_index", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_expressions", "devtools/client/debugger/src/actions/expressions");
loader.lazyRequireGetter(this, "_index2", "devtools/client/debugger/src/utils/pause/index");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

/**
 * Debugger has just resumed.
 */
function resumed(thread) {
  return async ({
    dispatch,
    getState
  }) => {
    const why = (0, _index.getPauseReason)(getState(), thread);
    const wasPausedInEval = (0, _index2.inDebuggerEval)(why);
    const wasStepping = (0, _index.isStepping)(getState(), thread);
    dispatch({
      type: "RESUME",
      thread,
      wasStepping
    }); // Avoid updating expression if we are stepping and would re-pause right after,
    // the expression will be updated on next pause.

    if (!wasStepping && !wasPausedInEval) {
      const selectedFrame = (0, _index.getSelectedFrame)(getState(), thread);
      await dispatch((0, _expressions.evaluateExpressions)(selectedFrame));
    }
  };
}