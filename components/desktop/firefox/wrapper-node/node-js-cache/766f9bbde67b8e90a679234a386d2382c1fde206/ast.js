"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSymbols = getSymbols;
exports.hasSymbols = hasSymbols;
exports.isSymbolsLoading = isSymbolsLoading;
exports.getInScopeLines = getInScopeLines;
exports.hasInScopeLines = hasInScopeLines;
loader.lazyRequireGetter(this, "_breakpoint", "devtools/client/debugger/src/utils/breakpoint/index");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
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