"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getInScopeLines = getInScopeLines;
exports.hasInScopeLines = hasInScopeLines;
loader.lazyRequireGetter(this, "_index", "devtools/client/debugger/src/utils/breakpoint/index");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function getInScopeLines(state, location) {
  return state.ast.mutableInScopeLines[(0, _index.makeBreakpointId)(location)]?.lines;
}

function hasInScopeLines(state, location) {
  return !!getInScopeLines(state, location);
}