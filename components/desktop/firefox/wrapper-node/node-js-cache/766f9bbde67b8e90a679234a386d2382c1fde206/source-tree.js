"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getExpandedState = getExpandedState;
exports.getFocusedSourceItem = getFocusedSourceItem;

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function getExpandedState(state) {
  return state.sourceTree.expanded;
}

function getFocusedSourceItem(state) {
  return state.sourceTree.focusedItem;
}