"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.enableBreakpoint = enableBreakpoint;
exports.addBreakpoint = addBreakpoint;
exports.removeBreakpoint = removeBreakpoint;
exports.removeBreakpointAtGeneratedLocation = removeBreakpointAtGeneratedLocation;
exports.disableBreakpoint = disableBreakpoint;
exports.setBreakpointOptions = setBreakpointOptions;
loader.lazyRequireGetter(this, "_breakpoint", "devtools/client/debugger/src/utils/breakpoint/index");
loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_breakpointPositions", "devtools/client/debugger/src/actions/breakpoints/breakpointPositions");
loader.lazyRequireGetter(this, "_skipPausing", "devtools/client/debugger/src/actions/pause/skipPausing");
loader.lazyRequireGetter(this, "_promise", "devtools/client/debugger/src/actions/utils/middleware/promise");
loader.lazyRequireGetter(this, "_telemetry", "devtools/client/debugger/src/utils/telemetry");
loader.lazyRequireGetter(this, "_location", "devtools/client/debugger/src/utils/location");
loader.lazyRequireGetter(this, "_source", "devtools/client/debugger/src/utils/source");
loader.lazyRequireGetter(this, "_mapScopes", "devtools/client/debugger/src/actions/pause/mapScopes");
loader.lazyRequireGetter(this, "_sourceMaps", "devtools/client/debugger/src/utils/source-maps");
loader.lazyRequireGetter(this, "_context", "devtools/client/debugger/src/utils/context");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
// This file has the primitive operations used to modify individual breakpoints
// and keep them in sync with the breakpoints installed on server threads. These
// are collected here to make it easier to preserve the following invariant:
//
// Breakpoints are included in reducer state iff they are disabled or requests
// have been dispatched to set them in all server threads.
//
// To maintain this property, updates to the reducer and installed breakpoints
// must happen with no intervening await. Using await allows other operations to
// modify the breakpoint state in the interim and potentially cause breakpoint
// state to go out of sync.
//
// The reducer is optimistically updated when users set or remove a breakpoint,
// but it might take a little while before the breakpoints have been set or
// removed in each thread. Once all outstanding requests sent to a thread have
// been processed, the reducer and server threads will be in sync.
//
// There is another exception to the above invariant when first connecting to
// the server: breakpoints have been installed on all generated locations in the
// pending breakpoints, but no breakpoints have been added to the reducer. When
// a matching source appears, either the server breakpoint will be removed or a
// breakpoint will be added to the reducer, to restore the above invariant.
// See syncBreakpoint.js for more.
async function clientSetBreakpoint(client, cx, {
  getState,
  dispatch
}, breakpoint) {
  var _breakpoint$location;

  const breakpointLocation = (0, _breakpoint.makeBreakpointLocation)(getState(), breakpoint.generatedLocation);
  const shouldMapBreakpointExpressions = (0, _selectors.isMapScopesEnabled)(getState()) && (0, _sourceMaps.isOriginalSource)((0, _selectors.getSource)(getState(), (_breakpoint$location = breakpoint.location) === null || _breakpoint$location === void 0 ? void 0 : _breakpoint$location.sourceId)) && (breakpoint.options.logValue || breakpoint.options.condition);

  if (shouldMapBreakpointExpressions) {
    breakpoint = await dispatch(updateBreakpointSourceMapping(cx, breakpoint));
  }

  return client.setBreakpoint(breakpointLocation, breakpoint.options);
}

function clientRemoveBreakpoint(client, state, generatedLocation) {
  const breakpointLocation = (0, _breakpoint.makeBreakpointLocation)(state, generatedLocation);
  return client.removeBreakpoint(breakpointLocation);
}

function enableBreakpoint(cx, initialBreakpoint) {
  return thunkArgs => {
    const {
      dispatch,
      getState,
      client
    } = thunkArgs;
    const breakpoint = (0, _selectors.getBreakpoint)(getState(), initialBreakpoint.location);

    if (!breakpoint || !breakpoint.disabled) {
      return;
    }

    dispatch((0, _skipPausing.setSkipPausing)(false));
    return dispatch({
      type: "SET_BREAKPOINT",
      cx,
      breakpoint: { ...breakpoint,
        disabled: false
      },
      [_promise.PROMISE]: clientSetBreakpoint(client, cx, thunkArgs, breakpoint)
    });
  };
}

function addBreakpoint(cx, initialLocation, options = {}, disabled = false, shouldCancel = () => false) {
  return async thunkArgs => {
    const {
      dispatch,
      getState,
      client
    } = thunkArgs;
    (0, _telemetry.recordEvent)("add_breakpoint");
    const {
      sourceId,
      column,
      line
    } = initialLocation;
    await dispatch((0, _breakpointPositions.setBreakpointPositions)({
      cx,
      sourceId,
      line
    }));
    const position = column ? (0, _selectors.getBreakpointPositionsForLocation)(getState(), initialLocation) : (0, _selectors.getFirstBreakpointPosition)(getState(), initialLocation);

    if (!position) {
      return;
    }

    const {
      location,
      generatedLocation
    } = position;
    const source = (0, _selectors.getSource)(getState(), location.sourceId);
    const generatedSource = (0, _selectors.getSource)(getState(), generatedLocation.sourceId);

    if (!source || !generatedSource) {
      return;
    }

    const symbols = (0, _selectors.getSymbols)(getState(), source);
    const astLocation = (0, _breakpoint.getASTLocation)(source, symbols, location);
    const originalContent = (0, _selectors.getSourceContent)(getState(), source.id);
    const originalText = (0, _source.getTextAtPosition)(source.id, originalContent, location);
    const content = (0, _selectors.getSourceContent)(getState(), generatedSource.id);
    const text = (0, _source.getTextAtPosition)(generatedSource.id, content, generatedLocation);
    const id = (0, _breakpoint.makeBreakpointId)(location);
    const breakpoint = {
      id,
      disabled,
      options,
      location,
      astLocation,
      generatedLocation,
      text,
      originalText
    };

    if (shouldCancel()) {
      return;
    }

    dispatch((0, _skipPausing.setSkipPausing)(false));
    return dispatch({
      type: "SET_BREAKPOINT",
      cx,
      breakpoint,
      // If we just clobbered an enabled breakpoint with a disabled one, we need
      // to remove any installed breakpoint in the server.
      [_promise.PROMISE]: disabled ? clientRemoveBreakpoint(client, getState(), generatedLocation) : clientSetBreakpoint(client, cx, thunkArgs, breakpoint)
    });
  };
}
/**
 * Remove a single breakpoint
 *
 * @memberof actions/breakpoints
 * @static
 */


function removeBreakpoint(cx, initialBreakpoint) {
  return ({
    dispatch,
    getState,
    client
  }) => {
    (0, _telemetry.recordEvent)("remove_breakpoint");
    const breakpoint = (0, _selectors.getBreakpoint)(getState(), initialBreakpoint.location);

    if (!breakpoint) {
      return;
    }

    dispatch((0, _skipPausing.setSkipPausing)(false));
    return dispatch({
      type: "REMOVE_BREAKPOINT",
      cx,
      location: breakpoint.location,
      // If the breakpoint is disabled then it is not installed in the server.
      [_promise.PROMISE]: breakpoint.disabled ? Promise.resolve() : clientRemoveBreakpoint(client, getState(), breakpoint.generatedLocation)
    });
  };
}
/**
 * Remove all installed, pending, and client breakpoints associated with a
 * target generated location.
 *
 * @memberof actions/breakpoints
 * @static
 */


function removeBreakpointAtGeneratedLocation(cx, target) {
  return ({
    dispatch,
    getState,
    client
  }) => {
    // remove breakpoint from the server
    const onBreakpointRemoved = clientRemoveBreakpoint(client, getState(), target); // Remove any breakpoints matching the generated location.

    const breakpoints = (0, _selectors.getBreakpointsList)(getState());

    for (const {
      location,
      generatedLocation
    } of breakpoints) {
      if (generatedLocation.sourceId == target.sourceId && (0, _location.comparePosition)(generatedLocation, target)) {
        dispatch({
          type: "REMOVE_BREAKPOINT",
          cx,
          location,
          [_promise.PROMISE]: onBreakpointRemoved
        });
      }
    } // Remove any remaining pending breakpoints matching the generated location.


    const pending = (0, _selectors.getPendingBreakpointList)(getState());

    for (const {
      location,
      generatedLocation
    } of pending) {
      if (generatedLocation.sourceUrl == target.sourceUrl && (0, _location.comparePosition)(generatedLocation, target)) {
        dispatch({
          type: "REMOVE_PENDING_BREAKPOINT",
          cx,
          location
        });
      }
    }

    return onBreakpointRemoved;
  };
}
/**
 * Disable a single breakpoint
 *
 * @memberof actions/breakpoints
 * @static
 */


function disableBreakpoint(cx, initialBreakpoint) {
  return ({
    dispatch,
    getState,
    client
  }) => {
    const breakpoint = (0, _selectors.getBreakpoint)(getState(), initialBreakpoint.location);

    if (!breakpoint || breakpoint.disabled) {
      return;
    }

    dispatch((0, _skipPausing.setSkipPausing)(false));
    return dispatch({
      type: "SET_BREAKPOINT",
      cx,
      breakpoint: { ...breakpoint,
        disabled: true
      },
      [_promise.PROMISE]: clientRemoveBreakpoint(client, getState(), breakpoint.generatedLocation)
    });
  };
}
/**
 * Update the options of a breakpoint.
 *
 * @throws {Error} "not implemented"
 * @memberof actions/breakpoints
 * @static
 * @param {SourceLocation} location
 *        @see DebuggerController.Breakpoints.addBreakpoint
 * @param {Object} options
 *        Any options to set on the breakpoint
 */


function setBreakpointOptions(cx, location, options = {}) {
  return thunkArgs => {
    const {
      dispatch,
      getState,
      client
    } = thunkArgs;
    let breakpoint = (0, _selectors.getBreakpoint)(getState(), location);

    if (!breakpoint) {
      return dispatch(addBreakpoint(cx, location, options));
    } // Note: setting a breakpoint's options implicitly enables it.


    breakpoint = { ...breakpoint,
      disabled: false,
      options
    };
    return dispatch({
      type: "SET_BREAKPOINT",
      cx,
      breakpoint,
      [_promise.PROMISE]: clientSetBreakpoint(client, cx, thunkArgs, breakpoint)
    });
  };
}

async function updateExpression(evaluationsParser, mappings, originalExpression) {
  const mapped = await evaluationsParser.mapExpression(originalExpression, mappings, [], false, false);

  if (!mapped) {
    return originalExpression;
  }

  if (!originalExpression.trimEnd().endsWith(";")) {
    return mapped.expression.replace(/;$/, "");
  }

  return mapped.expression;
}

function updateBreakpointSourceMapping(cx, breakpoint) {
  return async ({
    getState,
    dispatch,
    evaluationsParser
  }) => {
    const options = { ...breakpoint.options
    };
    const mappedScopes = await dispatch((0, _mapScopes.getMappedScopesForLocation)(breakpoint.location));

    if (!mappedScopes) {
      return breakpoint;
    }

    const {
      mappings
    } = mappedScopes;

    if (options.condition) {
      options.condition = await updateExpression(evaluationsParser, mappings, options.condition);
    }

    if (options.logValue) {
      options.logValue = await updateExpression(evaluationsParser, mappings, options.logValue);
    }

    (0, _context.validateNavigateContext)(getState(), cx);
    return { ...breakpoint,
      options
    };
  };
}