"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPauseReason = getPauseReason;
exports.isException = isException;
exports.isInterrupted = isInterrupted;
exports.inDebuggerEval = inDebuggerEval;

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
// Map protocol pause "why" reason to a valid L10N key
// These are the known unhandled reasons:
// "breakpointConditionThrown", "clientEvaluated"
// "interrupted", "attached"
const reasons = {
  debuggerStatement: "whyPaused.debuggerStatement",
  breakpoint: "whyPaused.breakpoint",
  exception: "whyPaused.exception",
  resumeLimit: "whyPaused.resumeLimit",
  breakpointConditionThrown: "whyPaused.breakpointConditionThrown",
  eventBreakpoint: "whyPaused.eventBreakpoint",
  getWatchpoint: "whyPaused.getWatchpoint",
  setWatchpoint: "whyPaused.setWatchpoint",
  mutationBreakpoint: "whyPaused.mutationBreakpoint",
  interrupted: "whyPaused.interrupted",
  // V8
  DOM: "whyPaused.breakpoint",
  EventListener: "whyPaused.pauseOnDOMEvents",
  XHR: "whyPaused.XHR",
  promiseRejection: "whyPaused.promiseRejection",
  assert: "whyPaused.assert",
  debugCommand: "whyPaused.debugCommand",
  other: "whyPaused.other"
};

function getPauseReason(why) {
  if (!why) {
    return null;
  }

  const reasonType = why.type;

  if (!reasons[reasonType]) {
    console.log("Please file an issue: reasonType=", reasonType);
  }

  return reasons[reasonType];
}

function isException(why) {
  return (why === null || why === void 0 ? void 0 : why.type) === "exception";
}

function isInterrupted(why) {
  return (why === null || why === void 0 ? void 0 : why.type) === "interrupted";
}

function inDebuggerEval(why) {
  if (why && why.type === "exception" && why.exception && why.exception.preview && why.exception.preview.fileName) {
    return why.exception.preview.fileName === "debugger eval code";
  }

  return false;
}