"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onConnect = onConnect;
exports.onDisconnect = onDisconnect;
Object.defineProperty(exports, "clientCommands", {
  enumerable: true,
  get: function () {
    return _commands2.clientCommands;
  }
});
loader.lazyRequireGetter(this, "_commands2", "devtools/client/debugger/src/client/firefox/commands");
loader.lazyRequireGetter(this, "_create", "devtools/client/debugger/src/client/firefox/create");
loader.lazyRequireGetter(this, "_prefs", "devtools/client/debugger/src/utils/prefs");
loader.lazyRequireGetter(this, "_telemetry", "devtools/client/debugger/src/utils/telemetry");

var _sourceQueue = _interopRequireDefault(require("../utils/source-queue"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
let actions;
let commands;
let targetCommand;
let resourceCommand;

async function onConnect(_commands, _resourceCommand, _actions, store) {
  actions = _actions;
  commands = _commands;
  targetCommand = _commands.targetCommand;
  resourceCommand = _resourceCommand;
  (0, _commands2.setupCommands)(commands);
  (0, _create.setupCreate)({
    store
  });

  _sourceQueue.default.initialize(actions);

  const {
    descriptorFront
  } = commands;
  const {
    targetFront
  } = targetCommand;

  if (targetFront.isBrowsingContext || descriptorFront.isParentProcessDescriptor) {
    targetCommand.listenForWorkers = true;

    if (descriptorFront.isLocalTab && _prefs.features.windowlessServiceWorkers) {
      targetCommand.listenForServiceWorkers = true;
      targetCommand.destroyServiceWorkersOnNavigation = true;
    }

    await targetCommand.startListening();
  } // `pauseWorkersUntilAttach` is one option set when the debugger panel is opened rather that from the toolbox.
  // The reason is to support early breakpoints in workers, which will force the workers to pause
  // and later on (when TargetMixin.attachThread is called) resume worker execution, after passing the breakpoints.
  // We only observe workers when the debugger panel is opened (see the few lines before and listenForWorkers = true).
  // So if we were passing `pauseWorkersUntilAttach=true` from the toolbox code, workers would freeze as we would not watch
  // for their targets and not resume them.


  const options = {
    pauseWorkersUntilAttach: true
  };
  await commands.threadConfigurationCommand.updateConfiguration(options); // We should probably only pass descriptor informations from here
  // so only pass if that's a WebExtension toolbox.
  // And let actions.willNavigate/NAVIGATE pass the current/selected thread
  // from onTargetAvailable

  await actions.connect(targetFront.url, targetFront.threadFront.actor, targetFront.isWebExtension);
  await targetCommand.watchTargets(targetCommand.ALL_TYPES, onTargetAvailable, onTargetDestroyed); // Use independant listeners for SOURCE and THREAD_STATE in order to ease
  // doing batching and notify about a set of SOURCE's in one redux action.

  await resourceCommand.watchResources([resourceCommand.TYPES.SOURCE], {
    onAvailable: onSourceAvailable
  });
  await resourceCommand.watchResources([resourceCommand.TYPES.THREAD_STATE], {
    onAvailable: onBreakpointAvailable
  });
  await resourceCommand.watchResources([resourceCommand.TYPES.ERROR_MESSAGE], {
    onAvailable: actions.addExceptionFromResources
  });
  await resourceCommand.watchResources([resourceCommand.TYPES.DOCUMENT_EVENT], {
    onAvailable: onDocumentEventAvailable,
    // we only care about future events for DOCUMENT_EVENT
    ignoreExistingResources: true
  });
}

function onDisconnect() {
  targetCommand.unwatchTargets(targetCommand.ALL_TYPES, onTargetAvailable, onTargetDestroyed);
  resourceCommand.unwatchResources([resourceCommand.TYPES.SOURCE], {
    onAvailable: onSourceAvailable
  });
  resourceCommand.unwatchResources([resourceCommand.TYPES.THREAD_STATE], {
    onAvailable: onBreakpointAvailable
  });
  resourceCommand.unwatchResources([resourceCommand.TYPES.ERROR_MESSAGE], {
    onAvailable: actions.addExceptionFromResources
  });
  resourceCommand.unwatchResources([resourceCommand.TYPES.DOCUMENT_EVENT], {
    onAvailable: onDocumentEventAvailable
  });

  _sourceQueue.default.clear();
}

async function onTargetAvailable({
  targetFront,
  isTargetSwitching
}) {
  const isBrowserToolbox = commands.descriptorFront.isParentProcessDescriptor;
  const isNonTopLevelFrameTarget = !targetFront.isTopLevel && targetFront.targetType === targetCommand.TYPES.FRAME;

  if (isBrowserToolbox && isNonTopLevelFrameTarget) {
    // In the BrowserToolbox, non-top-level frame targets are already
    // debugged via content-process targets.
    // Do not attach the thread here, as it was already done by the
    // corresponding content-process target.
    return;
  }

  if (!targetFront.isTopLevel) {
    await actions.addTarget(targetFront);
    return;
  } // At this point, we expect the target and its thread to be attached.


  const {
    threadFront
  } = targetFront;

  if (!threadFront) {
    console.error("The thread for", targetFront, "isn't attached.");
    return;
  } // Retrieve possible event listener breakpoints


  actions.getEventListenerBreakpointTypes().catch(e => console.error(e)); // Initialize the event breakpoints on the thread up front so that
  // they are active once attached.

  actions.addEventListenerBreakpoints([]).catch(e => console.error(e));
  await actions.addTarget(targetFront);
}

function onTargetDestroyed({
  targetFront
}) {
  actions.removeTarget(targetFront);
}

async function onSourceAvailable(sources) {
  const frontendSources = await Promise.all(sources.filter(source => {
    return !source.targetFront.isDestroyed();
  }).map(async source => {
    const threadFront = await source.targetFront.getFront("thread");
    const frontendSource = (0, _create.prepareSourcePayload)(threadFront, source);
    return frontendSource;
  }));
  await actions.newGeneratedSources(frontendSources);
}

async function onBreakpointAvailable(breakpoints) {
  for (const resource of breakpoints) {
    const threadFront = await resource.targetFront.getFront("thread");

    if (resource.state == "paused") {
      const pause = await (0, _create.createPause)(threadFront.actor, resource);
      await actions.paused(pause);
      (0, _telemetry.recordEvent)("pause", {
        reason: resource.why.type
      });
    } else if (resource.state == "resumed") {
      await actions.resumed(threadFront.actorID);
    }
  }
}

function onDocumentEventAvailable(events) {
  for (const event of events) {
    // Only consider top level document, and ignore remote iframes top document
    if (!event.targetFront.isTopLevel) continue;

    if (event.name == "will-navigate") {
      actions.willNavigate({
        url: event.newURI
      });
    } else if (event.name == "dom-complete") {
      actions.navigated();
    }
  }
}