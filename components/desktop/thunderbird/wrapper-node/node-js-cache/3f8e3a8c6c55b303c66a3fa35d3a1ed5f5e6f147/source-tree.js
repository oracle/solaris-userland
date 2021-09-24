"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initialSourcesTreeState = initialSourcesTreeState;
exports.default = update;
exports.getExpandedState = getExpandedState;
exports.getFocusedSourceItem = getFocusedSourceItem;

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

/**
 * Source tree reducer
 * @module reducers/source-tree
 */
function initialSourcesTreeState() {
  return {
    expanded: new Set(),
    focusedItem: null
  };
}

function update(state = initialSourcesTreeState(), action) {
  switch (action.type) {
    case "SET_EXPANDED_STATE":
      return updateExpanded(state, action);

    case "SET_FOCUSED_SOURCE_ITEM":
      return { ...state,
        focusedItem: action.item
      };
  }

  return state;
}

function updateExpanded(state, action) {
  return { ...state,
    expanded: new Set(action.expanded)
  };
}

function getExpandedState(state) {
  return state.sourceTree.expanded;
}

function getFocusedSourceItem(state) {
  return state.sourceTree.focusedItem;
}