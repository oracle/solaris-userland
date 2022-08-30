"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.paused = paused;
loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_create", "devtools/client/debugger/src/client/firefox/create");
loader.lazyRequireGetter(this, "_", "devtools/client/debugger/src/actions/pause/index");
loader.lazyRequireGetter(this, "_breakpoints", "devtools/client/debugger/src/actions/breakpoints/index");
loader.lazyRequireGetter(this, "_expressions", "devtools/client/debugger/src/actions/expressions");
loader.lazyRequireGetter(this, "_sources", "devtools/client/debugger/src/actions/sources/index");

var _assert = _interopRequireDefault(require("../../utils/assert"));

loader.lazyRequireGetter(this, "_fetchScopes", "devtools/client/debugger/src/actions/pause/fetchScopes");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

/**
 * Debugger has just paused
 *
 * @param {object} pauseInfo
 * @memberof actions/pause
 * @static
 */
function paused(pauseInfo) {
  return async function ({
    dispatch,
    getState,
    client,
    sourceMaps
  }) {
    const {
      thread,
      frame,
      why
    } = pauseInfo;
    dispatch({
      type: "PAUSED",
      thread,
      why,
      frame
    }); // Get a context capturing the newly paused and selected thread.

    const cx = (0, _selectors.getThreadContext)(getState()); // Note that this is a rethorical assertion as threadcx.thread is updated by PAUSED action

    (0, _assert.default)(cx.thread == thread, "Thread mismatch"); // When we use "continue to here" feature we register an "hidden" breakpoint
    // that should be removed on the next paused, even if we didn't hit it and
    // paused for any other reason.

    const hiddenBreakpoint = (0, _selectors.getHiddenBreakpoint)(getState());

    if (hiddenBreakpoint) {
      dispatch((0, _breakpoints.removeBreakpoint)(cx, hiddenBreakpoint));
    } // The THREAD_STATE's "paused" resource only passes the top level stack frame,
    // we dispatch the PAUSED action with it so that we can right away
    // display it and update the UI to be paused.
    // But we then fetch all the other frames:


    await dispatch((0, _.fetchFrames)(cx)); // And map them to original source locations:

    await dispatch((0, _.mapFrames)(cx)); // If we paused on a particular frame, automatically select the related source
    // and highlight the paused line

    const selectedFrame = (0, _selectors.getSelectedFrame)(getState(), thread);

    if (selectedFrame) {
      await (0, _create.waitForSourceToBeRegisteredInStore)(selectedFrame.location.sourceId);
      await dispatch((0, _sources.selectSpecificLocation)(cx, selectedFrame.location));
    } // Fetch the previews for variables visible in the currently selected paused stackframe


    await dispatch((0, _fetchScopes.fetchScopes)(cx)); // Run after fetching scoping data so that it may make use of the sourcemap
    // expression mappings for local variables.

    const atException = why.type == "exception";

    if (!atException || !(0, _selectors.isEvaluatingExpression)(getState(), thread)) {
      await dispatch((0, _expressions.evaluateExpressions)(cx));
    }
  };
}