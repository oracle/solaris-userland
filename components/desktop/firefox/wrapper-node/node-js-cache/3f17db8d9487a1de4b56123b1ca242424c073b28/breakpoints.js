"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initialBreakpointsState = initialBreakpointsState;
exports.getBreakpointsMap = getBreakpointsMap;
exports.getBreakpointsList = getBreakpointsList;
exports.getBreakpointCount = getBreakpointCount;
exports.getBreakpoint = getBreakpoint;
exports.getBreakpointsDisabled = getBreakpointsDisabled;
exports.getBreakpointsForSource = getBreakpointsForSource;
exports.getBreakpointForLocation = getBreakpointForLocation;
exports.getHiddenBreakpoint = getHiddenBreakpoint;
exports.hasLogpoint = hasLogpoint;
exports.default = void 0;

var _devtoolsSourceMap = require("devtools/client/shared/source-map/index.js");

var _lodash = require("devtools/client/shared/vendor/lodash");

loader.lazyRequireGetter(this, "_breakpoint", "devtools/client/debugger/src/utils/breakpoint/index");
loader.lazyRequireGetter(this, "_breakpoints", "devtools/client/debugger/src/selectors/breakpoints");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

/**
 * Breakpoints reducer
 * @module reducers/breakpoints
 */
// eslint-disable-next-line max-len
function initialBreakpointsState(xhrBreakpoints = []) {
  return {
    breakpoints: {},
    xhrBreakpoints,
    breakpointsDisabled: false
  };
}

function update(state = initialBreakpointsState(), action) {
  switch (action.type) {
    case "SET_BREAKPOINT":
      {
        if (action.status === "start") {
          return setBreakpoint(state, action);
        }

        return state;
      }

    case "REMOVE_BREAKPOINT":
      {
        if (action.status === "start") {
          return removeBreakpoint(state, action);
        }

        return state;
      }

    case "REMOVE_BREAKPOINTS":
      {
        return { ...state,
          breakpoints: {}
        };
      }

    case "NAVIGATE":
      {
        return initialBreakpointsState(state.xhrBreakpoints);
      }

    case "SET_XHR_BREAKPOINT":
      {
        return addXHRBreakpoint(state, action);
      }

    case "REMOVE_XHR_BREAKPOINT":
      {
        return removeXHRBreakpoint(state, action);
      }

    case "UPDATE_XHR_BREAKPOINT":
      {
        return updateXHRBreakpoint(state, action);
      }

    case "ENABLE_XHR_BREAKPOINT":
      {
        return updateXHRBreakpoint(state, action);
      }

    case "DISABLE_XHR_BREAKPOINT":
      {
        return updateXHRBreakpoint(state, action);
      }
  }

  return state;
}

function addXHRBreakpoint(state, action) {
  const {
    xhrBreakpoints
  } = state;
  const {
    breakpoint
  } = action;
  const {
    path,
    method
  } = breakpoint;
  const existingBreakpointIndex = state.xhrBreakpoints.findIndex(bp => bp.path === path && bp.method === method);

  if (existingBreakpointIndex === -1) {
    return { ...state,
      xhrBreakpoints: [...xhrBreakpoints, breakpoint]
    };
  } else if (xhrBreakpoints[existingBreakpointIndex] !== breakpoint) {
    const newXhrBreakpoints = [...xhrBreakpoints];
    newXhrBreakpoints[existingBreakpointIndex] = breakpoint;
    return { ...state,
      xhrBreakpoints: newXhrBreakpoints
    };
  }

  return state;
}

function removeXHRBreakpoint(state, action) {
  const {
    breakpoint
  } = action;
  const {
    xhrBreakpoints
  } = state;

  if (action.status === "start") {
    return state;
  }

  return { ...state,
    xhrBreakpoints: xhrBreakpoints.filter(bp => !(0, _lodash.isEqual)(bp, breakpoint))
  };
}

function updateXHRBreakpoint(state, action) {
  const {
    breakpoint,
    index
  } = action;
  const {
    xhrBreakpoints
  } = state;
  const newXhrBreakpoints = [...xhrBreakpoints];
  newXhrBreakpoints[index] = breakpoint;
  return { ...state,
    xhrBreakpoints: newXhrBreakpoints
  };
}

function setBreakpoint(state, {
  breakpoint
}) {
  const id = (0, _breakpoint.makeBreakpointId)(breakpoint.location);
  const breakpoints = { ...state.breakpoints,
    [id]: breakpoint
  };
  return { ...state,
    breakpoints
  };
}

function removeBreakpoint(state, {
  location
}) {
  const id = (0, _breakpoint.makeBreakpointId)(location);
  const breakpoints = { ...state.breakpoints
  };
  delete breakpoints[id];
  return { ...state,
    breakpoints
  };
}

function isMatchingLocation(location1, location2) {
  return (0, _lodash.isEqual)(location1, location2);
} // Selectors
// TODO: these functions should be moved out of the reducer


function getBreakpointsMap(state) {
  return state.breakpoints.breakpoints;
}

function getBreakpointsList(state) {
  return (0, _breakpoints.getBreakpointsList)(state);
}

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

function getBreakpointsDisabled(state) {
  const breakpoints = getBreakpointsList(state);
  return breakpoints.every(breakpoint => breakpoint.disabled);
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

function getBreakpointForLocation(state, location) {
  if (!location) {
    return undefined;
  }

  const isGeneratedSource = (0, _devtoolsSourceMap.isGeneratedId)(location.sourceId);
  return getBreakpointsList(state).find(bp => {
    const loc = isGeneratedSource ? bp.generatedLocation : bp.location;
    return isMatchingLocation(loc, location);
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

var _default = update;
exports.default = _default;