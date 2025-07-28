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
loader.lazyRequireGetter(this, "_create", "devtools/client/debugger/src/client/firefox/create");
loader.lazyRequireGetter(this, "_index", "devtools/client/debugger/src/utils/breakpoint/index");
loader.lazyRequireGetter(this, "_index2", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_breakpointPositions", "devtools/client/debugger/src/actions/breakpoints/breakpointPositions");
loader.lazyRequireGetter(this, "_skipPausing", "devtools/client/debugger/src/actions/pause/skipPausing");
loader.lazyRequireGetter(this, "_promise", "devtools/client/debugger/src/actions/utils/middleware/promise");
loader.lazyRequireGetter(this, "_telemetry", "devtools/client/debugger/src/utils/telemetry");
loader.lazyRequireGetter(this, "_location", "devtools/client/debugger/src/utils/location");
loader.lazyRequireGetter(this, "_source", "devtools/client/debugger/src/utils/source");
loader.lazyRequireGetter(this, "_mapScopes", "devtools/client/debugger/src/actions/pause/mapScopes");
loader.lazyRequireGetter(this, "_context", "devtools/client/debugger/src/utils/context");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
// This file has the primitive operations used to modify individual breakpoints
// and keep them in sync with the breakpoints installed on server threads. These
// are collected here to make it easier to preserve the following invariant:
//
// Breakpoints are included in reducer state if they are disabled or requests
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
async function clientSetBreakpoint(client, {
  getState,
  dispatch
}, breakpoint) {
  const breakpointServerLocation = (0, _index.makeBreakpointServerLocation)(getState(), breakpoint.generatedLocation);
  const shouldMapBreakpointExpressions = (0, _index2.isMapScopesEnabled)(getState()) && breakpoint.location.source.isOriginal && (breakpoint.options.logValue || breakpoint.options.condition);

  if (shouldMapBreakpointExpressions) {
    breakpoint = await dispatch(updateBreakpointSourceMapping(breakpoint));
  }

  return client.setBreakpoint(breakpointServerLocation, breakpoint.options);
}

function clientRemoveBreakpoint(client, state, generatedLocation) {
  const breakpointServerLocation = (0, _index.makeBreakpointServerLocation)(state, generatedLocation);
  return client.removeBreakpoint(breakpointServerLocation);
}

function enableBreakpoint(initialBreakpoint) {
  return thunkArgs => {
    const {
      dispatch,
      getState,
      client
    } = thunkArgs;
    const state = getState();
    const breakpoint = (0, _index2.getBreakpoint)(state, initialBreakpoint.location);
    const blackboxedRanges = (0, _index2.getBlackBoxRanges)(state);
    const isSourceOnIgnoreList = (0, _index2.isSourceMapIgnoreListEnabled)(state) && (0, _index2.isSourceOnSourceMapIgnoreList)(state, breakpoint.location.source);

    if (!breakpoint || !breakpoint.disabled || (0, _source.isLineBlackboxed)(blackboxedRanges[breakpoint.location.source.url], breakpoint.location.line, isSourceOnIgnoreList)) {
      return null;
    } // This action is used from various context menus and automatically re-enables breakpoints.


    dispatch((0, _skipPausing.setSkipPausing)(false));
    return dispatch({
      type: "SET_BREAKPOINT",
      breakpoint: (0, _create.createBreakpoint)({ ...breakpoint,
        disabled: false
      }),
      [_promise.PROMISE]: clientSetBreakpoint(client, thunkArgs, breakpoint)
    });
  };
}

function addBreakpoint(initialLocation, options = {}, disabled, shouldCancel = () => false) {
  return async thunkArgs => {
    const {
      dispatch,
      getState,
      client
    } = thunkArgs;
    (0, _telemetry.recordEvent)("add_breakpoint");
    await dispatch((0, _breakpointPositions.setBreakpointPositions)(initialLocation));
    const position = initialLocation.column ? (0, _index2.getBreakpointPositionsForLocation)(getState(), initialLocation) : (0, _index2.getFirstBreakpointPosition)(getState(), initialLocation); // No position is found if the `initialLocation` is on a non-breakable line or
    // the line no longer exists.

    if (!position) {
      return null;
    }

    const {
      location,
      generatedLocation
    } = position;

    if (!location.source || !generatedLocation.source) {
      return null;
    }

    const originalContent = (0, _index2.getSettledSourceTextContent)(getState(), location);
    const originalText = (0, _source.getTextAtPosition)(location.source.id, originalContent, location);
    const content = (0, _index2.getSettledSourceTextContent)(getState(), generatedLocation);
    const text = (0, _source.getTextAtPosition)(generatedLocation.source.id, content, generatedLocation);
    const id = (0, _index.makeBreakpointId)(location);
    const breakpoint = (0, _create.createBreakpoint)({
      id,
      disabled,
      options,
      location,
      generatedLocation,
      text,
      originalText
    });

    if (shouldCancel()) {
      return null;
    }

    return dispatch({
      type: "SET_BREAKPOINT",
      breakpoint,
      // If we just clobbered an enabled breakpoint with a disabled one, we need
      // to remove any installed breakpoint in the server.
      [_promise.PROMISE]: disabled ? clientRemoveBreakpoint(client, getState(), generatedLocation) : clientSetBreakpoint(client, thunkArgs, breakpoint)
    });
  };
}
/**
 * Remove a single breakpoint
 *
 * @memberof actions/breakpoints
 * @static
 */


function removeBreakpoint(initialBreakpoint) {
  return ({
    dispatch,
    getState,
    client
  }) => {
    (0, _telemetry.recordEvent)("remove_breakpoint");
    const breakpoint = (0, _index2.getBreakpoint)(getState(), initialBreakpoint.location);

    if (!breakpoint) {
      return null;
    }

    return dispatch({
      type: "REMOVE_BREAKPOINT",
      breakpoint,
      // If the breakpoint is disabled then it is not installed in the server.
      [_promise.PROMISE]: breakpoint.disabled ? Promise.resolve() : clientRemoveBreakpoint(client, getState(), breakpoint.generatedLocation)
    });
  };
}
/**
 * Remove all installed, pending, and client breakpoints associated with a
 * target generated location.
 *
 * @param {Object} target
 *        Location object where to remove breakpoints.
 */


function removeBreakpointAtGeneratedLocation(target) {
  return ({
    dispatch,
    getState,
    client
  }) => {
    // remove breakpoint from the server
    const onBreakpointRemoved = clientRemoveBreakpoint(client, getState(), target); // Remove any breakpoints matching the generated location.

    const breakpoints = (0, _index2.getBreakpointsList)(getState());

    for (const breakpoint of breakpoints) {
      const {
        generatedLocation
      } = breakpoint;

      if (generatedLocation.source.id == target.source.id && (0, _location.comparePosition)(generatedLocation, target)) {
        dispatch({
          type: "REMOVE_BREAKPOINT",
          breakpoint,
          [_promise.PROMISE]: onBreakpointRemoved
        });
      }
    } // Remove any remaining pending breakpoints matching the generated location.


    const pending = (0, _index2.getPendingBreakpointList)(getState());

    for (const pendingBreakpoint of pending) {
      const {
        generatedLocation
      } = pendingBreakpoint;

      if (generatedLocation.sourceUrl == target.source.url && (0, _location.comparePosition)(generatedLocation, target)) {
        dispatch({
          type: "REMOVE_PENDING_BREAKPOINT",
          pendingBreakpoint
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


function disableBreakpoint(initialBreakpoint) {
  return ({
    dispatch,
    getState,
    client
  }) => {
    const breakpoint = (0, _index2.getBreakpoint)(getState(), initialBreakpoint.location);

    if (!breakpoint || breakpoint.disabled) {
      return null;
    }

    return dispatch({
      type: "SET_BREAKPOINT",
      breakpoint: (0, _create.createBreakpoint)({ ...breakpoint,
        disabled: true
      }),
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


function setBreakpointOptions(location, options = {}) {
  return thunkArgs => {
    const {
      dispatch,
      getState,
      client
    } = thunkArgs;
    let breakpoint = (0, _index2.getBreakpoint)(getState(), location);

    if (!breakpoint) {
      return dispatch(addBreakpoint(location, options));
    } // Note: setting a breakpoint's options implicitly enables it.


    breakpoint = (0, _create.createBreakpoint)({ ...breakpoint,
      disabled: false,
      options
    });
    return dispatch({
      type: "SET_BREAKPOINT",
      breakpoint,
      [_promise.PROMISE]: clientSetBreakpoint(client, thunkArgs, breakpoint)
    });
  };
}

async function updateExpression(parserWorker, mappings, originalExpression) {
  const mapped = await parserWorker.mapExpression(originalExpression, mappings, [], false, false);

  if (!mapped) {
    return originalExpression;
  }

  if (!originalExpression.trimEnd().endsWith(";")) {
    return mapped.expression.replace(/;$/, "");
  }

  return mapped.expression;
}

function updateBreakpointSourceMapping(breakpoint) {
  return async ({
    getState,
    dispatch,
    parserWorker
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
      options.condition = await updateExpression(parserWorker, mappings, options.condition);
    }

    if (options.logValue) {
      options.logValue = await updateExpression(parserWorker, mappings, options.logValue);
    } // As we waited for lots of asynchronous operations,
    // verify that the breakpoint is still valid before
    // trying to set/update it on the server.


    (0, _context.validateBreakpoint)(getState(), breakpoint);
    return { ...breakpoint,
      options
    };
  };
}