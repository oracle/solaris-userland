"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setBreakableLines = setBreakableLines;

var _index = require("devtools/client/shared/source-map-loader/index");

loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");
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
 * @param Object cx
 * @param Object location
 */


function setBreakableLines(cx, location) {
  return async ({
    getState,
    dispatch,
    client
  }) => {
    let breakableLines;

    if ((0, _index.isOriginalId)(location.source.id)) {
      const positions = await dispatch((0, _breakpointPositions.setBreakpointPositions)({
        cx,
        location
      }));
      breakableLines = calculateBreakableLines(positions);
      const existingBreakableLines = (0, _selectors.getBreakableLines)(getState(), location.source.id);

      if (existingBreakableLines) {
        breakableLines = [...new Set([...existingBreakableLines, ...breakableLines])];
      }

      dispatch({
        type: "SET_ORIGINAL_BREAKABLE_LINES",
        cx,
        sourceId: location.source.id,
        breakableLines
      });
    } else {
      // Ignore re-fetching the breakable lines for source actor we already fetched
      breakableLines = (0, _selectors.getSourceActorBreakableLines)(getState(), location.sourceActor.id);

      if (breakableLines) {
        return;
      }

      breakableLines = await client.getSourceActorBreakableLines(location.sourceActor);
      dispatch({
        type: "SET_SOURCE_ACTOR_BREAKABLE_LINES",
        sourceActorId: location.sourceActor.id,
        breakableLines
      });
    }
  };
}