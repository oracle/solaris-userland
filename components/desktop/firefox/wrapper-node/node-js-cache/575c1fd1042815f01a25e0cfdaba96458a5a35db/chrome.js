"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clientEvents = exports.clientCommands = undefined;
exports.onConnect = onConnect;

var _commands = require("./chrome/commands");

var _events = require("./chrome/events");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

async function onConnect(connection, actions) {
  const {
    tabConnection,
    connTarget: { type }
  } = connection;
  const { Debugger, Runtime, Page } = tabConnection;

  Debugger.enable();
  Debugger.setPauseOnExceptions({ state: "none" });
  Debugger.setAsyncCallStackDepth({ maxDepth: 0 });

  if (type == "chrome") {
    Page.frameNavigated(_events.pageEvents.frameNavigated);
    Page.frameStartedLoading(_events.pageEvents.frameStartedLoading);
    Page.frameStoppedLoading(_events.pageEvents.frameStoppedLoading);
  }

  Debugger.scriptParsed(_events.clientEvents.scriptParsed);
  Debugger.scriptFailedToParse(_events.clientEvents.scriptFailedToParse);
  Debugger.paused(_events.clientEvents.paused);
  Debugger.resumed(_events.clientEvents.resumed);

  (0, _commands.setupCommands)({ Debugger, Runtime, Page });
  (0, _events.setupEvents)({ actions, Page, type, Runtime });
  return {};
}

exports.clientCommands = _commands.clientCommands;
exports.clientEvents = _events.clientEvents;