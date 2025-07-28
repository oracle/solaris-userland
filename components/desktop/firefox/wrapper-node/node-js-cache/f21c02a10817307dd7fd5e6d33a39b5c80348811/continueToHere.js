"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.continueToHere = continueToHere;
loader.lazyRequireGetter(this, "_index", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_location", "devtools/client/debugger/src/utils/location");
loader.lazyRequireGetter(this, "_index2", "devtools/client/debugger/src/actions/breakpoints/index");
loader.lazyRequireGetter(this, "_breakpointPositions", "devtools/client/debugger/src/actions/breakpoints/breakpointPositions");
loader.lazyRequireGetter(this, "_skipPausing", "devtools/client/debugger/src/actions/pause/skipPausing");
loader.lazyRequireGetter(this, "_commands", "devtools/client/debugger/src/actions/pause/commands");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function continueToHere(location) {
  return async function ({
    dispatch,
    getState
  }) {
    const {
      line,
      column
    } = location;
    const selectedSource = (0, _index.getSelectedSource)(getState());
    const selectedFrame = (0, _index.getSelectedFrame)(getState());

    if (!selectedFrame || !selectedSource) {
      return;
    }

    const pausedLine = selectedFrame.location.line; // If the user selects a line to continue to,
    // it must be different than the currently paused line.

    if (!column && pausedLine == line) {
      return;
    }

    await dispatch((0, _breakpointPositions.setBreakpointPositions)(location));
    const position = (0, _index.getClosestBreakpointPosition)(getState(), location); // If the user selects a location in the editor,
    // there must be a place we can pause on that line.

    if (column && !position) {
      return;
    }

    const pauseLocation = column && position ? position.location : location; // Ensure that breakpoints are enabled while running this

    await dispatch((0, _skipPausing.setSkipPausing)(false)); // Set a hidden breakpoint if we do not already have a breakpoint
    // at the closest position

    if (!(0, _index.getBreakpoint)(getState(), pauseLocation)) {
      await dispatch((0, _index2.addHiddenBreakpoint)((0, _location.createLocation)({
        source: selectedSource,
        line: pauseLocation.line,
        column: pauseLocation.column
      })));
    }

    dispatch((0, _commands.resume)());
  };
}