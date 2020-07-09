"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inComponent = inComponent;
loader.lazyRequireGetter(this, "_", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_ast", "devtools/client/debugger/src/utils/ast");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function inComponent(state) {
  const thread = (0, _.getCurrentThread)(state);
  const selectedFrame = (0, _.getSelectedFrame)(state, thread);

  if (!selectedFrame) {
    return;
  }

  const source = (0, _.getSource)(state, selectedFrame.location.sourceId);

  if (!source) {
    return;
  }

  const symbols = (0, _.getSymbols)(state, source);

  if (!symbols || symbols.loading) {
    return;
  }

  const closestClass = (0, _ast.findClosestClass)(symbols, selectedFrame.location);

  if (!closestClass) {
    return null;
  }

  const inReactFile = symbols.framework == "React";
  const {
    parent
  } = closestClass;
  const isComponent = parent && parent.name.includes("Component");

  if (inReactFile && isComponent) {
    return closestClass.name;
  }
}