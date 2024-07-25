"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setBreakableLines = setBreakableLines;
loader.lazyRequireGetter(this, "_index", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_breakpointPositions", "devtools/client/debugger/src/actions/breakpoints/breakpointPositions");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function calculateBreakableLines(positions) {
  const lines = [];

  for (const line in positions) {
    if (positions[line].length) {
      lines.push(Number(line));
    }
  }

  return lines;
}
/**
 * Ensure that breakable lines for a given source are fetched.
 *
 * @param Object location
 */


function setBreakableLines(location) {
  return async ({
    getState,
    dispatch,
    client
  }) => {
    let breakableLines;

    if (location.source.isOriginal) {
      const positions = await dispatch((0, _breakpointPositions.setBreakpointPositions)(location));
      breakableLines = calculateBreakableLines(positions);
      const existingBreakableLines = (0, _index.getBreakableLines)(getState(), location.source.id);

      if (existingBreakableLines) {
        breakableLines = [...new Set([...existingBreakableLines, ...breakableLines])];
      }

      dispatch({
        type: "SET_ORIGINAL_BREAKABLE_LINES",
        source: location.source,
        breakableLines
      });
    } else {
      // Ignore re-fetching the breakable lines for source actor we already fetched
      breakableLines = (0, _index.getSourceActorBreakableLines)(getState(), location.sourceActor.id);

      if (breakableLines) {
        return;
      }

      breakableLines = await client.getSourceActorBreakableLines(location.sourceActor);
      dispatch({
        type: "SET_SOURCE_ACTOR_BREAKABLE_LINES",
        sourceActor: location.sourceActor,
        breakableLines
      });
    }
  };
}