"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setBreakableLines = setBreakableLines;

var _devtoolsSourceMap = require("devtools/client/shared/source-map/index.js");

loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_breakpointPositions", "devtools/client/debugger/src/actions/breakpoints/breakpointPositions");

var _lodash = require("devtools/client/shared/vendor/lodash");

loader.lazyRequireGetter(this, "_sourceActors", "devtools/client/debugger/src/actions/source-actors");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function calculateBreakableLines(positions) {
  const lines = [];

  for (const line in positions) {
    if (positions[line].length > 0) {
      lines.push(Number(line));
    }
  }

  return lines;
}

function setBreakableLines(cx, sourceId) {
  return async ({
    getState,
    dispatch,
    client
  }) => {
    let breakableLines;

    if ((0, _devtoolsSourceMap.isOriginalId)(sourceId)) {
      const positions = await dispatch((0, _breakpointPositions.setBreakpointPositions)({
        cx,
        sourceId
      }));
      breakableLines = calculateBreakableLines(positions);
      const existingBreakableLines = (0, _selectors.getBreakableLines)(getState(), sourceId);

      if (existingBreakableLines) {
        breakableLines = (0, _lodash.union)(existingBreakableLines, breakableLines);
      }

      dispatch({
        type: "SET_ORIGINAL_BREAKABLE_LINES",
        cx,
        sourceId,
        breakableLines
      });
    } else {
      const actors = (0, _selectors.getSourceActorsForSource)(getState(), sourceId);
      await Promise.all(actors.map(({
        id
      }) => dispatch((0, _sourceActors.loadSourceActorBreakableLines)({
        id,
        cx
      }))));
    }
  };
}