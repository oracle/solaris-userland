"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectThread = selectThread;
exports.command = command;
exports.stepIn = stepIn;
exports.stepOver = stepOver;
exports.stepOut = stepOut;
exports.resume = resume;
exports.restart = restart;
loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_promise", "devtools/client/debugger/src/actions/utils/middleware/promise");
loader.lazyRequireGetter(this, "_expressions", "devtools/client/debugger/src/actions/expressions");
loader.lazyRequireGetter(this, "_sources", "devtools/client/debugger/src/actions/sources/index");
loader.lazyRequireGetter(this, "_fetchScopes", "devtools/client/debugger/src/actions/pause/fetchScopes");
loader.lazyRequireGetter(this, "_fetchFrames", "devtools/client/debugger/src/actions/pause/fetchFrames");
loader.lazyRequireGetter(this, "_telemetry", "devtools/client/debugger/src/utils/telemetry");
loader.lazyRequireGetter(this, "_prefs", "devtools/client/debugger/src/utils/prefs");

var _assert = _interopRequireDefault(require("../../utils/assert"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function selectThread(cx, thread) {
  return async ({
    dispatch,
    getState,
    client
  }) => {
    if ((0, _selectors.getCurrentThread)(getState()) === thread) {
      return;
    }

    dispatch({
      cx,
      type: "SELECT_THREAD",
      thread
    }); // Get a new context now that the current thread has changed.

    const threadcx = (0, _selectors.getThreadContext)(getState()); // Note that this is a rethorical assertion as threadcx.thread is updated by SELECT_THREAD action

    (0, _assert.default)(threadcx.thread == thread, "Thread mismatch");
    const serverRequests = []; // Update the watched expressions as we may never have evaluated them against this thread

    serverRequests.push(dispatch((0, _expressions.evaluateExpressions)(threadcx))); // If we were paused on the newly selected thread, ensure:
    // - select the source where we are paused,
    // - fetching the paused stackframes,
    // - fetching the paused scope, so that variable preview are working on the selected source.
    // (frames and scopes is supposed to be fetched on pause,
    // but if two threads pause concurrently, it might be cancelled)

    const frame = (0, _selectors.getSelectedFrame)(getState(), thread);

    if (frame) {
      serverRequests.push(dispatch((0, _sources.selectLocation)(threadcx, frame.location)));
      serverRequests.push(dispatch((0, _fetchFrames.fetchFrames)(threadcx)));
      serverRequests.push(dispatch((0, _fetchScopes.fetchScopes)(threadcx)));
    }

    await Promise.all(serverRequests);
  };
}
/**
 * Debugger commands like stepOver, stepIn, stepUp
 *
 * @param string $0.type
 * @memberof actions/pause
 * @static
 */


function command(type) {
  return async ({
    dispatch,
    getState,
    client
  }) => {
    if (!type) {
      return;
    } // For now, all commands are by default against the currently selected thread


    const thread = (0, _selectors.getCurrentThread)(getState());
    const frame = _prefs.features.frameStep && (0, _selectors.getSelectedFrame)(getState(), thread);
    return dispatch({
      type: "COMMAND",
      command: type,
      thread,
      [_promise.PROMISE]: client[type](thread, frame === null || frame === void 0 ? void 0 : frame.id)
    });
  };
}
/**
 * StepIn
 * @memberof actions/pause
 * @static
 * @returns {Function} {@link command}
 */


function stepIn() {
  return ({
    dispatch,
    getState
  }) => {
    if ((0, _selectors.getIsCurrentThreadPaused)(getState())) {
      return dispatch(command("stepIn"));
    }
  };
}
/**
 * stepOver
 * @memberof actions/pause
 * @static
 * @returns {Function} {@link command}
 */


function stepOver() {
  return ({
    dispatch,
    getState
  }) => {
    if ((0, _selectors.getIsCurrentThreadPaused)(getState())) {
      return dispatch(command("stepOver"));
    }
  };
}
/**
 * stepOut
 * @memberof actions/pause
 * @static
 * @returns {Function} {@link command}
 */


function stepOut() {
  return ({
    dispatch,
    getState
  }) => {
    if ((0, _selectors.getIsCurrentThreadPaused)(getState())) {
      return dispatch(command("stepOut"));
    }
  };
}
/**
 * resume
 * @memberof actions/pause
 * @static
 * @returns {Function} {@link command}
 */


function resume() {
  return ({
    dispatch,
    getState
  }) => {
    if ((0, _selectors.getIsCurrentThreadPaused)(getState())) {
      (0, _telemetry.recordEvent)("continue");
      return dispatch(command("resume"));
    }
  };
}
/**
 * restart frame
 * @memberof actions/pause
 * @static
 */


function restart(cx, frame) {
  return async ({
    dispatch,
    getState,
    client
  }) => {
    if ((0, _selectors.getIsCurrentThreadPaused)(getState())) {
      return dispatch({
        type: "COMMAND",
        command: "restart",
        thread: cx.thread,
        [_promise.PROMISE]: client.restart(cx.thread, frame.id)
      });
    }
  };
}