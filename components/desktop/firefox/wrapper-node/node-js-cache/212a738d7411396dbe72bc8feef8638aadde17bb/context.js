"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateNavigateContext = validateNavigateContext;
exports.validateThreadContext = validateThreadContext;
exports.validateContext = validateContext;
exports.isValidThreadContext = isValidThreadContext;
exports.ContextError = void 0;
loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
class ContextError extends Error {}

exports.ContextError = ContextError;

function validateNavigateContext(state, cx) {
  const newcx = (0, _selectors.getThreadContext)(state);

  if (newcx.navigateCounter != cx.navigateCounter) {
    throw new ContextError("Page has navigated");
  }
}

function validateThreadContext(state, cx) {
  const newcx = (0, _selectors.getThreadContext)(state);

  if (cx.thread != newcx.thread) {
    throw new ContextError("Current thread has changed");
  }

  if (cx.pauseCounter != newcx.pauseCounter) {
    throw new ContextError("Current thread has paused or resumed");
  }
}

function validateContext(state, cx) {
  validateNavigateContext(state, cx);

  if ("thread" in cx) {
    validateThreadContext(state, cx);
  }
}

function isValidThreadContext(state, cx) {
  const newcx = (0, _selectors.getThreadContext)(state);
  return cx.thread == newcx.thread && cx.pauseCounter == newcx.pauseCounter;
}