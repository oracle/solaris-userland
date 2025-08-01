"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.NO_SEARCH_VALUE = void 0;

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
const {
  TRACER_FIELDS_INDEXES
} = require("resource://devtools/server/actors/tracer.js");

const lazy = {};
ChromeUtils.defineESModuleGetters(lazy, {
  BinarySearch: "resource://gre/modules/BinarySearch.sys.mjs"
});
const NO_SEARCH_VALUE = Symbol("no-search-value");
exports.NO_SEARCH_VALUE = NO_SEARCH_VALUE;

function initialState(previousState = {
  searchValueOrGrip: NO_SEARCH_VALUE
}) {
  return {
    // These fields are mutable as they are large arrays and UI will rerender based on their size
    // The three next array are always of the same size.
    // List of all trace resources, as defined by the server codebase (See the TracerActor)
    mutableTraces: [],
    // Array of arrays. This is of the same size as mutableTraces.
    // Store the indexes within mutableTraces of each children matching the same index in mutableTraces.
    mutableChildren: [],
    // Indexes of parents within mutableTraces.
    mutableParents: [],
    // Frames are also a trace resources, but they are stored in a dedicated array.
    mutableFrames: [],
    // List of indexes within mutableTraces of top level trace, without any parent.
    mutableTopTraces: [],
    // Similar to mutableTopTraces except that filter out unwanted DOM Events.
    mutableFilteredTopTraces: [],
    // List of all trace resources indexes within mutableTraces which are about dom mutations
    mutableMutationTraces: [],
    // List of all traces matching the current search string
    // (this isn't only top traces)
    mutableMatchingTraces: [],
    // If the user started searching for some value, it may be an invalid expression
    // and the error related to this will be stored as a string in this attribute.
    searchExceptionMessage: null,
    // If a valid search has been requested, the actual value for this search is stored in this attribute.
    // It can be either a primitive data type, or an object actor form (aka grip)
    searchValueOrGrip: previousState.searchValueOrGrip,
    // List of all event names which triggered some JavaScript code in the current tracer record.
    mutableEventNames: new Set(),
    // List of all possible DOM Events (similar to DOM Event panel)
    // This is initialized once on debugger startup.
    // This is a Map of category objects consumed by EventListeners React component,
    // keyed by DOM Event name (string) communicated by the Tracer.
    // DOM Event name can look like this:
    // - global.click (click fired on window object)
    // - node.mousemove (mousemove fired on a DOM Element)
    // - xhr.error (error on an XMLHttpRequest object)
    // - worker.error (error from a worker)
    // - setTimeout (setTimeout function being called)
    // - setTimeoutCallback (setTimeout callback being fired)
    domEventInfoByTracerName: previousState.domEventInfoByTracerName || new Map(),
    // List of DOM Events "categories" currently available in the current traces
    // Categories are objects consumed by the EventListener React component.
    domEventCategories: [],
    // List of DOM Events which should be show and be in `mutableFilteredTopTraces`
    activeDomEvents: [],
    // List of DOM Events names to be highlighted in the left timeline
    highlightedDomEvents: [],
    // Index of the currently selected trace within `mutableTraces`.
    selectedTraceIndex: null,
    // Updated alongside `selectedTraceIndex`, refer to the location of the selected trace.
    selectedTraceLocation: null,
    // Object like the one generated by `generateInlinePreview`, but for the currently selected trace
    previews: null,
    // Runtime versions to help show warning when there is a mismatch between frontend and backend versions
    localPlatformVersion: null,
    remotePlatformVersion: null,
    // Is it currently recording trace *and* is collecting values
    traceValues: false
  };
} // eslint-disable-next-line complexity


function update(state = initialState(), action) {
  switch (action.type) {
    case "SET_TRACE_SEARCH_EXCEPTION":
      {
        return { ...state,
          searchExceptionMessage: action.errorMessage,
          searchValueOrGrip: NO_SEARCH_VALUE,
          mutableMatchingTraces: []
        };
      }

    case "SET_TRACE_SEARCH_STRING":
      {
        const {
          searchValueOrGrip
        } = action;

        if (searchValueOrGrip === NO_SEARCH_VALUE) {
          return { ...state,
            searchValueOrGrip,
            searchExceptionMessage: null,
            mutableMatchingTraces: []
          };
        }

        const mutableMatchingTraces = [];

        for (const trace of state.mutableTraces) {
          const type = trace[TRACER_FIELDS_INDEXES.TYPE];

          if (type != "enter") {
            continue;
          }

          if (isTraceMatchingSearch(trace, searchValueOrGrip)) {
            mutableMatchingTraces.push(trace);
          }
        }

        return { ...state,
          searchValueOrGrip,
          mutableMatchingTraces,
          searchExceptionMessage: null
        };
      }

    case "TRACING_TOGGLED":
      {
        if (action.enabled) {
          state = initialState(state);

          if (action.traceValues) {
            state.traceValues = true;
          } else {
            state.searchValueOrGrip = NO_SEARCH_VALUE;
          }

          return state;
        }

        return state;
      }

    case "TRACING_CLEAR":
      {
        return initialState(state);
      }

    case "ADD_TRACES":
      {
        addTraces(state, action.traces);
        return { ...state
        };
      }

    case "SELECT_TRACE":
      {
        const {
          traceIndex,
          location
        } = action;

        if (traceIndex < 0 || traceIndex >= state.mutableTraces.length || traceIndex == state.selectedTraceIndex) {
          return state;
        }

        const trace = state.mutableTraces[traceIndex];
        return { ...state,
          selectedTraceIndex: traceIndex,
          selectedTraceLocation: location,
          // Also compute the inline preview data when we select a trace
          // and we have the values recording enabled.
          previews: generatePreviewsForTrace(state, trace)
        };
      }

    case "SELECT_FRAME":
    case "PAUSED":
      {
        if (!state.previews && state.selectedTraceIndex == null) {
          return state;
        } // Reset the selected trace and previews when we pause/step/select a frame in the scope panel,
        // so that it is no longer highlighted, nor do we show inline variables.


        return { ...state,
          selectedTraceIndex: null,
          selectedTraceLocation: null,
          previews: null
        };
      }

    case "SET_SELECTED_LOCATION":
      {
        // Traces are reference to the generated location only, so ignore any original source being selected
        // and wait for SET_GENERATED_SELECTED_LOCATION instead.
        if (action.location.source.isOriginal) {
          return state;
        } // Ignore if the currently selected trace matches the new location.


        if (state.selectedTrace && locationMatchTrace(action.location, state.selectedTrace)) {
          return state;
        } // Lookup for a trace matching the newly selected location


        for (const trace of state.mutableTraces) {
          if (locationMatchTrace(action.location, trace)) {
            return { ...state,
              selectedTrace: trace
            };
          }
        }

        return { ...state,
          selectedTrace: null
        };
      }

    case "SET_GENERATED_SELECTED_LOCATION":
      {
        // When selecting an original location, we have to wait for the newly selected original location
        // to be mapped to a generated location so that we can find a matching trace.
        // Ignore if the currently selected trace matches the new location.
        if (state.selectedTrace && locationMatchTrace(action.generatedLocation, state.selectedTrace)) {
          return state;
        } // Lookup for a trace matching the newly selected location


        for (const trace of state.mutableTraces) {
          if (locationMatchTrace(action.generatedLocation, trace)) {
            return { ...state,
              selectedTrace: trace
            };
          }
        }

        return { ...state,
          selectedTrace: null
        };
      }

    case "CLEAR_SELECTED_LOCATION":
      {
        return { ...state,
          selectedTrace: null
        };
      }

    case "SET_RUNTIME_VERSIONS":
      {
        return { ...state,
          localPlatformVersion: action.localPlatformVersion,
          remotePlatformVersion: action.remotePlatformVersion
        };
      }

    case "RECEIVE_EVENT_LISTENER_TYPES":
      {
        const domEventInfoByTracerName = new Map();

        for (const category of action.categories) {
          for (const event of category.events) {
            const value = {
              id: event.id,
              category,
              name: event.name
            };

            if (event.type == "event") {
              for (const targetType of event.targetTypes) {
                domEventInfoByTracerName.set(`${targetType}.${event.eventType}`, value);
              }
            } else {
              domEventInfoByTracerName.set(event.notificationType, value);
            }
          }
        }

        return { ...state,
          domEventInfoByTracerName
        };
      }

    case "UPDATE_EVENT_LISTENERS":
      {
        // This action is also used for the DOM Event breakpoints panel
        if (action.panelKey != "tracer") {
          return state;
        }

        const {
          mutableTraces,
          mutableTopTraces
        } = state; // If all the DOM events are shown, return the unfiltered list as-is.

        if (action.active.length == state.mutableEventNames.size) {
          return { ...state,
            mutableFilteredTopTraces: mutableTopTraces,
            activeDomEvents: action.active
          };
        } // Update `mutableFilteredTopTraces` by re-filtering all top traces from `mutableTopTraces`
        // and considering the new list of DOM event names


        const mutableFilteredTopTraces = [];

        for (const traceIndex of mutableTopTraces) {
          const trace = mutableTraces[traceIndex];
          const type = trace[TRACER_FIELDS_INDEXES.TYPE];

          if (type == "event") {
            const eventName = trace[TRACER_FIELDS_INDEXES.EVENT_NAME]; // Map JS Tracer event name into an Event Breakpoint's ID, as `action.active` is an array of such IDs.
            // (from "node.click" to "event.mouse.click")

            const id = state.domEventInfoByTracerName.get(eventName)?.id || `event.unclassified.${eventName}`;

            if (action.active.includes(id)) {
              mutableFilteredTopTraces.push(traceIndex);
            }
          }
        }

        return { ...state,
          mutableFilteredTopTraces,
          activeDomEvents: action.active
        };
      }

    case "HIGHLIGHT_EVENT_LISTENERS":
      {
        // This action is also used for the DOM Event breakpoints panel
        if (action.panelKey != "tracer") {
          return state;
        } // Map ids (event.mouse.click) to event names (node.click)


        const eventNames = [];

        for (const [eventName, {
          id
        }] of state.domEventInfoByTracerName.entries()) {
          if (action.eventIds.includes(id)) {
            eventNames.push(eventName);
          }
        }

        return { ...state,
          highlightedDomEvents: eventNames
        };
      }
  }

  return state;
}

function addTraces(state, traces) {
  const {
    mutableTraces,
    mutableMutationTraces,
    mutableFrames,
    mutableTopTraces,
    mutableFilteredTopTraces,
    mutableChildren,
    mutableParents,
    mutableMatchingTraces,
    searchValueOrGrip
  } = state;

  function matchParent(traceIndex, depth) {
    // The very last element is the one matching traceIndex,
    // so pick the one added just before.
    // We consider that traces are reported by the server in the execution order.
    let idx = mutableTraces.length - 2;

    while (idx != null) {
      const trace = mutableTraces[idx];

      if (!trace) {
        break;
      }

      const currentDepth = trace[TRACER_FIELDS_INDEXES.DEPTH];

      if (currentDepth < depth) {
        mutableChildren[idx].push(traceIndex);
        mutableParents.push(idx);
        return;
      }

      idx = mutableParents[idx];
    } // If no parent was found, flag it as top level trace


    mutableTopTraces.push(traceIndex);
    mutableFilteredTopTraces.push(traceIndex);
    mutableParents.push(null);
  }

  for (const traceResource of traces) {
    // For now, only consider traces from the top level target/thread
    if (!traceResource.targetFront.isTopLevel) {
      continue;
    }

    const type = traceResource[TRACER_FIELDS_INDEXES.TYPE];

    switch (type) {
      case "frame":
        {
          // Store the object used by SmartTraces
          mutableFrames.push({
            functionDisplayName: traceResource[TRACER_FIELDS_INDEXES.FRAME_NAME],
            source: traceResource[TRACER_FIELDS_INDEXES.FRAME_URL],
            sourceId: traceResource[TRACER_FIELDS_INDEXES.FRAME_SOURCEID],
            line: traceResource[TRACER_FIELDS_INDEXES.FRAME_LINE],
            column: traceResource[TRACER_FIELDS_INDEXES.FRAME_COLUMN]
          });
          break;
        }

      case "enter":
        {
          const traceIndex = mutableTraces.length;
          mutableTraces.push(traceResource);
          mutableChildren.push([]);
          const depth = traceResource[TRACER_FIELDS_INDEXES.DEPTH];
          matchParent(traceIndex, depth);

          if (searchValueOrGrip != NO_SEARCH_VALUE && isTraceMatchingSearch(traceResource, searchValueOrGrip)) {
            mutableMatchingTraces.push(traceResource);
          }

          break;
        }

      case "exit":
        {
          // The sidebar doesn't use this information yet
          break;
        }

      case "dom-mutation":
        {
          const traceIndex = mutableTraces.length;
          mutableTraces.push(traceResource);
          mutableChildren.push([]);
          mutableMutationTraces.push(traceIndex);
          const depth = traceResource[TRACER_FIELDS_INDEXES.DEPTH];
          matchParent(traceIndex, depth);
          break;
        }

      case "event":
        {
          const traceIndex = mutableTraces.length;
          mutableTraces.push(traceResource);
          mutableChildren.push([]);
          mutableParents.push(null);
          mutableTopTraces.push(traceIndex);
          const eventName = traceResource[TRACER_FIELDS_INDEXES.EVENT_NAME];
          registerDOMEvent(state, eventName); // Map JS Tracer event name into an Event Breakpoint's ID, as `action.active` is an array of such IDs.
          // (from "node.click" to "event.mouse.click")

          const id = state.domEventInfoByTracerName.get(eventName)?.id || `event.unclassified.${eventName}`; // Only register in the filtered list, if this event type isn't filtered out.
          // (do this after `registerDOMEvent`, as that will populate `activeDomEvents` array.

          if (state.activeDomEvents.includes(id)) {
            mutableFilteredTopTraces.push(traceIndex);
          }

          break;
        }
    }
  }
} // EventListener's category for all events that are not breakable, and not returned by the thread actor, and not in `domEventInfoByTracerName`.


const UNCLASSIFIED_CATEGORY = {
  id: "unclassified",
  name: "Unclassified"
};
/**
 * Register this possibly new event type in data set used to display EventListener React component.
 *
 * @param {Object} state
 * @param {String} eventName
 */

function registerDOMEvent(state, eventName) {
  if (state.mutableEventNames.has(eventName)) {
    return;
  }

  state.mutableEventNames.add(eventName); // `domEventInfoByTracerName` is defined by the server and only register the events
  // for which we can set breakpoints for.
  // Fallback to a "unclassified" category for all these missing event types.

  const {
    category,
    id,
    name
  } = state.domEventInfoByTracerName.get(eventName) || {
    category: UNCLASSIFIED_CATEGORY,
    id: `event.unclassified.${eventName}`,
    name: eventName
  }; // By default, when we get a new event type, it is made visible

  if (!state.activeDomEvents.includes(id)) {
    state.activeDomEvents.push(id);
  }

  let newCategory = state.domEventCategories.find(cat => cat.name == category.name);

  if (!newCategory) {
    // Create a new category with an empty event list
    newCategory = {
      id: category.id,
      name: category.name,
      events: []
    };
    state.domEventCategories = [...state.domEventCategories];
    addSortedCategoryOrEvent(state.domEventCategories, newCategory);
  }

  if (!newCategory.events.some(e => e.name == name)) {
    // Register this new event in the category's event list
    addSortedCategoryOrEvent(newCategory.events, {
      id,
      name
    }); // Clone the root object to force a re-render of EventListeners React component
    // Cloning newCategory(.events) wouldn't be enough as that's not returned by a mapStateToProps.

    state.domEventCategories = [...state.domEventCategories];
  }
}

function addSortedCategoryOrEvent(array, newElement) {
  const index = lazy.BinarySearch.insertionIndexOf(function (a, b) {
    // Both category and event are using `name` as display label
    return a.name.localeCompare(b.name);
  }, array, newElement);
  array.splice(index, 0, newElement);
}

function locationMatchTrace(location, trace) {
  return trace.sourceId == location.sourceActor.id && trace.lineNumber == location.line && trace.columnNumber == location.column;
}
/**
 * Reports if a given trace matches the current searched argument value.
 *
 * @param {Object} trace
 *        The trace object communicated by the backend.
 * @param {any primitive|ObjectActor's form} searchValueOrGrip
 *        Either a primitive value (string, number, boolean, …) to match directly,
 *        or, an object actor form where we could match the actor ID.
 */


function isTraceMatchingSearch(trace, searchValueOrGrip) {
  const argumentValues = trace[TRACER_FIELDS_INDEXES.ENTER_ARGS];

  if (!argumentValues) {
    return false;
  }

  if (searchValueOrGrip) {
    const {
      actor
    } = searchValueOrGrip;

    if (actor) {
      return argumentValues.some(v => v.actor === searchValueOrGrip.actor);
    }
  } // `null` and `undefined` aren't serialized as-is and have a special grip object


  if (searchValueOrGrip === null) {
    return argumentValues.some(v => v?.type == "null");
  } else if (searchValueOrGrip === undefined) {
    return argumentValues.some(v => v?.type == "undefined");
  }

  return argumentValues.some(v => v === searchValueOrGrip);
}
/**
 * Generate the previews object consumed by InlinePreviews React component.
 *
 * @param {Object} state
 * @param {Object} trace
 *        Trace reducer object.
 * @return {Object}
 *        Previews consumed by InlinePreviews.
 */


function generatePreviewsForTrace(state, trace) {
  let previews = state.previews;
  const argumentValues = trace[TRACER_FIELDS_INDEXES.ENTER_ARGS];
  const argumentNames = trace[TRACER_FIELDS_INDEXES.ENTER_ARG_NAMES];

  if (argumentNames && argumentValues) {
    const frameIndex = trace[TRACER_FIELDS_INDEXES.FRAME_INDEX];
    const frame = state.mutableFrames[frameIndex]; // Subtracting 1 from line as codemirror lines are 0 indexed

    const line = frame.line - 1;
    const column = frame.column;
    const preview = [];

    for (let i = 0; i < argumentNames.length; i++) {
      const name = argumentNames[i]; // Values are either primitives, or an Object Front

      const objectGrip = argumentValues[i]?.getGrip ? argumentValues[i]?.getGrip() : argumentValues[i];
      preview.push({
        // All the argument will be show at the exact same spot.
        // Ideally it would be nice to show them next to each argument,
        // but the tracer currently expose the location of the first instruction
        // in the function body.
        line,
        column,
        // This attribute helps distinguish pause from trace previews
        type: "trace",
        name,
        value: objectGrip
      });
    } // This is the shape of data expected by InlinePreviews component


    previews = {
      [line]: preview
    };
  }

  return previews;
}

var _default = update;
exports.default = _default;