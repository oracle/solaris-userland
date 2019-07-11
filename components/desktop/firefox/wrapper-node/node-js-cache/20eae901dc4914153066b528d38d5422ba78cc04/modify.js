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

var _breakpoint = require("../../utils/breakpoint/index");

var _selectors = require("../../selectors/index");

var _breakpointPositions = require("./breakpointPositions");

var _telemetry = require("../../utils/telemetry");

var _location = require("../../utils/location");

var _source = require("../../utils/source");

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

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

function clientSetBreakpoint(breakpoint) {
  return ({ getState, client }) => {
    const breakpointLocation = (0, _breakpoint.makeBreakpointLocation)(getState(), breakpoint.generatedLocation);
    return client.setBreakpoint(breakpointLocation, breakpoint.options);
  };
}

function clientRemoveBreakpoint(generatedLocation) {
  return ({ getState, client }) => {
    const breakpointLocation = (0, _breakpoint.makeBreakpointLocation)(getState(), generatedLocation);
    return client.removeBreakpoint(breakpointLocation);
  };
}

function enableBreakpoint(cx, initialBreakpoint) {
  return async ({ dispatch, getState, client, sourceMaps }) => {
    const breakpoint = (0, _selectors.getBreakpoint)(getState(), initialBreakpoint.location);
    if (!breakpoint || !breakpoint.disabled) {
      return;
    }

    dispatch({
      type: "SET_BREAKPOINT",
      cx,
      breakpoint: { ...breakpoint, disabled: false }
    });

    return dispatch(clientSetBreakpoint(breakpoint));
  };
}

function addBreakpoint(cx, initialLocation, options = {}, disabled = false, shouldCancel = () => false) {
  return async ({ dispatch, getState, sourceMaps, client }) => {
    (0, _telemetry.recordEvent)("add_breakpoint");

    const { sourceId, column, line } = initialLocation;

    await dispatch((0, _breakpointPositions.setBreakpointPositions)({ cx, sourceId, line }));

    const position = column ? (0, _selectors.getBreakpointPositionsForLocation)(getState(), initialLocation) : (0, _selectors.getFirstBreakpointPosition)(getState(), initialLocation);

    if (!position) {
      return;
    }

    const { location, generatedLocation } = position;

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

    dispatch({ type: "SET_BREAKPOINT", cx, breakpoint });

    if (disabled) {
      // If we just clobbered an enabled breakpoint with a disabled one, we need
      // to remove any installed breakpoint in the server.
      return dispatch(clientRemoveBreakpoint(generatedLocation));
    }

    return dispatch(clientSetBreakpoint(breakpoint));
  };
}

/**
 * Remove a single breakpoint
 *
 * @memberof actions/breakpoints
 * @static
 */
function removeBreakpoint(cx, initialBreakpoint) {
  return ({ dispatch, getState, client }) => {
    (0, _telemetry.recordEvent)("remove_breakpoint");

    const breakpoint = (0, _selectors.getBreakpoint)(getState(), initialBreakpoint.location);
    if (!breakpoint) {
      return;
    }

    dispatch({
      type: "REMOVE_BREAKPOINT",
      cx,
      location: breakpoint.location
    });

    // If the breakpoint is disabled then it is not installed in the server.
    if (breakpoint.disabled) {
      return;
    }

    return dispatch(clientRemoveBreakpoint(breakpoint.generatedLocation));
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
  return ({ dispatch, getState, client }) => {
    // Remove any breakpoints matching the generated location.
    const breakpoints = (0, _selectors.getBreakpointsList)(getState());
    for (const { location, generatedLocation } of breakpoints) {
      if (generatedLocation.sourceId == target.sourceId && (0, _location.comparePosition)(generatedLocation, target)) {
        dispatch({
          type: "REMOVE_BREAKPOINT",
          cx,
          location
        });
      }
    }

    // Remove any remaining pending breakpoints matching the generated location.
    const pending = (0, _selectors.getPendingBreakpointList)(getState());
    for (const { location, generatedLocation } of pending) {
      if (generatedLocation.sourceUrl == target.sourceUrl && (0, _location.comparePosition)(generatedLocation, target)) {
        dispatch({
          type: "REMOVE_PENDING_BREAKPOINT",
          cx,
          location
        });
      }
    }

    // Remove the breakpoint from the client itself.
    return dispatch(clientRemoveBreakpoint(target));
  };
}

/**
 * Disable a single breakpoint
 *
 * @memberof actions/breakpoints
 * @static
 */
function disableBreakpoint(cx, initialBreakpoint) {
  return ({ dispatch, getState, client }) => {
    const breakpoint = (0, _selectors.getBreakpoint)(getState(), initialBreakpoint.location);
    if (!breakpoint || breakpoint.disabled) {
      return;
    }

    dispatch({
      type: "SET_BREAKPOINT",
      cx,
      breakpoint: { ...breakpoint, disabled: true }
    });

    return dispatch(clientRemoveBreakpoint(breakpoint.generatedLocation));
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
  return ({ dispatch, getState, client, sourceMaps }) => {
    let breakpoint = (0, _selectors.getBreakpoint)(getState(), location);
    if (!breakpoint) {
      return dispatch(addBreakpoint(cx, location, options));
    }

    // Note: setting a breakpoint's options implicitly enables it.
    breakpoint = { ...breakpoint, disabled: false, options };

    dispatch({
      type: "SET_BREAKPOINT",
      cx,
      breakpoint
    });

    return dispatch(clientSetBreakpoint(breakpoint));
  };
}