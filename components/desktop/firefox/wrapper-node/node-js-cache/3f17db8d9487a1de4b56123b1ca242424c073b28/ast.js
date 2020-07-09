"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initialASTState = initialASTState;
exports.getSymbols = getSymbols;
exports.hasSymbols = hasSymbols;
exports.getFramework = getFramework;
exports.isSymbolsLoading = isSymbolsLoading;
exports.getInScopeLines = getInScopeLines;
exports.hasInScopeLines = hasInScopeLines;
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
} // NOTE: we'd like to have the app state fully typed
// https://github.com/firefox-devtools/debugger/blob/master/src/reducers/sources.js#L179-L185


function getSymbols(state, source) {
  if (!source) {
    return null;
  }

  return state.ast.symbols[source.id] || null;
}

function hasSymbols(state, source) {
  const symbols = getSymbols(state, source);

  if (!symbols) {
    return false;
  }

  return !symbols.loading;
}

function getFramework(state, source) {
  const symbols = getSymbols(state, source);

  if (symbols && !symbols.loading) {
    return symbols.framework;
  }
}

function isSymbolsLoading(state, source) {
  const symbols = getSymbols(state, source);

  if (!symbols) {
    return false;
  }

  return symbols.loading;
}

function getInScopeLines(state, location) {
  return state.ast.inScopeLines[(0, _breakpoint.makeBreakpointId)(location)];
}

function hasInScopeLines(state, location) {
  return !!getInScopeLines(state, location);
}

var _default = update;
exports.default = _default;