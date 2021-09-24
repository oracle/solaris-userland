"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPendingBreakpoints = getPendingBreakpoints;
exports.getPendingBreakpointList = getPendingBreakpointList;
exports.getPendingBreakpointsForSource = getPendingBreakpointsForSource;
exports.default = void 0;
loader.lazyRequireGetter(this, "_breakpoint", "devtools/client/debugger/src/utils/breakpoint/index");
loader.lazyRequireGetter(this, "_source", "devtools/client/debugger/src/utils/source");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

/**
 * Pending breakpoints reducer
 * @module reducers/pending-breakpoints
 */
function update(state = {}, action) {
  switch (action.type) {
    case "SET_BREAKPOINT":
      if (action.status === "start") {
        return setBreakpoint(state, action);
      }

      return state;

    case "REMOVE_BREAKPOINT":
      if (action.status === "start") {
        return removeBreakpoint(state, action);
      }

      return state;

    case "REMOVE_PENDING_BREAKPOINT":
      return removeBreakpoint(state, action);

    case "REMOVE_BREAKPOINTS":
      {
        return {};
      }
  }

  return state;
}
/**
 * Return a location id representing a breakpoint's original location, or for
 * pretty-printed sources, its generated location.
 * @param {{ location: Location, originalLocation?: Location }} breakpoint
 */


function makePendingLocationIdFromBreakpoint(breakpoint) {
  const location = !breakpoint.location.sourceUrl || (0, _source.isPrettyURL)(breakpoint.location.sourceUrl) ? breakpoint.generatedLocation : breakpoint.location;
  return (0, _breakpoint.makePendingLocationId)(location);
}

function setBreakpoint(state, {
  breakpoint
}) {
  if (breakpoint.options.hidden) {
    return state;
  }

  const locationId = makePendingLocationIdFromBreakpoint(breakpoint);
  const pendingBreakpoint = (0, _breakpoint.createPendingBreakpoint)(breakpoint);
  return { ...state,
    [locationId]: pendingBreakpoint
  };
}

function removeBreakpoint(state, {
  breakpoint
}) {
  const locationId = makePendingLocationIdFromBreakpoint(breakpoint);
  state = { ...state
  };
  delete state[locationId];
  return state;
} // Selectors
// TODO: these functions should be moved out of the reducer


function getPendingBreakpoints(state) {
  return state.pendingBreakpoints;
}

function getPendingBreakpointList(state) {
  return Object.values(getPendingBreakpoints(state));
}

function getPendingBreakpointsForSource(state, source) {
  return getPendingBreakpointList(state).filter(pendingBreakpoint => {
    return pendingBreakpoint.location.sourceUrl === source.url || pendingBreakpoint.generatedLocation.sourceUrl == source.url;
  });
}

var _default = update;
exports.default = _default;