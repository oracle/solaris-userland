"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onConnect = onConnect;
Object.defineProperty(exports, "clientCommands", {
  enumerable: true,
  get: function () {
    return _commands.clientCommands;
  }
});
Object.defineProperty(exports, "clientEvents", {
  enumerable: true,
  get: function () {
    return _events.clientEvents;
  }
});
loader.lazyRequireGetter(this, "_commands", "devtools/client/debugger/src/client/firefox/commands");
loader.lazyRequireGetter(this, "_events", "devtools/client/debugger/src/client/firefox/events");
loader.lazyRequireGetter(this, "_prefs", "devtools/client/debugger/src/utils/prefs");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
let actions;

async function onConnect(connection, _actions) {
  const {
    devToolsClient,
    targetList
  } = connection;
  actions = _actions;
  (0, _commands.setupCommands)({
    devToolsClient,
    targetList
  });
  (0, _events.setupEvents)({
    actions,
    devToolsClient
  });
  await targetList.watchTargets(targetList.ALL_TYPES, onTargetAvailable, onTargetDestroyed);
}

async function onTargetAvailable({
  targetFront,
  isTargetSwitching
}) {
  if (!targetFront.isTopLevel) {
    return;
  }

  if (isTargetSwitching) {
    // Simulate navigation actions when target switching.
    // The will-navigate event will be missed when using target switching,
    // however `navigate` corresponds more or less to the load event, so it
    // should still be received on the new target.
    actions.willNavigate({
      url: targetFront.url
    });
  } // Make sure targetFront.threadFront is availabled and attached.


  await targetFront.onThreadAttached;
  const {
    threadFront
  } = targetFront;

  if (!threadFront) {
    return;
  }

  (0, _events.setupEventsTopTarget)(targetFront);
  targetFront.on("will-navigate", actions.willNavigate);
  targetFront.on("navigate", actions.navigated);
  const wasmBinarySource = _prefs.features.wasm && !!targetFront.client.mainRoot.traits.wasmBinarySource;
  await threadFront.reconfigure({
    observeAsmJS: true,
    pauseWorkersUntilAttach: true,
    wasmBinarySource,
    skipBreakpoints: _prefs.prefs.skipPausing,
    logEventBreakpoints: _prefs.prefs.logEventBreakpoints
  }); // Retrieve possible event listener breakpoints

  actions.getEventListenerBreakpointTypes().catch(e => console.error(e)); // Initialize the event breakpoints on the thread up front so that
  // they are active once attached.

  actions.addEventListenerBreakpoints([]).catch(e => console.error(e));
  const {
    traits
  } = targetFront;
  await actions.connect(targetFront.url, threadFront.actor, traits, targetFront.isWebExtension);
  await actions.addTarget(targetFront);
  await _commands.clientCommands.checkIfAlreadyPaused();
}

function onTargetDestroyed({
  targetFront
}) {
  if (targetFront.isTopLevel) {
    targetFront.off("will-navigate", actions.willNavigate);
    targetFront.off("navigate", actions.navigated);
    (0, _events.removeEventsTopTarget)(targetFront);
  }

  actions.removeTarget(targetFront);
}