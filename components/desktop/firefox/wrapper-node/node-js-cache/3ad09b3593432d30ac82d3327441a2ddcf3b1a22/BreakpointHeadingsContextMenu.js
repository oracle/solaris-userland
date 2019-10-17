"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = showContextMenu;

var _devtoolsContextmenu = require("devtools/client/debugger/dist/vendors").vendored["devtools-contextmenu"];

var _actions = require("../../../actions/index");

var _actions2 = _interopRequireDefault(_actions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

function showContextMenu(props) {
  const {
    cx,
    source,
    breakpointsForSource,
    disableBreakpointsInSource,
    enableBreakpointsInSource,
    removeBreakpointsInSource,
    contextMenuEvent
  } = props;

  contextMenuEvent.preventDefault();

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
    click: () => disableBreakpointsInSource(cx, source)
  };

  const enableInSourceItem = {
    id: "node-menu-enable-in-source",
    label: enableInSourceLabel,
    accesskey: enableInSourceKey,
    disabled: false,
    click: () => enableBreakpointsInSource(cx, source)
  };

  const removeInSourceItem = {
    id: "node-menu-enable-in-source",
    label: removeInSourceLabel,
    accesskey: removeInSourceKey,
    disabled: false,
    click: () => removeBreakpointsInSource(cx, source)
  };

  const hideDisableInSourceItem = breakpointsForSource.every(breakpoint => breakpoint.disabled);
  const hideEnableInSourceItem = breakpointsForSource.every(breakpoint => !breakpoint.disabled);

  const items = [{ item: disableInSourceItem, hidden: () => hideDisableInSourceItem }, { item: enableInSourceItem, hidden: () => hideEnableInSourceItem }, { item: removeInSourceItem, hidden: () => false }];

  (0, _devtoolsContextmenu.showMenu)(contextMenuEvent, (0, _devtoolsContextmenu.buildMenu)(items));
}