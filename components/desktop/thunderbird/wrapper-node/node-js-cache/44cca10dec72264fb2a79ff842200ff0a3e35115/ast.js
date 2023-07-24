"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initialASTState = initialASTState;
exports.default = void 0;
loader.lazyRequireGetter(this, "_breakpoint", "devtools/client/debugger/src/utils/breakpoint/index");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

/**
 * Ast reducer
 * @module reducers/ast
 */
function initialASTState() {
  return {
    // We are using mutable objects as we never return the dictionary as-is from the selectors
    // but only their values.
    // Note that all these dictionaries are storing objects as values
    // which all will have a threadActorId attribute.
    // We have two maps, a first one for original sources.
    // This is keyed by source id.
    mutableOriginalSourcesSymbols: {},
    // And another one, for generated sources.
    // This is keyed by source actor id.
    mutableSourceActorSymbols: {},
    mutableInScopeLines: {}
  };
}

function update(state = initialASTState(), action) {
  switch (action.type) {
    case "SET_SYMBOLS":
      {
        var _location$sourceActor;

        const {
          location
        } = action;

        if (action.status === "start") {
          return state;
        }

        const entry = {
          value: action.value,
          threadActorId: (_location$sourceActor = location.sourceActor) === null || _location$sourceActor === void 0 ? void 0 : _location$sourceActor.thread
        };

        if (location.source.isOriginal) {
          state.mutableOriginalSourcesSymbols[location.source.id] = entry;
        } else {
          if (!location.sourceActor) {
            throw new Error("Expects a location with a source actor when adding symbols for non-original sources");
          }

          state.mutableSourceActorSymbols[location.sourceActor.id] = entry;
        }

        return { ...state
        };
      }

    case "IN_SCOPE_LINES":
      {
        var _action$location$sour;

        state.mutableInScopeLines[(0, _breakpoint.makeBreakpointId)(action.location)] = {
          lines: action.lines,
          threadActorId: (_action$location$sour = action.location.sourceActor) === null || _action$location$sour === void 0 ? void 0 : _action$location$sour.thread
        };
        return { ...state
        };
      }

    case "RESUME":
      {
        return { ...state,
          mutableInScopeLines: {}
        };
      }

    case "REMOVE_THREAD":
      {
        function clearDict(dict, threadId) {
          for (const key in dict) {
            if (dict[key].threadActorId == threadId) {
              delete dict[key];
            }
          }
        }

        clearDict(state.mutableSourceActorSymbols, action.threadActorID);
        clearDict(state.mutableOriginalSourcesSymbols, action.threadActorID);
        clearDict(state.mutableInScopeLines, action.threadActorID);
        return { ...state
        };
      }

    default:
      {
        return state;
      }
  }
}

var _default = update;
exports.default = _default;