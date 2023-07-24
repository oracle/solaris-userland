"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setSymbols = void 0;
loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_promise", "devtools/client/debugger/src/actions/utils/middleware/promise");
loader.lazyRequireGetter(this, "_loadSourceText", "devtools/client/debugger/src/actions/sources/loadSourceText");
loader.lazyRequireGetter(this, "_memoizableAction", "devtools/client/debugger/src/utils/memoizableAction");
loader.lazyRequireGetter(this, "_asyncValue", "devtools/client/debugger/src/utils/async-value");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
async function doSetSymbols(cx, location, {
  dispatch,
  getState,
  parserWorker
}) {
  await dispatch((0, _loadSourceText.loadSourceText)(cx, location.source, location.sourceActor));
  await dispatch({
    type: "SET_SYMBOLS",
    cx,
    location,
    [_promise.PROMISE]: parserWorker.getSymbols(location.sourceId)
  });
}

const setSymbols = (0, _memoizableAction.memoizeableAction)("setSymbols", {
  getValue: ({
    location
  }, {
    getState,
    parserWorker
  }) => {
    if (!parserWorker.isLocationSupported(location)) {
      return (0, _asyncValue.fulfilled)(null);
    }

    const symbols = (0, _selectors.getSymbols)(getState(), location);

    if (!symbols) {
      return null;
    }

    return (0, _asyncValue.fulfilled)(symbols);
  },
  createKey: ({
    location
  }) => location.sourceId,
  action: ({
    cx,
    location
  }, thunkArgs) => doSetSymbols(cx, location, thunkArgs)
});
exports.setSymbols = setSymbols;