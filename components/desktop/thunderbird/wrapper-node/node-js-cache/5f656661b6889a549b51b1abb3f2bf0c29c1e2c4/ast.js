"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSymbols = getSymbols;
exports.getInScopeLines = getInScopeLines;
exports.hasInScopeLines = hasInScopeLines;
loader.lazyRequireGetter(this, "_breakpoint", "devtools/client/debugger/src/utils/breakpoint/index");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function getSymbols(state, location) {
  var _state$ast$mutableSou;

  if (!location) {
    return null;
  }

  if (location.source.isOriginal) {
    var _state$ast$mutableOri;

    return ((_state$ast$mutableOri = state.ast.mutableOriginalSourcesSymbols[location.source.id]) === null || _state$ast$mutableOri === void 0 ? void 0 : _state$ast$mutableOri.value) || null;
  }

  if (!location.sourceActor) {
    throw new Error("Expects a location with a source actor when passing non-original sources to getSymbols");
  }

  return ((_state$ast$mutableSou = state.ast.mutableSourceActorSymbols[location.sourceActor.id]) === null || _state$ast$mutableSou === void 0 ? void 0 : _state$ast$mutableSou.value) || null;
}

function getInScopeLines(state, location) {
  var _state$ast$mutableInS;

  return (_state$ast$mutableInS = state.ast.mutableInScopeLines[(0, _breakpoint.makeBreakpointId)(location)]) === null || _state$ast$mutableInS === void 0 ? void 0 : _state$ast$mutableInS.lines;
}

function hasInScopeLines(state, location) {
  return !!getInScopeLines(state, location);
}