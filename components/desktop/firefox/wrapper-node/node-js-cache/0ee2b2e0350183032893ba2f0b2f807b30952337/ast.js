"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initialASTState = initialASTState;
exports.getSymbols = getSymbols;
exports.hasSymbols = hasSymbols;
exports.getFramework = getFramework;
exports.isSymbolsLoading = isSymbolsLoading;
exports.getOutOfScopeLocations = getOutOfScopeLocations;
exports.getInScopeLines = getInScopeLines;
exports.isLineInScope = isLineInScope;
function initialASTState() {
  return {
    symbols: {},
    outOfScopeLocations: null,
    inScopeLines: null
  };
} /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

/**
 * Ast reducer
 * @module reducers/ast
 */

function update(state = initialASTState(), action) {
  switch (action.type) {
    case "SET_SYMBOLS":
      {
        const { sourceId } = action;
        if (action.status === "start") {
          return {
            ...state,
            symbols: { ...state.symbols, [sourceId]: { loading: true } }
          };
        }

        const value = action.value;
        return {
          ...state,
          symbols: { ...state.symbols, [sourceId]: value }
        };
      }

    case "OUT_OF_SCOPE_LOCATIONS":
      {
        return { ...state, outOfScopeLocations: action.locations };
      }

    case "IN_SCOPE_LINES":
      {
        return { ...state, inScopeLines: action.lines };
      }

    case "RESUME":
      {
        return { ...state, outOfScopeLocations: null };
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

// NOTE: we'd like to have the app state fully typed
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

function getOutOfScopeLocations(state) {
  return state.ast.outOfScopeLocations;
}

function getInScopeLines(state) {
  return state.ast.inScopeLines;
}

function isLineInScope(state, line) {
  const linesInScope = state.ast.inScopeLines;
  return linesInScope && linesInScope.includes(line);
}

exports.default = update;