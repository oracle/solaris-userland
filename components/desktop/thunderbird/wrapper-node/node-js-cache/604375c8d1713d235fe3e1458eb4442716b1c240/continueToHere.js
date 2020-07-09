"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.continueToHere = continueToHere;
loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_breakpoints", "devtools/client/debugger/src/actions/breakpoints/index");
loader.lazyRequireGetter(this, "_breakpointPositions", "devtools/client/debugger/src/actions/breakpoints/breakpointPositions");
loader.lazyRequireGetter(this, "_commands", "devtools/client/debugger/src/actions/pause/commands");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function continueToHere(cx, location) {
  return async function ({
    dispatch,
    getState
  }) {
    const {
      line,
      column,
      sourceId
    } = location;
    const selectedSource = (0, _selectors.getSelectedSource)(getState());
    const selectedFrame = (0, _selectors.getSelectedFrame)(getState(), cx.thread);

    if (!selectedFrame || !selectedSource) {
      return;
    }

    const debugLine = selectedFrame.location.line; // If the user selects a line to continue to,
    // it must be different than the currently paused line.

    if (!column && debugLine == line) {
      return;
    }

    await dispatch((0, _breakpointPositions.setBreakpointPositions)({
      cx,
      sourceId,
      line
    }));
    const position = (0, _selectors.getClosestBreakpointPosition)(getState(), location); // If the user selects a location in the editor,
    // there must be a place we can pause on that line.

    if (column && !position) {
      return;
    }

    const pauseLocation = column && position ? position.location : location; // Set a hidden breakpoint if we do not already have a breakpoint
    // at the closest position

    if (!(0, _selectors.getBreakpoint)(getState(), pauseLocation)) {
      await dispatch((0, _breakpoints.addHiddenBreakpoint)(cx, {
        sourceId: selectedSource.id,
        line: pauseLocation.line,
        column: pauseLocation.column
      }));
    }

    dispatch((0, _commands.resume)(cx));
  };
}