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
loader.lazyRequireGetter(this, "_index", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_promise", "devtools/client/debugger/src/actions/utils/middleware/promise");
loader.lazyRequireGetter(this, "_expressions", "devtools/client/debugger/src/actions/expressions");
loader.lazyRequireGetter(this, "_index2", "devtools/client/debugger/src/actions/sources/index");
loader.lazyRequireGetter(this, "_fetchScopes", "devtools/client/debugger/src/actions/pause/fetchScopes");
loader.lazyRequireGetter(this, "_fetchFrames", "devtools/client/debugger/src/actions/pause/fetchFrames");
loader.lazyRequireGetter(this, "_telemetry", "devtools/client/debugger/src/utils/telemetry");
loader.lazyRequireGetter(this, "_context", "devtools/client/debugger/src/utils/context");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function selectThread(thread) {
  return async ({
    dispatch,
    getState
  }) => {
    if ((0, _index.getCurrentThread)(getState()) === thread) {
      return;
    }

    dispatch({
      type: "SELECT_THREAD",
      thread
    });

    if ((0, _index.getCurrentThread)(getState()) !== thread) {
      throw new Error("The thread wasn't selected");
    }

    const selectedFrame = (0, _index.getSelectedFrame)(getState());
    const serverRequests = []; // Update the watched expressions as we may never have evaluated them against this thread
    // Note that selectedFrame may be null if the thread isn't paused.

    serverRequests.push(dispatch((0, _expressions.evaluateExpressions)(selectedFrame))); // If we were paused on the newly selected thread, ensure:
    // - select the source where we are paused,
    // - fetching the paused stackframes,
    // - fetching the paused scope, so that variable preview are working on the selected source.
    // (frames and scopes is supposed to be fetched on pause,
    // but if two threads pause concurrently, it might be cancelled)

    if (selectedFrame) {
      serverRequests.push(dispatch((0, _index2.selectLocation)(selectedFrame.location)));
      serverRequests.push(dispatch((0, _fetchFrames.fetchFrames)(thread)));
      serverRequests.push(dispatch((0, _fetchScopes.fetchScopes)()));
    }

    await Promise.all(serverRequests);
  };
}
/**
 * Debugger commands like stepOver, stepIn, stepOut, resume
 *
 * @param string type
 */


function command(type) {
  return async ({
    dispatch,
    getState,
    client
  }) => {
    if (!type) {
      return null;
    } // For now, all commands are by default against the currently selected thread


    const thread = (0, _index.getCurrentThread)(getState());
    const frame = (0, _index.getSelectedFrame)(getState());
    return dispatch({
      type: "COMMAND",
      command: type,
      thread,
      [_promise.PROMISE]: client[type](thread, frame?.id)
    });
  };
}
/**
 * StepIn
 *
 * @returns {Function} {@link command}
 */


function stepIn() {
  return ({
    dispatch,
    getState
  }) => {
    if (!(0, _index.getIsCurrentThreadPaused)(getState())) {
      return null;
    }

    return dispatch(command("stepIn"));
  };
}
/**
 * stepOver
 *
 * @returns {Function} {@link command}
 */


function stepOver() {
  return ({
    dispatch,
    getState
  }) => {
    if (!(0, _index.getIsCurrentThreadPaused)(getState())) {
      return null;
    }

    return dispatch(command("stepOver"));
  };
}
/**
 * stepOut
 *
 * @returns {Function} {@link command}
 */


function stepOut() {
  return ({
    dispatch,
    getState
  }) => {
    if (!(0, _index.getIsCurrentThreadPaused)(getState())) {
      return null;
    }

    return dispatch(command("stepOut"));
  };
}
/**
 * resume
 *
 * @returns {Function} {@link command}
 */


function resume() {
  return ({
    dispatch,
    getState
  }) => {
    if (!(0, _index.getIsCurrentThreadPaused)(getState())) {
      return null;
    }

    (0, _telemetry.recordEvent)("continue");
    return dispatch(command("resume"));
  };
}
/**
 * restart frame
 */


function restart(frame) {
  return async ({
    dispatch,
    getState,
    client
  }) => {
    if (!(0, _index.getIsPaused)(getState(), frame.thread)) {
      return null;
    }

    (0, _context.validateFrame)(getState(), frame);
    return dispatch({
      type: "COMMAND",
      command: "restart",
      thread: frame.thread,
      [_promise.PROMISE]: client.restart(frame.thread, frame.id)
    });
  };
}