"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toggleTracing = toggleTracing;
exports.tracingToggled = tracingToggled;
loader.lazyRequireGetter(this, "_index", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_promise", "devtools/client/debugger/src/actions/utils/middleware/promise");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

/**
 * Toggle ON/OFF Javascript tracing for all targets.
 */
function toggleTracing() {
  return async ({
    dispatch,
    getState,
    client,
    panel
  }) => {
    // For now, the UI can only toggle all the targets all at once.
    const isTracingEnabled = (0, _index.getIsJavascriptTracingEnabled)(getState());
    const logMethod = (0, _index.getJavascriptTracingLogMethod)(getState()); // Automatically open the split console when enabling tracing to the console

    if (!isTracingEnabled && logMethod == "console") {
      await panel.toolbox.openSplitConsole({
        focusConsoleInput: false
      });
    }

    return dispatch({
      type: "TOGGLE_TRACING",
      [_promise.PROMISE]: client.toggleTracing(),
      enabled: !isTracingEnabled
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