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
const {
  TRACER_LOG_METHODS
} = require("resource://devtools/shared/specs/tracer.js");

const {
  AppConstants
} = ChromeUtils.importESModule("resource://gre/modules/AppConstants.sys.mjs");

const {
  PrefObserver
} = require("resource://devtools/client/shared/prefs.js");

let actions;
let commands;
let targetCommand;
let resourceCommand;
let prefObserver;

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
  } = commands; // For tab, browser and webextension toolboxes, we want to enable watching for
  // worker targets as soon as the debugger is opened.
  // And also for service workers, if the related experimental feature is enabled

  if (descriptorFront.isTabDescriptor || descriptorFront.isWebExtensionDescriptor || descriptorFront.isBrowserProcessDescriptor) {
    targetCommand.listenForWorkers = true;

    if (descriptorFront.isLocalTab && _prefs.features.windowlessServiceWorkers) {
      targetCommand.listenForServiceWorkers = true;
    }

    await targetCommand.startListening();
  }

  const options = {
    // `pauseWorkersUntilAttach` is one option set when the debugger panel is opened rather that from the toolbox.
    // The reason is to support early breakpoints in workers, which will force the workers to pause
    // and later on (when TargetMixin.attachThread is called) resume worker execution, after passing the breakpoints.
    // We only observe workers when the debugger panel is opened (see the few lines before and listenForWorkers = true).
    // So if we were passing `pauseWorkersUntilAttach=true` from the toolbox code, workers would freeze as we would not watch
    // for their targets and not resume them.
    pauseWorkersUntilAttach: true,
    // Bug 1719615 - Immediately turn on WASM debugging when the debugger opens.
    // We avoid enabling that as soon as DevTools open as WASM generates different kind of machine code
    // with debugging instruction which significantly increase the memory usage.
    observeWasm: true
  };
  await commands.threadConfigurationCommand.updateConfiguration(options); // Depending on the content script preference we should or should not observe
  // CONTENT_SCRIPT targets.

  const targetTypes = _prefs.prefs.showContentScripts ? targetCommand.ALL_TYPES : targetCommand.ALL_TYPES.filter(type => type != targetCommand.TYPES.CONTENT_SCRIPT);
  await targetCommand.watchTargets({
    types: targetTypes,
    onAvailable: onTargetAvailable,
    onDestroyed: onTargetDestroyed
  }); // Use independant listeners for SOURCE and THREAD_STATE in order to ease
  // doing batching and notify about a set of SOURCE's in one redux action.

  await resourceCommand.watchResources([resourceCommand.TYPES.SOURCE], {
    onAvailable: onSourceAvailable
  });
  await resourceCommand.watchResources([resourceCommand.TYPES.THREAD_STATE], {
    onAvailable: onThreadStateAvailable
  });
  await resourceCommand.watchResources([resourceCommand.TYPES.ERROR_MESSAGE], {
    onAvailable: actions.addExceptionFromResources
  });
  await resourceCommand.watchResources([resourceCommand.TYPES.DOCUMENT_EVENT], {
    onAvailable: onDocumentEventAvailable,
    // we only care about future events for DOCUMENT_EVENT
    ignoreExistingResources: true
  });
  await resourceCommand.watchResources([resourceCommand.TYPES.JSTRACER_STATE], {
    onAvailable: onTracingStateAvailable
  });
  await resourceCommand.watchResources([resourceCommand.TYPES.JSTRACER_TRACE], {
    onAvailable: actions.addTraces
  }); // Also register a toggle listener, in addition to JSTRACER_TRACE in order
  // to be able to clear the tracer data on tracing start, that, even if the
  // tracer is waiting for next interaction/load.

  commands.tracerCommand.on("toggle", onTracingToggled);

  if (!commands.client.isLocalClient) {
    const localPlatformVersion = AppConstants.MOZ_APP_VERSION;
    const remotePlatformVersion = await getRemotePlatformVersion();
    actions.setLocalAndRemoteRuntimeVersion(localPlatformVersion, remotePlatformVersion);
  }

  prefObserver = new PrefObserver("devtools.debugger.show-content-scripts");
  prefObserver.on("devtools.debugger.show-content-scripts", onToggleContentScripts);
}

async function onToggleContentScripts() {
  if (!_prefs.prefs.showContentScripts) {
    await targetCommand.watchTargets({
      types: [targetCommand.TYPES.CONTENT_SCRIPT],
      onAvailable: onTargetAvailable,
      onDestroyed: onTargetDestroyed
    });
  } else {
    // unwatchTarget won't call onTargetDestroyed for the previously registered targets
    // so, manually destroy all existing content script targets
    const existingTargets = targetCommand.getAllTargets([targetCommand.TYPES.CONTENT_SCRIPT]);

    for (const targetFront of existingTargets) {
      actions.removeTarget(targetFront);
    }

    targetCommand.unwatchTargets({
      types: [targetCommand.TYPES.CONTENT_SCRIPT],
      onAvailable: onTargetAvailable,
      onDestroyed: onTargetDestroyed
    });
  }
}

function onDisconnect() {
  targetCommand.unwatchTargets({
    types: targetCommand.ALL_TYPES,
    onAvailable: onTargetAvailable,
    onDestroyed: onTargetDestroyed
  });
  resourceCommand.unwatchResources([resourceCommand.TYPES.SOURCE], {
    onAvailable: onSourceAvailable
  });
  resourceCommand.unwatchResources([resourceCommand.TYPES.THREAD_STATE], {
    onAvailable: onThreadStateAvailable
  });
  resourceCommand.unwatchResources([resourceCommand.TYPES.JSTRACER_STATE], {
    onAvailable: onTracingStateAvailable
  });
  resourceCommand.unwatchResources([resourceCommand.TYPES.ERROR_MESSAGE], {
    onAvailable: actions.addExceptionFromResources
  });
  resourceCommand.unwatchResources([resourceCommand.TYPES.DOCUMENT_EVENT], {
    onAvailable: onDocumentEventAvailable
  });
  resourceCommand.unwatchResources([resourceCommand.TYPES.JSTRACER_STATE], {
    onAvailable: onTracingStateAvailable
  });
  resourceCommand.unwatchResources([resourceCommand.TYPES.JSTRACER_TRACE], {
    onAvailable: actions.addTraces
  });
  commands.tracerCommand.off("toggle", onTracingToggled);

  _sourceQueue.default.clear();

  prefObserver.destroy();
}

async function onTargetAvailable({
  targetFront
}) {
  const isBrowserToolbox = commands.descriptorFront.isBrowserProcessDescriptor;
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

  actions.addEventListenerBreakpoints("breakpoint", []).catch(e => console.error(e));
  await actions.addTarget(targetFront);
}

function onTargetDestroyed({
  targetFront
}) {
  actions.removeTarget(targetFront);
}

async function onSourceAvailable(sources) {
  await actions.newGeneratedSources(sources);
}

async function onThreadStateAvailable(resources) {
  for (const resource of resources) {
    if (resource.targetFront.isDestroyed()) {
      continue;
    }

    const threadFront = await resource.targetFront.getFront("thread");

    if (resource.state == "paused") {
      const pause = await (0, _create.createPause)(threadFront.actorID, resource);
      await actions.paused(pause);
      (0, _telemetry.recordEvent)("pause", {
        reason: resource.why.type
      });
    } else if (resource.state == "resumed") {
      await actions.resumed(threadFront.actorID);
    }
  }
}

async function onTracingStateAvailable(resources) {
  for (const resource of resources) {
    if (resource.targetFront.isDestroyed()) {
      continue;
    } // Ignore if the tracer is logging to any other output


    if (resource.logMethod != TRACER_LOG_METHODS.DEBUGGER_SIDEBAR) {
      continue;
    } // For now, only consider the top level target


    if (!resource.targetFront.isTopLevel) {
      continue;
    }

    const threadFront = await resource.targetFront.getFront("thread");
    await actions.tracingToggled(threadFront.actor, resource.enabled, resource.traceValues);
  }
}

async function onTracingToggled() {
  const {
    tracerCommand
  } = commands;

  if (!tracerCommand.isTracingEnabled) {
    return;
  } // We only notify about global enabling of the tracer in order to clear data


  actions.clearTracerData();
}

function onDocumentEventAvailable(events) {
  for (const event of events) {
    // Only consider top level document, and ignore remote iframes top document
    if (!event.targetFront.isTopLevel) {
      continue;
    } // The browser toolbox debugger doesn't support the iframe dropdown.
    // you will always see all the sources of all targets of your debugging context.
    //
    // But still allow it to clear the debugger when reloading the addon, or when
    // switching between fallback document and other addon document.


    if (event.isFrameSwitching && !commands.descriptorFront.isWebExtensionDescriptor) {
      continue;
    }

    if (event.name == "will-navigate") {
      actions.willNavigate({
        url: event.newURI
      });
    } else if (event.name == "dom-complete") {
      actions.navigated();
    }
  }
}

async function getRemotePlatformVersion() {
  const deviceFront = await commands.client.mainRoot.getFront("device");
  const description = await deviceFront.getDescription();
  return description.platformversion;
}