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
    symbols: {},
    inScopeLines: {}
  };
}

function update(state = initialASTState(), action) {
  switch (action.type) {
    case "SET_SYMBOLS":
      {
        const {
          sourceId
        } = action;

        if (action.status === "start") {
          return { ...state,
            symbols: { ...state.symbols,
              [sourceId]: {
                loading: true
              }
            }
          };
        }

        const value = action.value;
        return { ...state,
          symbols: { ...state.symbols,
            [sourceId]: value
          }
        };
      }

    case "IN_SCOPE_LINES":
      {
        return { ...state,
          inScopeLines: { ...state.inScopeLines,
            [(0, _breakpoint.makeBreakpointId)(action.location)]: action.lines
          }
        };
      }

    case "RESUME":
      {
        return { ...state,
          inScopeLines: {}
        };
      }

    case "NAVIGATE":
      {
        return initialASTState();
      }

    default:
      {
        return state;
      }
  }
}

var _default = update;
exports.default = _default;