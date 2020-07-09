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
      return setBreakpoint(state, action);

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

function setBreakpoint(state, {
  breakpoint
}) {
  if (breakpoint.options.hidden) {
    return state;
  }

  const location = !breakpoint.location.sourceUrl || (0, _source.isPrettyURL)(breakpoint.location.sourceUrl) ? breakpoint.generatedLocation : breakpoint.location;
  const locationId = (0, _breakpoint.makePendingLocationId)(location);
  const pendingBreakpoint = (0, _breakpoint.createPendingBreakpoint)(breakpoint);
  return { ...state,
    [locationId]: pendingBreakpoint
  };
}

function removeBreakpoint(state, {
  location
}) {
  const locationId = (0, _breakpoint.makePendingLocationId)(location);
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