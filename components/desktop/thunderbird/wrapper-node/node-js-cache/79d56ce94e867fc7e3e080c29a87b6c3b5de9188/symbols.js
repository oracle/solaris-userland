"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setSymbols = undefined;

var _selectors = require("../../selectors/index");

var _promise = require("../utils/middleware/promise");

var _tabs = require("../tabs");

var _loadSourceText = require("./loadSourceText");

var _memoizableAction = require("../../utils/memoizableAction");

async function doSetSymbols(cx, source, { dispatch, getState, parser }) {
  const sourceId = source.id;

  await dispatch((0, _loadSourceText.loadSourceText)({ cx, source }));

  await dispatch({
    type: "SET_SYMBOLS",
    cx,
    sourceId,
    [_promise.PROMISE]: parser.getSymbols(sourceId)
  });

  const symbols = (0, _selectors.getSymbols)(getState(), source);
  if (symbols && symbols.framework) {
    dispatch((0, _tabs.updateTab)(source, symbols.framework));
  }

  return symbols;
} /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

const setSymbols = exports.setSymbols = (0, _memoizableAction.memoizeableAction)("setSymbols", {
  exitEarly: ({ source }) => source.isWasm,
  hasValue: ({ source }, { getState }) => (0, _selectors.hasSymbols)(getState(), source),
  getValue: ({ source }, { getState }) => (0, _selectors.getSymbols)(getState(), source),
  createKey: ({ source }) => source.id,
  action: ({ cx, source }, thunkArgs) => doSetSymbols(cx, source, thunkArgs)
});