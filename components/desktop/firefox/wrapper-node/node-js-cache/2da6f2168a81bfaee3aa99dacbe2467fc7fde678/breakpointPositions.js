"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setBreakpointPositions = undefined;

var _devtoolsSourceMap = require("devtools/client/shared/source-map/index.js");

var _lodash = require("devtools/client/shared/vendor/lodash");

var _selectors = require("../../selectors/index");

var _breakpoint = require("../../utils/breakpoint/index");

var _memoizableAction = require("../../utils/memoizableAction");

async function mapLocations(generatedLocations, { sourceMaps }) {
  if (generatedLocations.length == 0) {
    return [];
  }

  const { sourceId } = generatedLocations[0];

  const originalLocations = await sourceMaps.getOriginalLocations(sourceId, generatedLocations);

  return (0, _lodash.zip)(originalLocations, generatedLocations).map(([location, generatedLocation]) => ({ location, generatedLocation }));
}

// Filter out positions, that are not in the original source Id
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

function filterBySource(positions, sourceId) {
  if (!(0, _devtoolsSourceMap.isOriginalId)(sourceId)) {
    return positions;
  }
  return positions.filter(position => position.location.sourceId == sourceId);
}

function filterByUniqLocation(positions) {
  return (0, _lodash.uniqBy)(positions, ({ location }) => (0, _breakpoint.makeBreakpointId)(location));
}

function convertToList(results, source) {
  const { id, url } = source;
  const positions = [];

  for (const line in results) {
    for (const column of results[line]) {
      positions.push({
        line: Number(line),
        column: column,
        sourceId: id,
        sourceUrl: url
      });
    }
  }

  return positions;
}

function groupByLine(results, sourceId, line) {
  const isOriginal = (0, _devtoolsSourceMap.isOriginalId)(sourceId);
  const positions = {};

  // Ensure that we have an entry for the line fetched
  if (typeof line === "number") {
    positions[line] = [];
  }

  for (const result of results) {
    const location = isOriginal ? result.location : result.generatedLocation;

    if (!positions[location.line]) {
      positions[location.line] = [];
    }

    positions[location.line].push(result);
  }

  return positions;
}

async function _setBreakpointPositions(cx, sourceId, line, thunkArgs) {
  const { client, dispatch, getState, sourceMaps } = thunkArgs;
  let generatedSource = (0, _selectors.getSource)(getState(), sourceId);
  if (!generatedSource) {
    return;
  }

  let results = {};
  if ((0, _devtoolsSourceMap.isOriginalId)(sourceId)) {
    // Explicitly typing ranges is required to work around the following issue
    const ranges = await sourceMaps.getGeneratedRangesForOriginal(sourceId, generatedSource.url, true);
    const generatedSourceId = (0, _devtoolsSourceMap.originalToGeneratedId)(sourceId);
    generatedSource = (0, _selectors.getSourceFromId)(getState(), generatedSourceId);

    // Note: While looping here may not look ideal, in the vast majority of
    // cases, the number of ranges here should be very small, and is quite
    // likely to only be a single range.
    for (const range of ranges) {
      // Wrap infinite end positions to the next line to keep things simple
      // and because we know we don't care about the end-line whitespace
      // in this case.
      if (range.end.column === Infinity) {
        range.end = {
          line: range.end.line + 1,
          column: 0
        };
      }

      const bps = await client.getBreakpointPositions((0, _selectors.getSourceActorsForSource)(getState(), generatedSource.id), range);
      for (const bpLine in bps) {
        results[bpLine] = (results[bpLine] || []).concat(bps[bpLine]);
      }
    }
  } else {
    if (typeof line !== "number") {
      throw new Error("Line is required for generated sources");
    }

    results = await client.getBreakpointPositions((0, _selectors.getSourceActorsForSource)(getState(), generatedSource.id), { start: { line, column: 0 }, end: { line: line + 1, column: 0 } });
  }

  let positions = convertToList(results, generatedSource);
  positions = await mapLocations(positions, thunkArgs);

  positions = filterBySource(positions, sourceId);
  positions = filterByUniqLocation(positions);
  positions = groupByLine(positions, sourceId, line);

  const source = (0, _selectors.getSource)(getState(), sourceId);
  // NOTE: it's possible that the source was removed during a navigate
  if (!source) {
    return;
  }

  dispatch({
    type: "ADD_BREAKPOINT_POSITIONS",
    cx,
    source: source,
    positions
  });

  return positions;
}

function generatedSourceActorKey(state, sourceId) {
  const generatedSource = (0, _selectors.getSource)(state, (0, _devtoolsSourceMap.isOriginalId)(sourceId) ? (0, _devtoolsSourceMap.originalToGeneratedId)(sourceId) : sourceId);
  const actors = generatedSource ? (0, _selectors.getSourceActorsForSource)(state, generatedSource.id).map(({ actor }) => actor) : [];
  return [sourceId, ...actors].join(":");
}

const setBreakpointPositions = exports.setBreakpointPositions = (0, _memoizableAction.memoizeableAction)("setBreakpointPositions", {
  hasValue: ({ sourceId, line }, { getState }) => (0, _devtoolsSourceMap.isGeneratedId)(sourceId) && line ? (0, _selectors.hasBreakpointPositionsForLine)(getState(), sourceId, line) : (0, _selectors.hasBreakpointPositions)(getState(), sourceId),
  getValue: ({ sourceId, line }, { getState }) => (0, _selectors.getBreakpointPositionsForSource)(getState(), sourceId),
  createKey({ sourceId, line }, { getState }) {
    const key = generatedSourceActorKey(getState(), sourceId);
    return (0, _devtoolsSourceMap.isGeneratedId)(sourceId) && line ? `${key}-${line}` : key;
  },
  action: async ({ cx, sourceId, line }, thunkArgs) => _setBreakpointPositions(cx, sourceId, line, thunkArgs)
});