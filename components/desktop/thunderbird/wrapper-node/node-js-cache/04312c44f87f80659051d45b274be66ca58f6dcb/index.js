"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onConnect = onConnect;

var firefox = _interopRequireWildcard(require("./firefox"));

loader.lazyRequireGetter(this, "_prefs", "devtools/client/debugger/src/utils/prefs");
loader.lazyRequireGetter(this, "_dbg", "devtools/client/debugger/src/utils/dbg");
loader.lazyRequireGetter(this, "_bootstrap", "devtools/client/debugger/src/utils/bootstrap");
loader.lazyRequireGetter(this, "_breakpoints", "devtools/client/debugger/src/reducers/breakpoints");
loader.lazyRequireGetter(this, "_sources", "devtools/client/debugger/src/reducers/sources");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
async function syncBreakpoints() {
  const breakpoints = await _prefs.asyncStore.pendingBreakpoints;
  const breakpointValues = Object.values(breakpoints);
  breakpointValues.forEach(({
    disabled,
    options,
    generatedLocation
  }) => {
    if (!disabled) {
      firefox.clientCommands.setBreakpoint(generatedLocation, options);
    }
  });
}

function syncXHRBreakpoints() {
  _prefs.asyncStore.xhrBreakpoints.then(bps => {
    bps.forEach(({
      path,
      method,
      disabled
    }) => {
      if (!disabled) {
        firefox.clientCommands.setXHRBreakpoint(path, method);
      }
    });
  });
}

async function loadInitialState() {
  const pendingBreakpoints = await _prefs.asyncStore.pendingBreakpoints;
  const tabs = {
    tabs: await _prefs.asyncStore.tabs
  };
  const xhrBreakpoints = await _prefs.asyncStore.xhrBreakpoints;
  const tabsBlackBoxed = await _prefs.asyncStore.tabsBlackBoxed;
  const eventListenerBreakpoints = await _prefs.asyncStore.eventListenerBreakpoints;
  const breakpoints = (0, _breakpoints.initialBreakpointsState)(xhrBreakpoints);
  const sources = (0, _sources.initialSourcesState)({
    tabsBlackBoxed
  });
  return {
    pendingBreakpoints,
    tabs,
    breakpoints,
    eventListenerBreakpoints,
    sources
  };
}

function getClient(connection) {
  return firefox;
}

async function onConnect(connection, panelWorkers, panel) {
  // NOTE: the landing page does not connect to a JS process
  if (!connection) {
    return;
  }

  (0, _prefs.verifyPrefSchema)();
  const client = getClient(connection);
  const commands = client.clientCommands;
  const initialState = await loadInitialState();
  const workers = (0, _bootstrap.bootstrapWorkers)(panelWorkers);
  const {
    store,
    actions,
    selectors
  } = (0, _bootstrap.bootstrapStore)(commands, workers, panel, initialState);
  const connected = client.onConnect(connection, actions);
  await syncBreakpoints();
  syncXHRBreakpoints();
  (0, _dbg.setupHelper)({
    store,
    actions,
    selectors,
    workers,
    connection,
    client: client.clientCommands
  });
  (0, _bootstrap.bootstrapApp)(store, panel);
  await connected;
  return {
    store,
    actions,
    selectors,
    client: commands
  };
}