"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.showBreakpointHeadingContextMenu = showBreakpointHeadingContextMenu;
loader.lazyRequireGetter(this, "_menu", "devtools/client/debugger/src/context-menu/menu");
loader.lazyRequireGetter(this, "_index", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_index2", "devtools/client/debugger/src/actions/breakpoints/index");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function showBreakpointHeadingContextMenu(event, source) {
  return async ({
    dispatch,
    getState
  }) => {
    const state = getState();
    const breakpointsForSource = (0, _index.getBreakpointsForSource)(state, source);
    const enableInSourceLabel = L10N.getStr("breakpointHeadingsMenuItem.enableInSource.label");
    const disableInSourceLabel = L10N.getStr("breakpointHeadingsMenuItem.disableInSource.label");
    const removeInSourceLabel = L10N.getStr("breakpointHeadingsMenuItem.removeInSource.label");
    const enableInSourceKey = L10N.getStr("breakpointHeadingsMenuItem.enableInSource.accesskey");
    const disableInSourceKey = L10N.getStr("breakpointHeadingsMenuItem.disableInSource.accesskey");
    const removeInSourceKey = L10N.getStr("breakpointHeadingsMenuItem.removeInSource.accesskey");
    const disableInSourceItem = {
      id: "node-menu-disable-in-source",
      label: disableInSourceLabel,
      accesskey: disableInSourceKey,
      disabled: false,
      click: () => dispatch((0, _index2.disableBreakpointsInSource)(source))
    };
    const enableInSourceItem = {
      id: "node-menu-enable-in-source",
      label: enableInSourceLabel,
      accesskey: enableInSourceKey,
      disabled: false,
      click: () => dispatch((0, _index2.enableBreakpointsInSource)(source))
    };
    const removeInSourceItem = {
      id: "node-menu-enable-in-source",
      label: removeInSourceLabel,
      accesskey: removeInSourceKey,
      disabled: false,
      click: () => dispatch((0, _index2.removeBreakpointsInSource)(source))
    };
    const hideDisableInSourceItem = breakpointsForSource.every(breakpoint => breakpoint.disabled);
    const hideEnableInSourceItem = breakpointsForSource.every(breakpoint => !breakpoint.disabled);
    const items = [{
      item: disableInSourceItem,
      hidden: () => hideDisableInSourceItem
    }, {
      item: enableInSourceItem,
      hidden: () => hideEnableInSourceItem
    }, {
      item: removeInSourceItem,
      hidden: () => false
    }];
    (0, _menu.showMenu)(event, (0, _menu.buildMenu)(items));
  };
}