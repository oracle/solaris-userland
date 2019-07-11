"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPendingBreakpoints = getPendingBreakpoints;
exports.getPendingBreakpointList = getPendingBreakpointList;
exports.getPendingBreakpointsForSource = getPendingBreakpointsForSource;

var _sources = require("./sources");

var _breakpoint = require("../utils/breakpoint/index");

var _source = require("../utils/source");

function update(state = {}, action) {
  switch (action.type) {
    case "SET_BREAKPOINT":
      return setBreakpoint(state, action);

    case "REMOVE_BREAKPOINT":
    case "REMOVE_PENDING_BREAKPOINT":
      return removeBreakpoint(state, action);
  }

  return state;
} /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

/**
 * Pending breakpoints reducer
 * @module reducers/pending-breakpoints
 */

function setBreakpoint(state, { breakpoint }) {
  if (breakpoint.options.hidden) {
    return state;
  }

  const locationId = (0, _breakpoint.makePendingLocationId)(breakpoint.location);
  const pendingBreakpoint = (0, _breakpoint.createPendingBreakpoint)(breakpoint);

  return { ...state, [locationId]: pendingBreakpoint };
}

function removeBreakpoint(state, { location }) {
  const locationId = (0, _breakpoint.makePendingLocationId)(location);

  state = { ...state };
  delete state[locationId];
  return state;
}

// Selectors
// TODO: these functions should be moved out of the reducer

function getPendingBreakpoints(state) {
  return state.pendingBreakpoints;
}

function getPendingBreakpointList(state) {
  return Object.values(getPendingBreakpoints(state));
}

function getPendingBreakpointsForSource(state, source) {
  const sources = (0, _sources.getSourcesByURL)(state, source.url);
  if (sources.length > 1 && (0, _source.isGenerated)(source)) {
    // Don't return pending breakpoints for duplicated generated sources
    return [];
  }

  return getPendingBreakpointList(state).filter(pendingBreakpoint => {
    return pendingBreakpoint.location.sourceUrl === source.url || pendingBreakpoint.generatedLocation.sourceUrl == source.url;
  });
}

exports.default = update;