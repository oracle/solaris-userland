"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onConnect = onConnect;

var _firefox = require("./firefox");

var firefox = _interopRequireWildcard(_firefox);

var _chrome = require("./chrome");

var chrome = _interopRequireWildcard(_chrome);

var _prefs = require("../utils/prefs");

var _dbg = require("../utils/dbg");

var _bootstrap = require("../utils/bootstrap");

var _breakpoints = require("../reducers/breakpoints");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

async function syncBreakpoints() {
  const breakpoints = await _prefs.asyncStore.pendingBreakpoints;
  const breakpointValues = Object.values(breakpoints);
  breakpointValues.forEach(({ disabled, options, generatedLocation }) => {
    if (!disabled) {
      firefox.clientCommands.setBreakpoint(generatedLocation, options);
    }
  });
}

function syncXHRBreakpoints() {
  _prefs.asyncStore.xhrBreakpoints.then(bps => {
    bps.forEach(({ path, method, disabled }) => {
      if (!disabled) {
        firefox.clientCommands.setXHRBreakpoint(path, method);
      }
    });
  });
}

async function loadInitialState() {
  const pendingBreakpoints = await _prefs.asyncStore.pendingBreakpoints;
  const tabs = await _prefs.asyncStore.tabs;
  const xhrBreakpoints = await _prefs.asyncStore.xhrBreakpoints;
  const eventListenerBreakpoints = await _prefs.asyncStore.eventListenerBreakpoints;

  const breakpoints = (0, _breakpoints.initialBreakpointsState)(xhrBreakpoints);

  return { pendingBreakpoints, tabs, breakpoints, eventListenerBreakpoints };
}

function getClient(connection) {
  const {
    tab: { clientType }
  } = connection;
  return clientType == "firefox" ? firefox : chrome;
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

  const { store, actions, selectors } = (0, _bootstrap.bootstrapStore)(commands, workers, panel, initialState);

  await client.onConnect(connection, actions);

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

  (0, _bootstrap.bootstrapApp)(store);
  return { store, actions, selectors, client: commands };
}