"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bootstrap = bootstrap;
exports.destroy = destroy;

var firefox = _interopRequireWildcard(require("./client/firefox"));

loader.lazyRequireGetter(this, "_prefs", "devtools/client/debugger/src/utils/prefs");
loader.lazyRequireGetter(this, "_dbg", "devtools/client/debugger/src/utils/dbg");
loader.lazyRequireGetter(this, "_telemetry", "devtools/client/debugger/src/utils/telemetry");
loader.lazyRequireGetter(this, "_bootstrap", "devtools/client/debugger/src/utils/bootstrap");
loader.lazyRequireGetter(this, "_breakpoints", "devtools/client/debugger/src/reducers/breakpoints");
loader.lazyRequireGetter(this, "_sources", "devtools/client/debugger/src/reducers/sources");
loader.lazyRequireGetter(this, "_sourcesTree", "devtools/client/debugger/src/reducers/sources-tree");
loader.lazyRequireGetter(this, "_ui", "devtools/client/debugger/src/reducers/ui");
loader.lazyRequireGetter(this, "_sourceBlackbox", "devtools/client/debugger/src/reducers/source-blackbox");
loader.lazyRequireGetter(this, "_eventListeners", "devtools/client/debugger/src/reducers/event-listeners");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
const {
  sanitizeBreakpoints
} = require("resource://devtools/client/shared/thread-utils.js");

async function syncBreakpoints() {
  const breakpoints = await _prefs.asyncStore.pendingBreakpoints;
  const breakpointValues = Object.values(sanitizeBreakpoints(breakpoints));
  return Promise.all(breakpointValues.map(({
    disabled,
    options,
    generatedLocation
  }) => {
    if (disabled) {
      return Promise.resolve();
    } // Set the breakpoint on the server using the generated location as generated
    // sources are known on server, not original sources.


    return firefox.clientCommands.setBreakpoint(generatedLocation, options);
  }));
}

async function syncXHRBreakpoints() {
  const breakpoints = await _prefs.asyncStore.xhrBreakpoints;
  return Promise.all(breakpoints.map(({
    path,
    method,
    disabled
  }) => {
    if (!disabled) {
      firefox.clientCommands.setXHRBreakpoint(path, method);
    }
  }));
}

function setPauseOnDebuggerStatement() {
  const {
    pauseOnDebuggerStatement
  } = _prefs.prefs;
  return firefox.clientCommands.pauseOnDebuggerStatement(pauseOnDebuggerStatement);
}

function setPauseOnExceptions() {
  const {
    pauseOnExceptions,
    pauseOnCaughtExceptions
  } = _prefs.prefs;
  return firefox.clientCommands.pauseOnExceptions(pauseOnExceptions, pauseOnCaughtExceptions);
}

async function loadInitialState(commands) {
  const pendingBreakpoints = sanitizeBreakpoints((await _prefs.asyncStore.pendingBreakpoints));
  const tabs = {
    tabs: await _prefs.asyncStore.tabs
  };
  const xhrBreakpoints = await _prefs.asyncStore.xhrBreakpoints;
  const blackboxedRanges = await _prefs.asyncStore.blackboxedRanges;
  const eventListenerBreakpoints = await _prefs.asyncStore.eventListenerBreakpoints;

  if (eventListenerBreakpoints && !eventListenerBreakpoints.byPanel) {
    // Firefox 132 changed the layout of the event listener data to support both breakpoints and tracer
    eventListenerBreakpoints.byPanel = (0, _eventListeners.initialEventListenerState)().byPanel;
  }

  const breakpoints = (0, _breakpoints.initialBreakpointsState)(xhrBreakpoints);
  const sourceBlackBox = (0, _sourceBlackbox.initialSourceBlackBoxState)({
    blackboxedRanges
  });
  const sources = (0, _sources.initialSourcesState)();
  const sourcesTree = (0, _sourcesTree.initialSourcesTreeState)({
    mainThreadProjectDirectoryRoots: await _prefs.asyncStore.directoryRoots,
    isWebExtension: commands.descriptorFront.isWebExtensionDescriptor
  });
  const ui = (0, _ui.initialUIState)();
  return {
    pendingBreakpoints,
    tabs,
    breakpoints,
    eventListenerBreakpoints,
    sources,
    sourcesTree,
    sourceBlackBox,
    ui
  };
}

async function bootstrap({
  commands,
  fluentBundles,
  resourceCommand,
  workers: panelWorkers,
  panel
}) {
  (0, _prefs.verifyPrefSchema)(); // Set telemetry at the very beginning as some actions fired from this function might
  // record events.

  (0, _telemetry.setToolboxTelemetry)(panel.toolbox.telemetry);
  const initialState = await loadInitialState(commands);
  const workers = (0, _bootstrap.bootstrapWorkers)(panelWorkers);
  const {
    store,
    actions,
    selectors
  } = (0, _bootstrap.bootstrapStore)(firefox.clientCommands, workers, panel, initialState);
  const connected = firefox.onConnect(commands, resourceCommand, actions, store);
  await syncBreakpoints();
  await syncXHRBreakpoints();
  await setPauseOnDebuggerStatement();
  await setPauseOnExceptions();
  (0, _dbg.setupHelper)({
    store,
    actions,
    selectors,
    workers,
    targetCommand: commands.targetCommand,
    client: firefox.clientCommands
  });
  (0, _bootstrap.bootstrapApp)(store, panel.getToolboxStore(), {
    fluentBundles,
    toolboxDoc: panel.panelWin.parent.document
  });
  await connected;
  return {
    store,
    actions,
    selectors,
    client: firefox.clientCommands
  };
}

async function destroy() {
  firefox.onDisconnect();
  (0, _bootstrap.unmountRoot)();
  (0, _bootstrap.teardownWorkers)();
}