"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.context = context;
loader.lazyRequireGetter(this, "_context", "devtools/client/debugger/src/utils/context");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function validateActionContext(getState, action) {
  if (action.type == "COMMAND" && action.status == "done") {
    // The thread will have resumed execution since the action was initiated,
    // so just make sure we haven't navigated.
    (0, _context.validateNavigateContext)(getState(), action.cx);
    return;
  } // Validate using all available information in the context.


  (0, _context.validateContext)(getState(), action.cx);
} // Middleware which looks for actions that have a cx property and ignores
// them if the context is no longer valid.


function context({
  dispatch,
  getState
}) {
  return next => action => {
    if ("cx" in action) {
      validateActionContext(getState, action);
    }

    return next(action);
  };
}