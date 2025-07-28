"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateNavigateContext = validateNavigateContext;
exports.validateThreadContext = validateThreadContext;
exports.validateContext = validateContext;
exports.validateSelectedFrame = validateSelectedFrame;
exports.validateBreakpoint = validateBreakpoint;
exports.validateSource = validateSource;
exports.validateSourceActor = validateSourceActor;
exports.validateThreadFrames = validateThreadFrames;
exports.validateFrame = validateFrame;
exports.isValidThreadContext = isValidThreadContext;
exports.ContextError = void 0;
loader.lazyRequireGetter(this, "_index", "devtools/client/debugger/src/selectors/index");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
// Context encapsulates the main parameters of the current redux state, which
// impact most other information tracked by the debugger.
//
// The main use of Context is to control when asynchronous operations are
// allowed to make changes to the program state. Such operations might be
// invalidated as the state changes from the time the operation was originally
// initiated. For example, operations on pause state might still continue even
// after the thread unpauses.
//
// The methods below can be used to compare an old context with the current one
// and see if the operation is now invalid and should be abandoned. Actions can
// also include a 'cx' Context property, which will be checked by the context
// middleware. If the action fails validateContextAction() then it will not be
// dispatched.
//
// Context can additionally be used as a shortcut to access the main properties
// of the pause state.
// A normal Context is invalidated if the target navigates.
// A ThreadContext is invalidated if the target navigates, or if the current
// thread changes, pauses, or resumes.
class ContextError extends Error {
  constructor(msg) {
    // Use a prefix string to help `PromiseTestUtils.allowMatchingRejectionsGlobally`
    // ignore all these exceptions as this is based on error strings.
    super(`DebuggerContextError: ${msg}`);
  }

}

exports.ContextError = ContextError;

function validateNavigateContext(state, cx) {
  const newcx = (0, _index.getThreadContext)(state);

  if (newcx.navigateCounter != cx.navigateCounter) {
    throw new ContextError("Page has navigated");
  }
}

function validateThreadContext(state, cx) {
  const newcx = (0, _index.getThreadContext)(state);

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

function validateSelectedFrame(state, selectedFrame) {
  const newThread = (0, _index.getCurrentThread)(state);

  if (selectedFrame.thread != newThread) {
    throw new ContextError("Selected thread has changed");
  }

  const newSelectedFrame = (0, _index.getSelectedFrame)(state); // Compare frame's IDs as frame objects are cloned during mapping

  if (selectedFrame.id != newSelectedFrame?.id) {
    throw new ContextError("Selected frame changed");
  }
}

function validateBreakpoint(state, breakpoint) {
  // XHR breakpoint don't use any location and are always valid
  if (!breakpoint.location) {
    return;
  }

  if (!(0, _index.hasSource)(state, breakpoint.location.source.id)) {
    throw new ContextError(`Breakpoint's location is obsolete (source '${breakpoint.location.source.id}' no longer exists)`);
  }

  if (!(0, _index.hasSource)(state, breakpoint.generatedLocation.source.id)) {
    throw new ContextError(`Breakpoint's generated location is obsolete (source '${breakpoint.generatedLocation.source.id}' no longer exists)`);
  }
}

function validateSource(state, source) {
  if (!(0, _index.hasSource)(state, source.id)) {
    throw new ContextError(`Obsolete source (source '${source.id}' no longer exists)`);
  }
}

function validateSourceActor(state, sourceActor) {
  if (!(0, _index.hasSourceActor)(state, sourceActor.id)) {
    throw new ContextError(`Obsolete source actor (source '${sourceActor.id}' no longer exists)`);
  }
}

function validateThreadFrames(state, thread, frames) {
  const newThread = (0, _index.getCurrentThread)(state);

  if (thread != newThread) {
    throw new ContextError("Selected thread has changed");
  }

  const newTopFrame = (0, _index.getCurrentlyFetchedTopFrame)(state, newThread);

  if (newTopFrame?.id != frames[0].id) {
    throw new ContextError("Thread moved to another location");
  }
}

function validateFrame(state, frame) {
  if (!(0, _index.hasFrame)(state, frame)) {
    throw new ContextError(`Obsolete frame (frame '${frame.id}' no longer exists)`);
  }
}

function isValidThreadContext(state, cx) {
  const newcx = (0, _index.getThreadContext)(state);
  return cx.thread == newcx.thread && cx.pauseCounter == newcx.pauseCounter;
}