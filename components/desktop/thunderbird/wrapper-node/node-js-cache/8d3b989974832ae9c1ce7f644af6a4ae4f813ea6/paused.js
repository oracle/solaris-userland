"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.paused = paused;
loader.lazyRequireGetter(this, "_index", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_index2", "devtools/client/debugger/src/actions/pause/index");
loader.lazyRequireGetter(this, "_index3", "devtools/client/debugger/src/actions/breakpoints/index");
loader.lazyRequireGetter(this, "_expressions", "devtools/client/debugger/src/actions/expressions");
loader.lazyRequireGetter(this, "_index4", "devtools/client/debugger/src/actions/sources/index");
loader.lazyRequireGetter(this, "_context", "devtools/client/debugger/src/utils/context");
loader.lazyRequireGetter(this, "_fetchScopes", "devtools/client/debugger/src/actions/pause/fetchScopes");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

/**
 * Debugger has just paused
 *
 * @param {object} pauseInfo
 *        See `createPause` method.
 */
function paused(pauseInfo) {
  return async function ({
    dispatch,
    getState
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
      topFrame: frame
    }); // When we use "continue to here" feature we register an "hidden" breakpoint
    // that should be removed on the next paused, even if we didn't hit it and
    // paused for any other reason.

    const hiddenBreakpoint = (0, _index.getHiddenBreakpoint)(getState());

    if (hiddenBreakpoint) {
      dispatch((0, _index3.removeBreakpoint)(hiddenBreakpoint));
    } // The THREAD_STATE's "paused" resource only passes the top level stack frame,
    // we dispatch the PAUSED action with it so that we can right away
    // display it and update the UI to be paused.
    // But we then fetch all the other frames:


    await dispatch((0, _index2.fetchFrames)(thread)); // And map them to original source locations.
    // Note that this will wait for all related original sources to be loaded in the reducers.
    // So this step may pause for a little while.

    await dispatch((0, _index2.mapFrames)(thread)); // If we paused on a particular frame, automatically select the related source
    // and highlight the paused line

    const selectedFrame = (0, _index.getSelectedFrame)(getState(), thread);

    if (selectedFrame) {
      await dispatch((0, _index4.selectLocation)(selectedFrame.location)); // We might have resumed while opening the location.
      // Prevent further computation if this happens.

      (0, _context.validateSelectedFrame)(getState(), selectedFrame); // Update the display names of the original frames
      // Note that this depends on the source editor's `getClosestFunctionName`.
      // so it needs to be called after the source is selected (to make sure the source editor is fully initialized).
      // This can happen when paused on initial load.

      await dispatch((0, _index2.updateAllFrameDisplayNames)(thread)); // Fetch the previews for variables visible in the currently selected paused stackframe

      await dispatch((0, _fetchScopes.fetchScopes)()); // We might have resumed while fetching the scopes
      // Prevent further computation if this happens.

      (0, _context.validateSelectedFrame)(getState(), selectedFrame); // Run after fetching scoping data so that it may make use of the sourcemap
      // expression mappings for local variables.

      const atException = why.type == "exception";

      if (!atException || !(0, _index.isEvaluatingExpression)(getState(), thread)) {
        await dispatch((0, _expressions.evaluateExpressions)(selectedFrame));
        (0, _context.validateSelectedFrame)(getState(), selectedFrame);
      }
    }
  };
}