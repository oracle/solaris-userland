"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setSymbols = void 0;
loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_promise", "devtools/client/debugger/src/actions/utils/middleware/promise");
loader.lazyRequireGetter(this, "_tabs", "devtools/client/debugger/src/actions/tabs");
loader.lazyRequireGetter(this, "_loadSourceText", "devtools/client/debugger/src/actions/sources/loadSourceText");
loader.lazyRequireGetter(this, "_memoizableAction", "devtools/client/debugger/src/utils/memoizableAction");
loader.lazyRequireGetter(this, "_asyncValue", "devtools/client/debugger/src/utils/async-value");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
async function doSetSymbols(cx, source, {
  dispatch,
  getState,
  parser
}) {
  const sourceId = source.id;
  await dispatch((0, _loadSourceText.loadSourceText)({
    cx,
    source
  }));
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
}

const setSymbols = (0, _memoizableAction.memoizeableAction)("setSymbols", {
  getValue: ({
    source
  }, {
    getState
  }) => {
    if (source.isWasm) {
      return (0, _asyncValue.fulfilled)(null);
    }

    const symbols = (0, _selectors.getSymbols)(getState(), source);

    if (!symbols || symbols.loading) {
      return null;
    }

    return (0, _asyncValue.fulfilled)(symbols);
  },
  createKey: ({
    source
  }) => source.id,
  action: ({
    cx,
    source
  }, thunkArgs) => doSetSymbols(cx, source, thunkArgs)
});
exports.setSymbols = setSymbols;