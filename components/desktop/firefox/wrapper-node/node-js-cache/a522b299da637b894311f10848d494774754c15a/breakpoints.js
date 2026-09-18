"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initialBreakpointsState = initialBreakpointsState;
exports.default = void 0;
loader.lazyRequireGetter(this, "_create", "devtools/client/debugger/src/client/firefox/create");
loader.lazyRequireGetter(this, "_index", "devtools/client/debugger/src/utils/breakpoint/index");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

/**
 * Breakpoints reducer
 *
 * @module reducers/breakpoints
 */
function initialBreakpointsState(xhrBreakpoints = []) {
  return {
    breakpoints: {},
    xhrBreakpoints
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

    case "CLEAR_BREAKPOINTS":
      {
        return { ...state,
          breakpoints: {}
        };
      }

    case "REMOVE_SOURCES":
      {
        return removeBreakpointsForSources(state, action.sources);
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

    case "CLEAR_XHR_BREAKPOINTS":
      {
        if (action.status == "start") {
          return state;
        }

        return { ...state,
          xhrBreakpoints: []
        };
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
    xhrBreakpoints: xhrBreakpoints.filter(bp => bp.path !== breakpoint.path || bp.method !== breakpoint.method)
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
  const id = (0, _index.makeBreakpointId)(breakpoint.location);
  const breakpoints = { ...state.breakpoints,
    [id]: breakpoint
  };
  return { ...state,
    breakpoints
  };
}

function removeBreakpoint(state, {
  breakpoint
}) {
  const id = (0, _index.makeBreakpointId)(breakpoint.location);
  const breakpoints = { ...state.breakpoints
  };
  delete breakpoints[id];
  return { ...state,
    breakpoints
  };
}

function removeBreakpointsForSources(state, sources) {
  if (!sources.length) {
    return state;
  }

  const remainingBreakpoints = {};
  let changed = false;

  for (const [id, breakpoint] of Object.entries(state.breakpoints)) {
    if (!sources.includes(breakpoint.location.source)) {
      remainingBreakpoints[id] = breakpoint;
    } else if (breakpoint.location.source.isOriginal && !sources.includes(breakpoint.generatedLocation.source)) {
      // If we are removing an original source (which can be a pretty printed source), without removing its related generated/bundle/minimized source,
      // the breakpoint is kept and replaced with an identical one but only against the generated source.
      // We don't have to map the location, but instead only strip the references to original location.
      const generatedId = (0, _index.makeBreakpointId)(breakpoint.generatedLocation);
      remainingBreakpoints[generatedId] = (0, _create.createBreakpoint)({ ...breakpoint,
        id: generatedId,
        location: breakpoint.generatedLocation,
        originalText: breakpoint.text
      });
      changed = true;
    } else {
      changed = true;
    }
  }

  return changed ? { ...state,
    breakpoints: remainingBreakpoints
  } : state;
}

var _default = update;
exports.default = _default;