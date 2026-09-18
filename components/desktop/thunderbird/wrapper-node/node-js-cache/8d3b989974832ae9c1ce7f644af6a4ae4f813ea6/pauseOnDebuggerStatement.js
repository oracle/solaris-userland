"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pauseOnDebuggerStatement = pauseOnDebuggerStatement;

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
const {
  PROMISE
} = require("resource://devtools/client/shared/redux/middleware/promise.js");

function pauseOnDebuggerStatement(shouldPauseOnDebuggerStatement) {
  return ({
    dispatch,
    client
  }) => {
    return dispatch({
      type: "PAUSE_ON_DEBUGGER_STATEMENT",
      shouldPauseOnDebuggerStatement,
      [PROMISE]: client.pauseOnDebuggerStatement(shouldPauseOnDebuggerStatement)
    });
  };
}