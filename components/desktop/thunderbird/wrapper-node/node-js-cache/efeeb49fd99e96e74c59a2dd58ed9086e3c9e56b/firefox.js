"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clientEvents = exports.clientCommands = exports.createObjectClient = undefined;
exports.onConnect = onConnect;

var _commands = require("./firefox/commands");

var _events = require("./firefox/events");

var _prefs = require("../utils/prefs");

let DebuggerClient; /* This Source Code Form is subject to the terms of the Mozilla Public
                     * License, v. 2.0. If a copy of the MPL was not distributed with this
                     * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

function createObjectClient(grip) {
  return DebuggerClient.createObjectClient(grip);
}

async function onConnect(connection, actions) {
  const {
    tabConnection: { tabTarget, threadClient, debuggerClient }
  } = connection;

  DebuggerClient = debuggerClient;

  if (!tabTarget || !threadClient || !debuggerClient) {
    return;
  }

  const supportsWasm = _prefs.features.wasm && !!debuggerClient.mainRoot.traits.wasmBinarySource;

  (0, _commands.setupCommands)({
    threadClient,
    tabTarget,
    debuggerClient,
    supportsWasm
  });

  (0, _events.setupEvents)({ threadClient, tabTarget, actions, supportsWasm });

  tabTarget.on("will-navigate", actions.willNavigate);
  tabTarget.on("navigate", actions.navigated);

  await threadClient.reconfigure({
    observeAsmJS: true,
    pauseWorkersUntilAttach: true,
    wasmBinarySource: supportsWasm,
    skipBreakpoints: _prefs.prefs.skipPausing
  });

  // In Firefox, we need to initially request all of the sources. This
  // usually fires off individual `newSource` notifications as the
  // debugger finds them, but there may be existing sources already in
  // the debugger (if it's paused already, or if loading the page from
  // bfcache) so explicity fire `newSource` events for all returned
  // sources.
  const sourceInfo = await _commands.clientCommands.fetchSources();
  const traits = tabTarget.traits;
  await actions.connect(tabTarget.url, threadClient.actor, traits && traits.canRewind, tabTarget.isWebExtension);
  await actions.newGeneratedSources(sourceInfo);

  // If the threadClient is already paused, make sure to show a
  // paused state.
  const pausedPacket = threadClient.getLastPausePacket();
  if (pausedPacket) {
    _events.clientEvents.paused(threadClient, "paused", pausedPacket);
  }
}

exports.createObjectClient = createObjectClient;
exports.clientCommands = _commands.clientCommands;
exports.clientEvents = _events.clientEvents;