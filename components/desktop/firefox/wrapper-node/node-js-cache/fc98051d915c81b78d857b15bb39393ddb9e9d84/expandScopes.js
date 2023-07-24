"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setExpandedScope = setExpandedScope;
loader.lazyRequireGetter(this, "_utils", "devtools/client/debugger/src/utils/pause/scopes/utils");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function setExpandedScope(cx, item, expanded) {
  return function ({
    dispatch,
    getState
  }) {
    return dispatch({
      type: "SET_EXPANDED_SCOPE",
      cx,
      thread: cx.thread,
      path: (0, _utils.getScopeItemPath)(item),
      expanded
    });
  };
}