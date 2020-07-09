"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  addHiddenBreakpoint: true,
  disableBreakpointsInSource: true,
  enableBreakpointsInSource: true,
  toggleAllBreakpoints: true,
  toggleBreakpoints: true,
  toggleBreakpointsAtLine: true,
  removeAllBreakpoints: true,
  removeBreakpoints: true,
  removeBreakpointsInSource: true,
  remapBreakpoints: true,
  toggleBreakpointAtLine: true,
  addBreakpointAtLine: true,
  removeBreakpointsAtLine: true,
  disableBreakpointsAtLine: true,
  enableBreakpointsAtLine: true,
  toggleDisabledBreakpoint: true,
  enableXHRBreakpoint: true,
  disableXHRBreakpoint: true,
  updateXHRBreakpoint: true,
  togglePauseOnAny: true,
  setXHRBreakpoint: true,
  removeXHRBreakpoint: true
};
exports.addHiddenBreakpoint = addHiddenBreakpoint;
exports.disableBreakpointsInSource = disableBreakpointsInSource;
exports.enableBreakpointsInSource = enableBreakpointsInSource;
exports.toggleAllBreakpoints = toggleAllBreakpoints;
exports.toggleBreakpoints = toggleBreakpoints;
exports.toggleBreakpointsAtLine = toggleBreakpointsAtLine;
exports.removeAllBreakpoints = removeAllBreakpoints;
exports.removeBreakpoints = removeBreakpoints;
exports.removeBreakpointsInSource = removeBreakpointsInSource;
exports.remapBreakpoints = remapBreakpoints;
exports.toggleBreakpointAtLine = toggleBreakpointAtLine;
exports.addBreakpointAtLine = addBreakpointAtLine;
exports.removeBreakpointsAtLine = removeBreakpointsAtLine;
exports.disableBreakpointsAtLine = disableBreakpointsAtLine;
exports.enableBreakpointsAtLine = enableBreakpointsAtLine;
exports.toggleDisabledBreakpoint = toggleDisabledBreakpoint;
exports.enableXHRBreakpoint = enableXHRBreakpoint;
exports.disableXHRBreakpoint = disableXHRBreakpoint;
exports.updateXHRBreakpoint = updateXHRBreakpoint;
exports.togglePauseOnAny = togglePauseOnAny;
exports.setXHRBreakpoint = setXHRBreakpoint;
exports.removeXHRBreakpoint = removeXHRBreakpoint;
loader.lazyRequireGetter(this, "_promise", "devtools/client/debugger/src/actions/utils/middleware/promise");
loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_breakpoint", "devtools/client/debugger/src/utils/breakpoint/index");
loader.lazyRequireGetter(this, "_modify", "devtools/client/debugger/src/actions/breakpoints/modify");
Object.keys(_modify).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _modify[key];
    }
  });
});

var _remapLocations = _interopRequireDefault(require("./remapLocations"));

loader.lazyRequireGetter(this, "_breakpointPositions", "devtools/client/debugger/src/actions/breakpoints/breakpointPositions");
Object.keys(_breakpointPositions).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _breakpointPositions[key];
    }
  });
});
loader.lazyRequireGetter(this, "_syncBreakpoint", "devtools/client/debugger/src/actions/breakpoints/syncBreakpoint");
Object.keys(_syncBreakpoint).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _syncBreakpoint[key];
    }
  });
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

/**
 * Redux actions for breakpoints
 * @module actions/breakpoints
 */
function addHiddenBreakpoint(cx, location) {
  return ({
    dispatch
  }) => {
    return dispatch((0, _modify.addBreakpoint)(cx, location, {
      hidden: true
    }));
  };
}
/**
 * Disable all breakpoints in a source
 *
 * @memberof actions/breakpoints
 * @static
 */


function disableBreakpointsInSource(cx, source) {
  return async ({
    dispatch,
    getState,
    client
  }) => {
    const breakpoints = (0, _selectors.getBreakpointsForSource)(getState(), source.id);

    for (const breakpoint of breakpoints) {
      if (!breakpoint.disabled) {
        dispatch((0, _modify.disableBreakpoint)(cx, breakpoint));
      }
    }
  };
}
/**
 * Enable all breakpoints in a source
 *
 * @memberof actions/breakpoints
 * @static
 */


function enableBreakpointsInSource(cx, source) {
  return async ({
    dispatch,
    getState,
    client
  }) => {
    const breakpoints = (0, _selectors.getBreakpointsForSource)(getState(), source.id);

    for (const breakpoint of breakpoints) {
      if (breakpoint.disabled) {
        dispatch((0, _modify.enableBreakpoint)(cx, breakpoint));
      }
    }
  };
}
/**
 * Toggle All Breakpoints
 *
 * @memberof actions/breakpoints
 * @static
 */


function toggleAllBreakpoints(cx, shouldDisableBreakpoints) {
  return async ({
    dispatch,
    getState,
    client
  }) => {
    const breakpoints = (0, _selectors.getBreakpointsList)(getState());

    for (const breakpoint of breakpoints) {
      if (shouldDisableBreakpoints) {
        dispatch((0, _modify.disableBreakpoint)(cx, breakpoint));
      } else {
        dispatch((0, _modify.enableBreakpoint)(cx, breakpoint));
      }
    }
  };
}
/**
 * Toggle Breakpoints
 *
 * @memberof actions/breakpoints
 * @static
 */


function toggleBreakpoints(cx, shouldDisableBreakpoints, breakpoints) {
  return async ({
    dispatch
  }) => {
    const promises = breakpoints.map(breakpoint => shouldDisableBreakpoints ? dispatch((0, _modify.disableBreakpoint)(cx, breakpoint)) : dispatch((0, _modify.enableBreakpoint)(cx, breakpoint)));
    await Promise.all(promises);
  };
}

function toggleBreakpointsAtLine(cx, shouldDisableBreakpoints, line) {
  return async ({
    dispatch,
    getState
  }) => {
    const breakpoints = (0, _selectors.getBreakpointsAtLine)(getState(), line);
    return dispatch(toggleBreakpoints(cx, shouldDisableBreakpoints, breakpoints));
  };
}
/**
 * Removes all breakpoints
 *
 * @memberof actions/breakpoints
 * @static
 */


function removeAllBreakpoints(cx) {
  return async ({
    dispatch,
    getState
  }) => {
    const breakpointList = (0, _selectors.getBreakpointsList)(getState());
    await Promise.all(breakpointList.map(bp => dispatch((0, _modify.removeBreakpoint)(cx, bp))));
    dispatch({
      type: "REMOVE_BREAKPOINTS"
    });
  };
}
/**
 * Removes breakpoints
 *
 * @memberof actions/breakpoints
 * @static
 */


function removeBreakpoints(cx, breakpoints) {
  return async ({
    dispatch
  }) => {
    return Promise.all(breakpoints.map(bp => dispatch((0, _modify.removeBreakpoint)(cx, bp))));
  };
}
/**
 * Removes all breakpoints in a source
 *
 * @memberof actions/breakpoints
 * @static
 */


function removeBreakpointsInSource(cx, source) {
  return async ({
    dispatch,
    getState,
    client
  }) => {
    const breakpoints = (0, _selectors.getBreakpointsForSource)(getState(), source.id);

    for (const breakpoint of breakpoints) {
      dispatch((0, _modify.removeBreakpoint)(cx, breakpoint));
    }
  };
}

function remapBreakpoints(cx, sourceId) {
  return async ({
    dispatch,
    getState,
    sourceMaps
  }) => {
    const breakpoints = (0, _selectors.getBreakpointsForSource)(getState(), sourceId);
    const newBreakpoints = await (0, _remapLocations.default)(breakpoints, sourceId, sourceMaps); // Normally old breakpoints will be clobbered if we re-add them, but when
    // remapping we have changed the source maps and the old breakpoints will
    // have different locations than the new ones. Manually remove the
    // old breakpoints before adding the new ones.

    for (const bp of breakpoints) {
      dispatch((0, _modify.removeBreakpoint)(cx, bp));
    }

    for (const bp of newBreakpoints) {
      await dispatch((0, _modify.addBreakpoint)(cx, bp.location, bp.options, bp.disabled));
    }
  };
}

function toggleBreakpointAtLine(cx, line) {
  return ({
    dispatch,
    getState,
    client,
    sourceMaps
  }) => {
    const state = getState();
    const selectedSource = (0, _selectors.getSelectedSource)(state);

    if (!selectedSource) {
      return;
    }

    const bp = (0, _selectors.getBreakpointAtLocation)(state, {
      line,
      column: undefined
    });

    if (bp) {
      return dispatch((0, _modify.removeBreakpoint)(cx, bp));
    }

    return dispatch((0, _modify.addBreakpoint)(cx, {
      sourceId: selectedSource.id,
      sourceUrl: selectedSource.url,
      line
    }));
  };
}

function addBreakpointAtLine(cx, line, shouldLog = false, disabled = false) {
  return ({
    dispatch,
    getState,
    client,
    sourceMaps
  }) => {
    const state = getState();
    const source = (0, _selectors.getSelectedSource)(state);

    if (!source) {
      return;
    }

    const breakpointLocation = {
      sourceId: source.id,
      sourceUrl: source.url,
      column: undefined,
      line
    };
    const options = {};

    if (shouldLog) {
      options.logValue = "displayName";
    }

    return dispatch((0, _modify.addBreakpoint)(cx, breakpointLocation, options, disabled));
  };
}

function removeBreakpointsAtLine(cx, sourceId, line) {
  return ({
    dispatch,
    getState,
    client,
    sourceMaps
  }) => {
    const breakpointsAtLine = (0, _selectors.getBreakpointsForSource)(getState(), sourceId, line);
    return dispatch(removeBreakpoints(cx, breakpointsAtLine));
  };
}

function disableBreakpointsAtLine(cx, sourceId, line) {
  return ({
    dispatch,
    getState,
    client,
    sourceMaps
  }) => {
    const breakpointsAtLine = (0, _selectors.getBreakpointsForSource)(getState(), sourceId, line);
    return dispatch(toggleBreakpoints(cx, true, breakpointsAtLine));
  };
}

function enableBreakpointsAtLine(cx, sourceId, line) {
  return ({
    dispatch,
    getState,
    client,
    sourceMaps
  }) => {
    const breakpointsAtLine = (0, _selectors.getBreakpointsForSource)(getState(), sourceId, line);
    return dispatch(toggleBreakpoints(cx, false, breakpointsAtLine));
  };
}

function toggleDisabledBreakpoint(cx, breakpoint) {
  return ({
    dispatch,
    getState,
    client,
    sourceMaps
  }) => {
    if (!breakpoint.disabled) {
      return dispatch((0, _modify.disableBreakpoint)(cx, breakpoint));
    }

    return dispatch((0, _modify.enableBreakpoint)(cx, breakpoint));
  };
}

function enableXHRBreakpoint(index, bp) {
  return ({
    dispatch,
    getState,
    client
  }) => {
    const xhrBreakpoints = (0, _selectors.getXHRBreakpoints)(getState());
    const breakpoint = bp || xhrBreakpoints[index];
    const enabledBreakpoint = { ...breakpoint,
      disabled: false
    };
    return dispatch({
      type: "ENABLE_XHR_BREAKPOINT",
      breakpoint: enabledBreakpoint,
      index,
      [_promise.PROMISE]: client.setXHRBreakpoint(breakpoint.path, breakpoint.method)
    });
  };
}

function disableXHRBreakpoint(index, bp) {
  return ({
    dispatch,
    getState,
    client
  }) => {
    const xhrBreakpoints = (0, _selectors.getXHRBreakpoints)(getState());
    const breakpoint = bp || xhrBreakpoints[index];
    const disabledBreakpoint = { ...breakpoint,
      disabled: true
    };
    return dispatch({
      type: "DISABLE_XHR_BREAKPOINT",
      breakpoint: disabledBreakpoint,
      index,
      [_promise.PROMISE]: client.removeXHRBreakpoint(breakpoint.path, breakpoint.method)
    });
  };
}

function updateXHRBreakpoint(index, path, method) {
  return ({
    dispatch,
    getState,
    client
  }) => {
    const xhrBreakpoints = (0, _selectors.getXHRBreakpoints)(getState());
    const breakpoint = xhrBreakpoints[index];
    const updatedBreakpoint = { ...breakpoint,
      path,
      method,
      text: L10N.getFormatStr("xhrBreakpoints.item.label", path)
    };
    return dispatch({
      type: "UPDATE_XHR_BREAKPOINT",
      breakpoint: updatedBreakpoint,
      index,
      [_promise.PROMISE]: Promise.all([client.removeXHRBreakpoint(breakpoint.path, breakpoint.method), client.setXHRBreakpoint(path, method)])
    });
  };
}

function togglePauseOnAny() {
  return ({
    dispatch,
    getState
  }) => {
    const xhrBreakpoints = (0, _selectors.getXHRBreakpoints)(getState());
    const index = xhrBreakpoints.findIndex(({
      path
    }) => path.length === 0);

    if (index < 0) {
      return dispatch(setXHRBreakpoint("", "ANY"));
    }

    const bp = xhrBreakpoints[index];

    if (bp.disabled) {
      return dispatch(enableXHRBreakpoint(index, bp));
    }

    return dispatch(disableXHRBreakpoint(index, bp));
  };
}

function setXHRBreakpoint(path, method) {
  return ({
    dispatch,
    getState,
    client
  }) => {
    const breakpoint = (0, _breakpoint.createXHRBreakpoint)(path, method);
    return dispatch({
      type: "SET_XHR_BREAKPOINT",
      breakpoint,
      [_promise.PROMISE]: client.setXHRBreakpoint(path, method)
    });
  };
}

function removeXHRBreakpoint(index) {
  return ({
    dispatch,
    getState,
    client
  }) => {
    const xhrBreakpoints = (0, _selectors.getXHRBreakpoints)(getState());
    const breakpoint = xhrBreakpoints[index];
    return dispatch({
      type: "REMOVE_XHR_BREAKPOINT",
      breakpoint,
      index,
      [_promise.PROMISE]: client.removeXHRBreakpoint(breakpoint.path, breakpoint.method)
    });
  };
}