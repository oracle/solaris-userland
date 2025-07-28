"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tracingToggled = tracingToggled;
exports.clearTracerData = clearTracerData;
exports.addTraces = addTraces;
exports.selectTrace = selectTrace;
exports.setLocalAndRemoteRuntimeVersion = setLocalAndRemoteRuntimeVersion;
exports.searchTraceArguments = searchTraceArguments;
loader.lazyRequireGetter(this, "_index", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_tracerFrames", "devtools/client/debugger/src/reducers/tracer-frames");
loader.lazyRequireGetter(this, "_location", "devtools/client/debugger/src/utils/location");
loader.lazyRequireGetter(this, "_sourceMaps", "devtools/client/debugger/src/utils/source-maps");
loader.lazyRequireGetter(this, "_select", "devtools/client/debugger/src/actions/sources/select.js");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
const {
  TRACER_FIELDS_INDEXES
} = require("resource://devtools/server/actors/tracer.js");
/**
 * Called when tracing is toggled ON/OFF on a particular thread.
 */


function tracingToggled(thread, enabled, traceValues) {
  return {
    type: "TRACING_TOGGLED",
    thread,
    enabled,
    traceValues
  };
}

function clearTracerData() {
  return {
    type: "TRACING_CLEAR"
  };
}

function addTraces(traces) {
  return async function ({
    dispatch,
    getState
  }) {
    if (!(0, _index.getIsCurrentlyTracing)(getState())) {
      return null;
    }

    return dispatch({
      type: "ADD_TRACES",
      traces
    });
  };
}

function selectTrace(traceIndex) {
  return async function (thunkArgs) {
    const {
      dispatch,
      getState
    } = thunkArgs;
    const traces = (0, _index.getAllTraces)(getState());
    const trace = traces[traceIndex];

    if (!trace) {
      return;
    } // Ignore DOM Event traces, which aren't related to a particular location in source.


    let location = null;

    if (trace[TRACER_FIELDS_INDEXES.TYPE] != "event") {
      const frameIndex = trace[TRACER_FIELDS_INDEXES.FRAME_INDEX];
      const frames = (0, _index.getTraceFrames)(getState());
      const frame = frames[frameIndex];
      const source = (0, _index.getSourceByActorId)(getState(), frame.sourceId);
      location = (0, _location.createLocation)({
        source,
        line: frame.line,
        column: frame.column
      });
      location = await (0, _sourceMaps.getOriginalLocation)(location, thunkArgs);
    } // For now, the tracer only consider the top level thread


    const thread = (0, _index.getCurrentThread)(getState());
    dispatch({
      type: "SELECT_TRACE",
      traceIndex,
      location,
      thread
    });

    if (location) {
      // We disable the yellow flashing highlighting as the currently selected traced line
      // will have a permanent highlight.
      await dispatch((0, _select.selectLocation)(location, {
        highlight: false
      }));
    }
  };
}

function setLocalAndRemoteRuntimeVersion(localPlatformVersion, remotePlatformVersion) {
  return {
    type: "SET_RUNTIME_VERSIONS",
    localPlatformVersion,
    remotePlatformVersion
  };
} // Calls to the searchTraceArguments can either be synchronous (for primitives)
// or async (for everything else).
// This means that an old call can resolve after a more recent one and override
// the UI.


let currentSearchSymbol;

function searchTraceArguments(searchString) {
  return async function ({
    dispatch,
    client,
    panel
  }) {
    // Ignore any starting and ending spaces in the query string
    searchString = searchString.trim();
    const searchSymbol = Symbol("CURRENT_SEARCH_SYMBOL");
    currentSearchSymbol = searchSymbol; // Reset back to no search if the query is empty

    if (!searchString) {
      dispatch({
        type: "SET_TRACE_SEARCH_STRING",
        searchValueOrGrip: _tracerFrames.NO_SEARCH_VALUE
      });
      return;
    } // `JSON.parse("undefined")` throws, but we still want to support searching for this special value
    // without having to evaluate to the server


    if (searchString === "undefined") {
      dispatch({
        type: "SET_TRACE_SEARCH_STRING",
        searchValueOrGrip: undefined
      });
      return;
    } // First check on the frontend if that's a primitive,
    // in which case, we can compute the value without evaling in the server.


    try {
      const value = JSON.parse(searchString); // Ignore any object value, as we won't have any match anyway.
      // We can only search for existing page objects.

      if (typeof value == "object" && value !== null) {
        dispatch({
          type: "SET_TRACE_SEARCH_EXCEPTION",
          errorMessage: "Invalid search. Can only search for existing page JS objects"
        });
        return;
      }

      dispatch({
        type: "SET_TRACE_SEARCH_STRING",
        searchValueOrGrip: value
      });
      return;
    } catch (e) {} // If the inspector is opened, and a node is currently selected,
    // try to fetch its actor ID in order to make '$0' to work in evaluations


    const inspector = panel.toolbox.getPanel("inspector");
    const selectedNodeActor = inspector?.selection?.nodeFront?.actorID;
    let {
      result,
      exception
    } = await client.evaluate(`(${searchString})`, {
      selectedNodeActor,
      evalInTracer: true
    });

    if (currentSearchSymbol != searchSymbol) {
      // Stop handling this evaluation result if the action was called more
      // recently.
      return;
    }

    if (result.type == "null") {
      result = null;
    } else if (result.type == "undefined") {
      result = undefined;
    }

    if (exception) {
      const {
        preview
      } = exception.getGrip();
      const errorMessage = `${preview.name}: ${preview.message}`;
      dispatch({
        type: "SET_TRACE_SEARCH_EXCEPTION",
        errorMessage
      });
    } else {
      // If we refered to an object, the `result` will be an ObjectActorFront
      // for which we retrieve its current "form" (a.k.a. grip).
      // Otherwise `result` will be a primitive JS value (boolean, number, string,...)
      const searchValueOrGrip = result && result.getGrip ? result.getGrip() : result;
      dispatch({
        type: "SET_TRACE_SEARCH_STRING",
        searchValueOrGrip
      });
    }
  };
}