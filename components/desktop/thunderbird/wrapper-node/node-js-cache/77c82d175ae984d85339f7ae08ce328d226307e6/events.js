"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clientEvents = exports.pageEvents = exports.setupEvents = undefined;

var _create = require("./create");

var _sourceQueue = require("../../utils/source-queue");

var _sourceQueue2 = _interopRequireDefault(_sourceQueue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

let actions;
let pageAgent;
let clientType;
let runtimeAgent;

function setupEvents(dependencies) {
  actions = dependencies.actions;
  pageAgent = dependencies.Page;
  clientType = dependencies.clientType;
  runtimeAgent = dependencies.Runtime;
  _sourceQueue2.default.initialize(actions);
}

// Debugger Events
function scriptParsed({
  scriptId,
  url,
  startLine,
  startColumn,
  endLine,
  endColumn,
  executionContextId,
  hash,
  isContentScript,
  isInternalScript,
  isLiveEdit,
  sourceMapURL,
  hasSourceURL,
  deprecatedCommentWasUsed
}) {
  if (isContentScript) {
    return;
  }

  if (clientType == "node") {
    sourceMapURL = undefined;
  }

  actions.newSource({
    id: scriptId,
    url,
    sourceMapURL,
    isPrettyPrinted: false
  });
}

function scriptFailedToParse() {}

async function paused({
  callFrames,
  reason,
  data,
  hitBreakpoints,
  asyncStackTrace
}) {
  const frames = callFrames.map(_create.createFrame);
  const frame = frames[0];
  const why = { type: reason, ...data };

  const objectId = frame.scopeChain[0].object.objectId;
  const { result } = await runtimeAgent.getProperties({
    objectId
  });

  const loadedObjects = result.map(_create.createLoadedObject);

  if (clientType == "chrome") {
    pageAgent.configureOverlay({ message: "Paused in debugger.html" });
  }
  await actions.paused({ thread: "root", frame, why, frames, loadedObjects });
}

function resumed() {
  if (clientType == "chrome") {
    pageAgent.configureOverlay({ suspended: false });
  }

  actions.resumed();
}

function globalObjectCleared() {}

// Page Events
function frameNavigated(frame) {
  actions.navigated();
}

function frameStartedLoading() {
  actions.willNavigate();
}

function domContentEventFired() {}

function loadEventFired() {}

function frameStoppedLoading() {}

const clientEvents = {
  scriptParsed,
  scriptFailedToParse,
  paused,
  resumed,
  globalObjectCleared
};

const pageEvents = {
  frameNavigated,
  frameStartedLoading,
  domContentEventFired,
  loadEventFired,
  frameStoppedLoading
};

exports.setupEvents = setupEvents;
exports.pageEvents = pageEvents;
exports.clientEvents = clientEvents;