"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resumed = resumed;
loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_expressions", "devtools/client/debugger/src/actions/expressions");
loader.lazyRequireGetter(this, "_pause", "devtools/client/debugger/src/utils/pause/index");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

/**
 * Debugger has just resumed
 *
 * @memberof actions/pause
 * @static
 */
function resumed(thread) {
  return async ({
    dispatch,
    client,
    getState
  }) => {
    const why = (0, _selectors.getPauseReason)(getState(), thread);
    const wasPausedInEval = (0, _pause.inDebuggerEval)(why);
    const wasStepping = (0, _selectors.isStepping)(getState(), thread);
    dispatch({
      type: "RESUME",
      thread,
      wasStepping
    });
    const cx = (0, _selectors.getThreadContext)(getState());

    if (!wasStepping && !wasPausedInEval && cx.thread == thread) {
      await dispatch((0, _expressions.evaluateExpressions)(cx));
    }
  };
}