"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setExpandedState = setExpandedState;
exports.focusItem = focusItem;
exports.setProjectDirectoryRoot = setProjectDirectoryRoot;
exports.clearProjectDirectoryRoot = clearProjectDirectoryRoot;
exports.setShowContentScripts = setShowContentScripts;
loader.lazyRequireGetter(this, "_index", "devtools/client/debugger/src/selectors/index");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function setExpandedState(expanded) {
  return {
    type: "SET_EXPANDED_STATE",
    expanded
  };
}

function focusItem(item) {
  return {
    type: "SET_FOCUSED_SOURCE_ITEM",
    item
  };
}

function setProjectDirectoryRoot(newRootItemUniquePath, newName, newFullName) {
  return ({
    dispatch,
    getState
  }) => {
    dispatch({
      type: "SET_PROJECT_DIRECTORY_ROOT",
      uniquePath: newRootItemUniquePath,
      name: newName,
      fullName: newFullName,
      mainThread: (0, _index.getMainThread)(getState())
    });
  };
}

function clearProjectDirectoryRoot() {
  return setProjectDirectoryRoot("", "", "");
}

function setShowContentScripts(shouldShow) {
  return {
    type: "SHOW_CONTENT_SCRIPTS",
    shouldShow
  };
}