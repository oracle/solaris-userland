"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.visibleColumnBreakpoints = undefined;
exports.getColumnBreakpoints = getColumnBreakpoints;
exports.getFirstBreakpointPosition = getFirstBreakpointPosition;

var _lodash = require("devtools/client/shared/vendor/lodash");

var _reselect = require("devtools/client/debugger/dist/vendors").vendored["reselect"];

var _selectors = require("../selectors/index");

var _visibleBreakpoints = require("./visibleBreakpoints");

var _selectedLocation = require("../utils/selected-location");

var _location = require("../utils/location");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function contains(location, range) {
  return location.line >= range.start.line && location.line <= range.end.line && (!location.column || location.column >= range.start.column && location.column <= range.end.column);
}

function groupBreakpoints(breakpoints, selectedSource) {
  if (!breakpoints) {
    return {};
  }

  const map = (0, _lodash.groupBy)(breakpoints.filter(breakpoint => !breakpoint.options.hidden), breakpoint => (0, _selectedLocation.getSelectedLocation)(breakpoint, selectedSource).line);

  for (const line in map) {
    map[line] = (0, _lodash.groupBy)(map[line], breakpoint => (0, _selectedLocation.getSelectedLocation)(breakpoint, selectedSource).column);
  }

  return map;
}

function findBreakpoint(location, breakpointMap) {
  const { line, column } = location;
  const breakpoints = breakpointMap[line] && breakpointMap[line][column];

  if (breakpoints) {
    return breakpoints[0];
  }
}

function filterByLineCount(positions, selectedSource) {
  const lineCount = {};

  for (const breakpoint of positions) {
    const { line } = (0, _selectedLocation.getSelectedLocation)(breakpoint, selectedSource);
    if (!lineCount[line]) {
      lineCount[line] = 0;
    }

    lineCount[line] = lineCount[line] + 1;
  }

  return positions.filter(breakpoint => lineCount[(0, _selectedLocation.getSelectedLocation)(breakpoint, selectedSource).line] > 1);
}

function filterVisible(positions, selectedSource, viewport) {
  return positions.filter(columnBreakpoint => {
    const location = (0, _selectedLocation.getSelectedLocation)(columnBreakpoint, selectedSource);
    return viewport && contains(location, viewport);
  });
}

function filterByBreakpoints(positions, selectedSource, breakpointMap) {
  return positions.filter(position => {
    const location = (0, _selectedLocation.getSelectedLocation)(position, selectedSource);
    return breakpointMap[location.line];
  });
}

function formatPositions(positions, selectedSource, breakpointMap) {
  return positions.map(position => {
    const location = (0, _selectedLocation.getSelectedLocation)(position, selectedSource);
    return {
      location,
      breakpoint: findBreakpoint(location, breakpointMap)
    };
  });
}

function convertToList(breakpointPositions) {
  return [].concat(...Object.values(breakpointPositions));
}

function getColumnBreakpoints(positions, breakpoints, viewport, selectedSource) {
  if (!positions) {
    return [];
  }

  // We only want to show a column breakpoint if several conditions are matched
  // - it is the first breakpoint to appear at an the original location
  // - the position is in the current viewport
  // - there is atleast one other breakpoint on that line
  // - there is a breakpoint on that line
  const breakpointMap = groupBreakpoints(breakpoints, selectedSource);
  let newPositions = convertToList(positions);
  newPositions = filterByLineCount(newPositions, selectedSource);
  newPositions = filterVisible(newPositions, selectedSource, viewport);
  newPositions = filterByBreakpoints(newPositions, selectedSource, breakpointMap);

  return formatPositions(newPositions, selectedSource, breakpointMap);
}

const getVisibleBreakpointPositions = (0, _reselect.createSelector)(_selectors.getSelectedSource, _selectors.getBreakpointPositions, (source, positions) => source && positions[source.id]);

const visibleColumnBreakpoints = exports.visibleColumnBreakpoints = (0, _reselect.createSelector)(getVisibleBreakpointPositions, _visibleBreakpoints.getVisibleBreakpoints, _selectors.getViewport, _selectors.getSelectedSource, getColumnBreakpoints);

function getFirstBreakpointPosition(state, { line, sourceId }) {
  const positions = (0, _selectors.getBreakpointPositionsForSource)(state, sourceId);
  const source = (0, _selectors.getSource)(state, sourceId);

  if (!source || !positions) {
    return;
  }

  return (0, _location.sortSelectedLocations)(convertToList(positions), source).find(position => (0, _selectedLocation.getSelectedLocation)(position, source).line == line);
}