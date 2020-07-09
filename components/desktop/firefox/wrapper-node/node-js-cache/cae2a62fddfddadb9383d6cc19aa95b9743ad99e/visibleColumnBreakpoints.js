"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getColumnBreakpoints = getColumnBreakpoints;
exports.getFirstBreakpointPosition = getFirstBreakpointPosition;
exports.visibleColumnBreakpoints = void 0;

var _lodash = require("devtools/client/shared/vendor/lodash");

var _reselect = require("devtools/client/shared/vendor/reselect");

loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_visibleBreakpoints", "devtools/client/debugger/src/selectors/visibleBreakpoints");
loader.lazyRequireGetter(this, "_selectedLocation", "devtools/client/debugger/src/utils/selected-location");
loader.lazyRequireGetter(this, "_location", "devtools/client/debugger/src/utils/location");
loader.lazyRequireGetter(this, "_source", "devtools/client/debugger/src/utils/source");

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
  var _breakpointMap$line;

  const {
    line,
    column
  } = location;
  const breakpoints = (_breakpointMap$line = breakpointMap[line]) === null || _breakpointMap$line === void 0 ? void 0 : _breakpointMap$line[column];

  if (breakpoints) {
    return breakpoints[0];
  }
}

function filterByLineCount(positions, selectedSource) {
  const lineCount = {};

  for (const breakpoint of positions) {
    const {
      line
    } = (0, _selectedLocation.getSelectedLocation)(breakpoint, selectedSource);

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
} // Filters out breakpoints to the right of the line. (bug 1552039)


function filterInLine(positions, selectedSource, selectedContent) {
  return positions.filter(position => {
    const location = (0, _selectedLocation.getSelectedLocation)(position, selectedSource);
    const lineText = (0, _source.getLineText)(selectedSource.id, selectedContent, location.line);
    return lineText.length >= (location.column || 0);
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
  if (!positions || !selectedSource) {
    return [];
  } // We only want to show a column breakpoint if several conditions are matched
  // - it is the first breakpoint to appear at an the original location
  // - the position is in the current viewport
  // - there is atleast one other breakpoint on that line
  // - there is a breakpoint on that line


  const breakpointMap = groupBreakpoints(breakpoints, selectedSource);
  positions = filterByLineCount(positions, selectedSource);
  positions = filterVisible(positions, selectedSource, viewport);
  positions = filterInLine(positions, selectedSource, selectedSource.content);
  positions = filterByBreakpoints(positions, selectedSource, breakpointMap);
  return formatPositions(positions, selectedSource, breakpointMap);
}

const getVisibleBreakpointPositions = (0, _reselect.createSelector)(_selectors.getSelectedSource, _selectors.getBreakpointPositions, (source, positions) => {
  if (!source) {
    return [];
  }

  const sourcePositions = positions[source.id];

  if (!sourcePositions) {
    return [];
  }

  return convertToList(sourcePositions);
});
const visibleColumnBreakpoints = (0, _reselect.createSelector)(getVisibleBreakpointPositions, _visibleBreakpoints.getVisibleBreakpoints, _selectors.getViewport, _selectors.getSelectedSourceWithContent, getColumnBreakpoints);
exports.visibleColumnBreakpoints = visibleColumnBreakpoints;

function getFirstBreakpointPosition(state, {
  line,
  sourceId
}) {
  const positions = (0, _selectors.getBreakpointPositionsForSource)(state, sourceId);
  const source = (0, _selectors.getSource)(state, sourceId);

  if (!source || !positions) {
    return;
  }

  return (0, _location.sortSelectedLocations)(convertToList(positions), source).find(position => (0, _selectedLocation.getSelectedLocation)(position, source).line == line);
}