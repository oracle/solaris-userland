"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.showFrameContextMenu = showFrameContextMenu;
loader.lazyRequireGetter(this, "_menu", "devtools/client/debugger/src/context-menu/menu");
loader.lazyRequireGetter(this, "_clipboard", "devtools/client/debugger/src/utils/clipboard");
loader.lazyRequireGetter(this, "_index", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_ui", "devtools/client/debugger/src/actions/ui");
loader.lazyRequireGetter(this, "_index2", "devtools/client/debugger/src/actions/pause/index");
loader.lazyRequireGetter(this, "_index3", "devtools/client/debugger/src/utils/pause/frames/index");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function formatMenuElement(labelString, click, disabled = false) {
  const label = L10N.getStr(labelString);
  const accesskey = L10N.getStr(`${labelString}.accesskey`);
  const id = `node-menu-${labelString}`;
  return {
    id,
    label,
    accesskey,
    disabled,
    click
  };
}

function isValidRestartFrame(frame) {
  // Any frame state than 'on-stack' is either dismissed by the server
  // or can potentially cause unexpected errors.
  // Global frame has frame.callee equal to null and can't be restarted.
  return frame.type === "call" && frame.state === "on-stack";
}

function copyStackTrace() {
  return async ({
    getState
  }) => {
    const frames = (0, _index.getCurrentThreadFrames)(getState());
    const shouldDisplayOriginalLocation = (0, _index.getShouldSelectOriginalLocation)(getState());
    const framesToCopy = frames.map(frame => (0, _index3.formatCopyName)(frame, L10N, shouldDisplayOriginalLocation)).join("\n");
    (0, _clipboard.copyToTheClipboard)(framesToCopy);
  };
}

function showFrameContextMenu(event, frame, hideRestart = false) {
  return async ({
    dispatch,
    getState
  }) => {
    const items = []; // Hides 'Restart Frame' item for call stack groups context menu,
    // otherwise can be misleading for the user which frame gets restarted.

    if (!hideRestart && isValidRestartFrame(frame)) {
      items.push(formatMenuElement("restartFrame", () => dispatch((0, _index2.restart)(frame))));
    }

    const toggleFrameWorkL10nLabel = (0, _index.getFrameworkGroupingState)(getState()) ? "framework.disableGrouping" : "framework.enableGrouping";
    items.push(formatMenuElement(toggleFrameWorkL10nLabel, () => dispatch((0, _ui.toggleFrameworkGrouping)(!(0, _index.getFrameworkGroupingState)(getState())))));
    const {
      source
    } = frame;

    if (frame.source) {
      items.push(formatMenuElement("copySourceUri2", () => (0, _clipboard.copyToTheClipboard)(source.url)));
      const toggleBlackBoxL10nLabel = source.isBlackBoxed ? "ignoreContextItem.unignore" : "ignoreContextItem.ignore";
      items.push(formatMenuElement(toggleBlackBoxL10nLabel, () => dispatch((0, _index2.toggleBlackBox)(source))));
    }

    items.push(formatMenuElement("copyStackTrace", () => dispatch(copyStackTrace())));
    (0, _menu.showMenu)(event, items);
  };
}