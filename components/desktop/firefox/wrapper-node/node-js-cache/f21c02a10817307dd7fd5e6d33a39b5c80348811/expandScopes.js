"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setExpandedScope = setExpandedScope;
loader.lazyRequireGetter(this, "_scopes", "devtools/client/debugger/src/utils/pause/scopes");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function setExpandedScope(selectedFrame, item, expanded) {
  return function ({
    dispatch
  }) {
    return dispatch({
      type: "SET_EXPANDED_SCOPE",
      selectedFrame,
      path: (0, _scopes.getScopeItemPath)(item),
      expanded
    });
  };
}