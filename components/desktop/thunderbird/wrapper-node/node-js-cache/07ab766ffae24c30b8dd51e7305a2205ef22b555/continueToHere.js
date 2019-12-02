"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.continueToHere = continueToHere;

var _selectors = require("../../selectors/index");

var _breakpoints = require("../breakpoints/index");

var _commands = require("./commands");

function continueToHere(cx, line, column) {
  return async function ({ dispatch, getState }) {
    const selectedSource = (0, _selectors.getSelectedSource)(getState());
    const selectedFrame = (0, _selectors.getSelectedFrame)(getState(), cx.thread);

    if (!selectedFrame || !selectedSource) {
      return;
    }

    const debugLine = selectedFrame.location.line;
    if (debugLine == line) {
      return;
    }

    const action = (0, _selectors.getCanRewind)(getState()) && line < debugLine ? _commands.rewind : _commands.resume;

    await dispatch((0, _breakpoints.addHiddenBreakpoint)(cx, {
      line,
      column: column,
      sourceId: selectedSource.id
    }));

    dispatch(action(cx));
  };
} /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */