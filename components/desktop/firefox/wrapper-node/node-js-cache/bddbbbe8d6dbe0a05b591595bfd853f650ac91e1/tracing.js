"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toggleTracing = toggleTracing;
exports.tracingToggled = tracingToggled;
loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_promise", "devtools/client/debugger/src/actions/utils/middleware/promise");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

/**
 * Toggle ON/OFF Javascript tracing for all targets,
 * using the specified log method.
 *
 * @param {string} logMethod
 *        Can be "stdout" or "console". See TracerActor.
 */
function toggleTracing(logMethod) {
  return async ({
    dispatch,
    getState,
    client,
    panel
  }) => {
    // Check if any of the thread is currently tracing.
    // For now, the UI can only toggle all the targets all at once.
    const threads = (0, _selectors.getAllThreads)(getState());
    const isTracingEnabled = threads.some(thread => (0, _selectors.getIsThreadCurrentlyTracing)(getState(), thread.actor)); // Automatically open the split console when enabling tracing to the console

    if (!isTracingEnabled && logMethod == "console") {
      await panel.toolbox.openSplitConsole({
        focusConsoleInput: false
      });
    }

    return dispatch({
      type: "TOGGLE_TRACING",
      [_promise.PROMISE]: isTracingEnabled ? client.stopTracing() : client.startTracing(logMethod)
    });
  };
}
/**
 * Called when tracing is toggled ON/OFF on a particular thread.
 */


function tracingToggled(thread, enabled) {
  return ({
    dispatch
  }) => {
    dispatch({
      type: "TRACING_TOGGLED",
      thread,
      enabled
    });
  };
}