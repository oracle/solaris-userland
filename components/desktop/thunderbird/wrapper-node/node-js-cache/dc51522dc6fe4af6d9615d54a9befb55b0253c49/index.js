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
  updateBreakpointsForNewPrettyPrintedSource: true,
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
  removeAllXHRBreakpoints: true,
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
exports.updateBreakpointsForNewPrettyPrintedSource = updateBreakpointsForNewPrettyPrintedSource;
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
exports.removeAllXHRBreakpoints = removeAllXHRBreakpoints;
exports.removeXHRBreakpoint = removeXHRBreakpoint;
loader.lazyRequireGetter(this, "_promise", "devtools/client/debugger/src/actions/utils/middleware/promise");
loader.lazyRequireGetter(this, "_prefs", "devtools/client/debugger/src/utils/prefs");
loader.lazyRequireGetter(this, "_location", "devtools/client/debugger/src/utils/location");
loader.lazyRequireGetter(this, "_index", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_index2", "devtools/client/debugger/src/utils/breakpoint/index");
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
loader.lazyRequireGetter(this, "_sourceMaps", "devtools/client/debugger/src/utils/source-maps");
loader.lazyRequireGetter(this, "_skipPausing", "devtools/client/debugger/src/actions/pause/skipPausing");
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

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

/**
 * Redux actions for breakpoints
 * @module actions/breakpoints
 */
function addHiddenBreakpoint(location) {
  return ({
    dispatch
  }) => {
    return dispatch((0, _modify.addBreakpoint)(location, {
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


function disableBreakpointsInSource(source) {
  return async ({
    dispatch,
    getState
  }) => {
    const breakpoints = (0, _index.getBreakpointsForSource)(getState(), source);

    for (const breakpoint of breakpoints) {
      if (!breakpoint.disabled) {
        dispatch((0, _modify.disableBreakpoint)(breakpoint));
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


function enableBreakpointsInSource(source) {
  return async ({
    dispatch,
    getState
  }) => {
    const breakpoints = (0, _index.getBreakpointsForSource)(getState(), source);

    for (const breakpoint of breakpoints) {
      if (breakpoint.disabled) {
        dispatch((0, _modify.enableBreakpoint)(breakpoint));
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


function toggleAllBreakpoints(shouldDisableBreakpoints) {
  return async ({
    dispatch,
    getState
  }) => {
    const breakpoints = (0, _index.getBreakpointsList)(getState());

    for (const breakpoint of breakpoints) {
      if (shouldDisableBreakpoints) {
        dispatch((0, _modify.disableBreakpoint)(breakpoint));
      } else {
        dispatch((0, _modify.enableBreakpoint)(breakpoint));
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


function toggleBreakpoints(shouldDisableBreakpoints, breakpoints) {
  return async ({
    dispatch
  }) => {
    const promises = breakpoints.map(breakpoint => shouldDisableBreakpoints ? dispatch((0, _modify.disableBreakpoint)(breakpoint)) : dispatch((0, _modify.enableBreakpoint)(breakpoint)));
    await Promise.all(promises);
  };
}

function toggleBreakpointsAtLine(shouldDisableBreakpoints, line) {
  return async ({
    dispatch,
    getState
  }) => {
    const breakpoints = (0, _index.getBreakpointsAtLine)(getState(), line);
    return dispatch(toggleBreakpoints(shouldDisableBreakpoints, breakpoints));
  };
}
/**
 * Removes all breakpoints
 *
 * @memberof actions/breakpoints
 * @static
 */


function removeAllBreakpoints() {
  return async ({
    dispatch,
    getState
  }) => {
    const breakpointList = (0, _index.getBreakpointsList)(getState());
    await Promise.all(breakpointList.map(bp => dispatch((0, _modify.removeBreakpoint)(bp))));
    dispatch({
      type: "CLEAR_BREAKPOINTS"
    });
  };
}
/**
 * Removes breakpoints
 *
 * @memberof actions/breakpoints
 * @static
 */


function removeBreakpoints(breakpoints) {
  return async ({
    dispatch
  }) => {
    return Promise.all(breakpoints.map(bp => dispatch((0, _modify.removeBreakpoint)(bp))));
  };
}
/**
 * Removes all breakpoints in a source
 *
 * @memberof actions/breakpoints
 * @static
 */


function removeBreakpointsInSource(source) {
  return async ({
    dispatch,
    getState
  }) => {
    const breakpoints = (0, _index.getBreakpointsForSource)(getState(), source);

    for (const breakpoint of breakpoints) {
      dispatch((0, _modify.removeBreakpoint)(breakpoint));
    }
  };
}
/**
 * Update the original location information of breakpoints.

/*
 * Update breakpoints for a source that just got pretty printed.
 * This method maps the breakpoints currently set only against the
 * non-pretty-printed (generated) source to the related pretty-printed
 * (original) source by querying the SourceMap service.
 *
 * @param {String} source - the generated source
 */


function updateBreakpointsForNewPrettyPrintedSource(source) {
  return async thunkArgs => {
    const {
      dispatch,
      getState
    } = thunkArgs;

    if (source.isOriginal) {
      console.error("Can't update breakpoints on original sources");
      return;
    }

    const breakpoints = (0, _index.getBreakpointsForSource)(getState(), source); // Remap the breakpoints with the original location information from
    // the pretty-printed source.

    const newBreakpoints = await Promise.all(breakpoints.map(async breakpoint => {
      const location = await (0, _sourceMaps.getOriginalLocation)(breakpoint.generatedLocation, thunkArgs);
      return { ...breakpoint,
        location
      };
    })); // Normally old breakpoints will be clobbered if we re-add them, but when
    // remapping we have changed the source maps and the old breakpoints will
    // have different locations than the new ones. Manually remove the
    // old breakpoints before adding the new ones.

    for (const bp of breakpoints) {
      dispatch((0, _modify.removeBreakpoint)(bp));
    }

    for (const bp of newBreakpoints) {
      await dispatch((0, _modify.addBreakpoint)(bp.location, bp.options, bp.disabled));
    }
  };
}

function toggleBreakpointAtLine(line) {
  return async ({
    dispatch,
    getState
  }) => {
    const state = getState();
    const selectedSource = (0, _index.getSelectedSource)(state);

    if (!selectedSource) {
      return null;
    }

    const bp = (0, _index.getBreakpointAtLocation)(state, {
      line,
      column: undefined
    });

    if (bp) {
      return dispatch((0, _modify.removeBreakpoint)(bp));
    } // Only if we re-enable a breakpoint, ensure re-enabling breakpoints globally


    await dispatch((0, _skipPausing.setSkipPausing)(false));
    return dispatch((0, _modify.addBreakpoint)((0, _location.createLocation)({
      source: selectedSource,
      line
    })));
  };
}

function addBreakpointAtLine(line, shouldLog = false, disabled = false) {
  return async ({
    dispatch,
    getState
  }) => {
    const state = getState();
    const source = (0, _index.getSelectedSource)(state);

    if (!source) {
      return null;
    }

    const breakpointLocation = (0, _location.createLocation)({
      source,
      column: undefined,
      line
    });
    const options = {};

    if (shouldLog) {
      options.logValue = "displayName";
    } // Ensure re-enabling breakpoints globally


    await dispatch((0, _skipPausing.setSkipPausing)(false));
    return dispatch((0, _modify.addBreakpoint)(breakpointLocation, options, disabled));
  };
}

function removeBreakpointsAtLine(source, line) {
  return ({
    dispatch,
    getState
  }) => {
    const breakpointsAtLine = (0, _index.getBreakpointsForSource)(getState(), source, line);
    return dispatch(removeBreakpoints(breakpointsAtLine));
  };
}

function disableBreakpointsAtLine(source, line) {
  return ({
    dispatch,
    getState
  }) => {
    const breakpointsAtLine = (0, _index.getBreakpointsForSource)(getState(), source, line);
    return dispatch(toggleBreakpoints(true, breakpointsAtLine));
  };
}

function enableBreakpointsAtLine(source, line) {
  return ({
    dispatch,
    getState
  }) => {
    const breakpointsAtLine = (0, _index.getBreakpointsForSource)(getState(), source, line);
    return dispatch(toggleBreakpoints(false, breakpointsAtLine));
  };
}

function toggleDisabledBreakpoint(breakpoint) {
  return ({
    dispatch
  }) => {
    if (!breakpoint.disabled) {
      return dispatch((0, _modify.disableBreakpoint)(breakpoint));
    }

    return dispatch((0, _modify.enableBreakpoint)(breakpoint));
  };
}

function enableXHRBreakpoint(index, bp) {
  return ({
    dispatch,
    getState,
    client
  }) => {
    const xhrBreakpoints = (0, _index.getXHRBreakpoints)(getState());
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
    const xhrBreakpoints = (0, _index.getXHRBreakpoints)(getState());
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
    const xhrBreakpoints = (0, _index.getXHRBreakpoints)(getState());
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
    const xhrBreakpoints = (0, _index.getXHRBreakpoints)(getState());
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
    client
  }) => {
    const breakpoint = (0, _index2.createXHRBreakpoint)(path, method);
    return dispatch({
      type: "SET_XHR_BREAKPOINT",
      breakpoint,
      [_promise.PROMISE]: client.setXHRBreakpoint(path, method)
    });
  };
}

function removeAllXHRBreakpoints() {
  return async ({
    dispatch,
    getState,
    client
  }) => {
    const xhrBreakpoints = (0, _index.getXHRBreakpoints)(getState());
    const promises = xhrBreakpoints.map(breakpoint => client.removeXHRBreakpoint(breakpoint.path, breakpoint.method));
    await dispatch({
      type: "CLEAR_XHR_BREAKPOINTS",
      [_promise.PROMISE]: Promise.all(promises)
    });
    _prefs.asyncStore.xhrBreakpoints = [];
  };
}

function removeXHRBreakpoint(index) {
  return ({
    dispatch,
    getState,
    client
  }) => {
    const xhrBreakpoints = (0, _index.getXHRBreakpoints)(getState());
    const breakpoint = xhrBreakpoints[index];
    return dispatch({
      type: "REMOVE_XHR_BREAKPOINT",
      breakpoint,
      index,
      [_promise.PROMISE]: client.removeXHRBreakpoint(breakpoint.path, breakpoint.method)
    });
  };
}