"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.showOutlineContextMenu = showOutlineContextMenu;
loader.lazyRequireGetter(this, "_menu", "devtools/client/debugger/src/context-menu/menu");
loader.lazyRequireGetter(this, "_clipboard", "devtools/client/debugger/src/utils/clipboard");
loader.lazyRequireGetter(this, "_function", "devtools/client/debugger/src/utils/function");
loader.lazyRequireGetter(this, "_ui", "devtools/client/debugger/src/actions/ui");
loader.lazyRequireGetter(this, "_index", "devtools/client/debugger/src/selectors/index");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function showOutlineContextMenu(event, func, symbols) {
  return async ({
    dispatch,
    getState
  }) => {
    const state = getState();
    const selectedSource = (0, _index.getSelectedSource)(state);

    if (!selectedSource) {
      return;
    }

    const selectedSourceTextContent = (0, _index.getSelectedSourceTextContent)(state);
    const sourceLine = func.location.start.line;
    const functionText = (0, _function.findFunctionText)(sourceLine, selectedSource, selectedSourceTextContent, symbols);
    const copyFunctionItem = {
      id: "node-menu-copy-function",
      label: L10N.getStr("copyFunction.label"),
      accesskey: L10N.getStr("copyFunction.accesskey"),
      disabled: !functionText,
      click: () => {
        dispatch((0, _ui.flashLineRange)({
          start: sourceLine,
          end: func.location.end.line,
          sourceId: selectedSource.id
        }));
        return (0, _clipboard.copyToTheClipboard)(functionText);
      }
    };
    const items = [copyFunctionItem];
    (0, _menu.showMenu)(event, items);
  };
}