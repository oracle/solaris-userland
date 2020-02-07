"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clientCommands = exports.setupCommands = undefined;

var _create = require("./create");

let debuggerAgent; /* This Source Code Form is subject to the terms of the Mozilla Public
                    * License, v. 2.0. If a copy of the MPL was not distributed with this
                    * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

let runtimeAgent;
let pageAgent;

function setupCommands({ Debugger, Runtime, Page }) {
  debuggerAgent = Debugger;
  runtimeAgent = Runtime;
  pageAgent = Page;
}

function resume() {
  return debuggerAgent.resume();
}

function stepIn() {
  return debuggerAgent.stepInto();
}

function stepOver() {
  return debuggerAgent.stepOver();
}

function stepOut() {
  return debuggerAgent.stepOut();
}

function pauseOnExceptions(shouldPauseOnExceptions, shouldIgnoreCaughtExceptions) {
  if (!shouldPauseOnExceptions) {
    return debuggerAgent.setPauseOnExceptions({ state: "none" });
  }
  const state = shouldIgnoreCaughtExceptions ? "uncaught" : "all";
  return debuggerAgent.setPauseOnExceptions({ state });
}

function breakOnNext() {
  return debuggerAgent.pause();
}

function sourceContents(sourceId) {
  return debuggerAgent.getScriptSource({ scriptId: sourceId }).then(({ scriptSource }) => ({
    source: scriptSource,
    contentType: null
  }));
}

async function setBreakpoint(location, condition) {
  const {
    breakpointId,
    serverLocation
  } = await debuggerAgent.setBreakpoint({
    location: (0, _create.toServerLocation)(location),
    columnNumber: location.column
  });

  const actualLocation = (0, _create.fromServerLocation)(serverLocation) || location;

  return {
    id: breakpointId,
    actualLocation: actualLocation
  };
}

function removeBreakpoint(breakpointId) {
  return debuggerAgent.removeBreakpoint({ breakpointId });
}

async function getProperties(object) {
  const { result } = await runtimeAgent.getProperties({
    objectId: object.objectId
  });

  const loadedObjects = result.map(_create.createLoadedObject);

  return { loadedObjects };
}

function evaluate(script) {
  return runtimeAgent.evaluate({ expression: script });
}

function debuggeeCommand(script) {
  evaluate(script);
  return Promise.resolve();
}

function navigate(url) {
  return pageAgent.navigate({ url });
}

function getBreakpointByLocation(location) {}

function getFrameScopes() {}
function evaluateInFrame() {}
function evaluateExpressions() {}

const clientCommands = {
  resume,
  stepIn,
  stepOut,
  stepOver,
  pauseOnExceptions,
  breakOnNext,
  sourceContents,
  setBreakpoint,
  removeBreakpoint,
  evaluate,
  debuggeeCommand,
  navigate,
  getProperties,
  getBreakpointByLocation,
  getFrameScopes,
  evaluateInFrame,
  evaluateExpressions
};

exports.setupCommands = setupCommands;
exports.clientCommands = clientCommands;