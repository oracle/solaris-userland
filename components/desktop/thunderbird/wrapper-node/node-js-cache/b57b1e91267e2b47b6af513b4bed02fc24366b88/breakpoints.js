"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBreakpointsMap = getBreakpointsMap;
exports.getBreakpointCount = getBreakpointCount;
exports.getBreakpoint = getBreakpoint;
exports.getBreakpointsForSource = getBreakpointsForSource;
exports.getHiddenBreakpoint = getHiddenBreakpoint;
exports.hasLogpoint = hasLogpoint;
exports.getXHRBreakpoints = getXHRBreakpoints;
exports.shouldPauseOnAnyXHR = exports.getBreakpointsList = void 0;

var _reselect = require("devtools/client/shared/vendor/reselect");

var _devtoolsSourceMap = require("devtools/client/shared/source-map/index.js");

loader.lazyRequireGetter(this, "_breakpoint", "devtools/client/debugger/src/utils/breakpoint/index");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
// This method is only used from the main test helper
function getBreakpointsMap(state) {
  return state.breakpoints.breakpoints;
}

const getBreakpointsList = (0, _reselect.createSelector)(state => state.breakpoints.breakpoints, breakpoints => Object.values(breakpoints));
exports.getBreakpointsList = getBreakpointsList;

function getBreakpointCount(state) {
  return getBreakpointsList(state).length;
}

function getBreakpoint(state, location) {
  if (!location) {
    return undefined;
  }

  const breakpoints = getBreakpointsMap(state);
  return breakpoints[(0, _breakpoint.makeBreakpointId)(location)];
}

function getBreakpointsForSource(state, sourceId, line) {
  if (!sourceId) {
    return [];
  }

  const isGeneratedSource = (0, _devtoolsSourceMap.isGeneratedId)(sourceId);
  const breakpoints = getBreakpointsList(state);
  return breakpoints.filter(bp => {
    const location = isGeneratedSource ? bp.generatedLocation : bp.location;
    return location.sourceId === sourceId && (!line || line == location.line);
  });
}

function getHiddenBreakpoint(state) {
  const breakpoints = getBreakpointsList(state);
  return breakpoints.find(bp => bp.options.hidden);
}

function hasLogpoint(state, location) {
  const breakpoint = getBreakpoint(state, location);
  return breakpoint === null || breakpoint === void 0 ? void 0 : breakpoint.options.logValue;
}

function getXHRBreakpoints(state) {
  return state.breakpoints.xhrBreakpoints;
}

const shouldPauseOnAnyXHR = (0, _reselect.createSelector)(getXHRBreakpoints, xhrBreakpoints => {
  const emptyBp = xhrBreakpoints.find(({
    path
  }) => path.length === 0);

  if (!emptyBp) {
    return false;
  }

  return !emptyBp.disabled;
});
exports.shouldPauseOnAnyXHR = shouldPauseOnAnyXHR;