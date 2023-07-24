"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getScopes = getScopes;
loader.lazyRequireGetter(this, "_getScope", "devtools/client/debugger/src/utils/pause/scopes/getScope");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function getScopes(why, selectedFrame, frameScopes) {
  if (!why || !selectedFrame) {
    return null;
  }

  if (!frameScopes) {
    return null;
  }

  const scopes = [];
  let scope = frameScopes;
  let scopeIndex = 1;
  let prev = null,
      prevItem = null;

  while (scope) {
    let scopeItem = (0, _getScope.getScope)(scope, selectedFrame, frameScopes, why, scopeIndex);

    if (scopeItem) {
      const mergedItem = prev && prevItem ? (0, _getScope.mergeScopes)(prev, scope, prevItem, scopeItem) : null;

      if (mergedItem) {
        scopeItem = mergedItem;
        scopes.pop();
      }

      scopes.push(scopeItem);
    }

    prev = scope;
    prevItem = scopeItem;
    scopeIndex++;
    scope = scope.parent;
  }

  return scopes;
}