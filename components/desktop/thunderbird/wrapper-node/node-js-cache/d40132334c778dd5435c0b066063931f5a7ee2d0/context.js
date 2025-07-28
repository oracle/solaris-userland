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
  getState
}) {
  return next => action => {
    if ("cx" in action) {
      validateActionContext(getState, action);
    } // Validate actions specific to a Source object.
    // This will throw if the source has been removed,
    // i.e. when the source has been removed from all the threads where it existed.


    if ("source" in action) {
      (0, _context.validateSource)(getState(), action.source);
    } // Validate actions specific to a Source Actor object.
    // This will throw if the source actor has been removed,
    // i.e. when the source actor's thread has been removed.


    if ("sourceActor" in action) {
      (0, _context.validateSourceActor)(getState(), action.sourceActor);
    } // Similar to sourceActor assertion, but with a distinct attribute name


    if ("generatedSourceActor" in action) {
      (0, _context.validateSourceActor)(getState(), action.generatedSourceActor);
    } // Validate actions specific to a given breakpoint.
    // This will throw if the breakpoint's location is obsolete.
    // i.e. when the related source has been removed.


    if ("breakpoint" in action) {
      (0, _context.validateBreakpoint)(getState(), action.breakpoint);
    } // Validate actions specific to the currently selected paused frame.
    // It will throw if we resumed or moved to another frame in the call stack.
    //
    // Ignore falsy selectedFrame as sometimes it can be null
    // for expression actions.


    if (action.selectedFrame) {
      (0, _context.validateSelectedFrame)(getState(), action.selectedFrame);
    } // Validate actions specific to a given pause location.
    // This will throw if we resumed or paused in another location.
    // Compared to selected frame, this would not throw if we moved to another frame in the call stack.


    if ("thread" in action && "frames" in action) {
      (0, _context.validateThreadFrames)(getState(), action.thread, action.frames);
    } // Validate actions specific to a given frame while being paused.
    // This will throw if we resumed or paused in another location.
    // But compared to selected frame, this would not throw if we moved to another frame in the call stack.
    // This ends up being similar to "pause location" case, but with different arguments.


    if ("frame" in action) {
      (0, _context.validateFrame)(getState(), action.frame);
    }

    return next(action);
  };
}