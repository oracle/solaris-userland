"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isLineInScope = isLineInScope;
loader.lazyRequireGetter(this, "_ast", "devtools/client/debugger/src/selectors/ast");
loader.lazyRequireGetter(this, "_pause", "devtools/client/debugger/src/selectors/pause");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
// Checks if a line is considered in scope
// We consider all lines in scope, if we do not have lines in scope.
function isLineInScope(state, line) {
  const frame = (0, _pause.getVisibleSelectedFrame)(state);

  if (!frame) {
    return false;
  }

  const lines = (0, _ast.getInScopeLines)(state, frame.location);

  if (!lines) {
    return true;
  }

  return lines.includes(line);
}