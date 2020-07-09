"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.breakpointItems = breakpointItems;
exports.createBreakpointItems = createBreakpointItems;
exports.breakpointItemActions = breakpointItemActions;
exports.disableBreakpointsOnLineItem = exports.enableBreakpointsOnLineItem = exports.removeBreakpointsOnLineItem = exports.toggleDbgStatementItem = exports.toggleDisabledBreakpointItem = exports.logPointItem = exports.editLogPointItem = exports.addLogPointItem = exports.conditionalBreakpointItem = exports.editConditionalBreakpointItem = exports.addConditionalBreakpointItem = exports.removeBreakpointItem = exports.addBreakpointItem = void 0;

var _actions = _interopRequireDefault(require("../../../actions/index"));

var _redux = require("devtools/client/shared/vendor/redux");

loader.lazyRequireGetter(this, "_prefs", "devtools/client/debugger/src/utils/prefs");
loader.lazyRequireGetter(this, "_text", "devtools/client/debugger/src/utils/text");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
const addBreakpointItem = (cx, location, breakpointActions) => ({
  id: "node-menu-add-breakpoint",
  label: L10N.getStr("editor.addBreakpoint"),
  accesskey: L10N.getStr("shortcuts.toggleBreakpoint.accesskey"),
  disabled: false,
  click: () => breakpointActions.addBreakpoint(cx, location),
  accelerator: (0, _text.formatKeyShortcut)(L10N.getStr("toggleBreakpoint.key"))
});

exports.addBreakpointItem = addBreakpointItem;

const removeBreakpointItem = (cx, breakpoint, breakpointActions) => ({
  id: "node-menu-remove-breakpoint",
  label: L10N.getStr("editor.removeBreakpoint"),
  accesskey: L10N.getStr("shortcuts.toggleBreakpoint.accesskey"),
  disabled: false,
  click: () => breakpointActions.removeBreakpoint(cx, breakpoint),
  accelerator: (0, _text.formatKeyShortcut)(L10N.getStr("toggleBreakpoint.key"))
});

exports.removeBreakpointItem = removeBreakpointItem;

const addConditionalBreakpointItem = (location, breakpointActions) => ({
  id: "node-menu-add-conditional-breakpoint",
  label: L10N.getStr("editor.addConditionBreakpoint"),
  accelerator: (0, _text.formatKeyShortcut)(L10N.getStr("toggleCondPanel.breakpoint.key")),
  accesskey: L10N.getStr("editor.addConditionBreakpoint.accesskey"),
  disabled: false,
  click: () => breakpointActions.openConditionalPanel(location)
});

exports.addConditionalBreakpointItem = addConditionalBreakpointItem;

const editConditionalBreakpointItem = (location, breakpointActions) => ({
  id: "node-menu-edit-conditional-breakpoint",
  label: L10N.getStr("editor.editConditionBreakpoint"),
  accelerator: (0, _text.formatKeyShortcut)(L10N.getStr("toggleCondPanel.breakpoint.key")),
  accesskey: L10N.getStr("editor.addConditionBreakpoint.accesskey"),
  disabled: false,
  click: () => breakpointActions.openConditionalPanel(location)
});

exports.editConditionalBreakpointItem = editConditionalBreakpointItem;

const conditionalBreakpointItem = (breakpoint, location, breakpointActions) => {
  const {
    options: {
      condition
    }
  } = breakpoint;
  return condition ? editConditionalBreakpointItem(location, breakpointActions) : addConditionalBreakpointItem(location, breakpointActions);
};

exports.conditionalBreakpointItem = conditionalBreakpointItem;

const addLogPointItem = (location, breakpointActions) => ({
  id: "node-menu-add-log-point",
  label: L10N.getStr("editor.addLogPoint"),
  accesskey: L10N.getStr("editor.addLogPoint.accesskey"),
  disabled: false,
  click: () => breakpointActions.openConditionalPanel(location, true),
  accelerator: (0, _text.formatKeyShortcut)(L10N.getStr("toggleCondPanel.logPoint.key"))
});

exports.addLogPointItem = addLogPointItem;

const editLogPointItem = (location, breakpointActions) => ({
  id: "node-menu-edit-log-point",
  label: L10N.getStr("editor.editLogPoint"),
  accesskey: L10N.getStr("editor.editLogPoint.accesskey"),
  disabled: false,
  click: () => breakpointActions.openConditionalPanel(location, true),
  accelerator: (0, _text.formatKeyShortcut)(L10N.getStr("toggleCondPanel.logPoint.key"))
});

exports.editLogPointItem = editLogPointItem;

const logPointItem = (breakpoint, location, breakpointActions) => {
  const {
    options: {
      logValue
    }
  } = breakpoint;
  return logValue ? editLogPointItem(location, breakpointActions) : addLogPointItem(location, breakpointActions);
};

exports.logPointItem = logPointItem;

const toggleDisabledBreakpointItem = (cx, breakpoint, breakpointActions) => {
  return {
    accesskey: L10N.getStr("editor.disableBreakpoint.accesskey"),
    disabled: false,
    click: () => breakpointActions.toggleDisabledBreakpoint(cx, breakpoint),
    ...(breakpoint.disabled ? {
      id: "node-menu-enable-breakpoint",
      label: L10N.getStr("editor.enableBreakpoint")
    } : {
      id: "node-menu-disable-breakpoint",
      label: L10N.getStr("editor.disableBreakpoint")
    })
  };
};

exports.toggleDisabledBreakpointItem = toggleDisabledBreakpointItem;

const toggleDbgStatementItem = (cx, location, breakpointActions, breakpoint) => {
  if (breakpoint && breakpoint.options.condition === "false") {
    return {
      disabled: false,
      id: "node-menu-enable-dbgStatement",
      label: L10N.getStr("breakpointMenuItem.enabledbg.label"),
      click: () => breakpointActions.setBreakpointOptions(cx, location, { ...breakpoint.options,
        condition: null
      })
    };
  }

  return {
    disabled: false,
    id: "node-menu-disable-dbgStatement",
    label: L10N.getStr("breakpointMenuItem.disabledbg.label"),
    click: () => breakpointActions.setBreakpointOptions(cx, location, {
      condition: "false"
    })
  };
};

exports.toggleDbgStatementItem = toggleDbgStatementItem;

function breakpointItems(cx, breakpoint, selectedLocation, breakpointActions) {
  const items = [removeBreakpointItem(cx, breakpoint, breakpointActions), toggleDisabledBreakpointItem(cx, breakpoint, breakpointActions)];

  if (breakpoint.originalText.startsWith("debugger")) {
    items.push({
      type: "separator"
    }, toggleDbgStatementItem(cx, selectedLocation, breakpointActions, breakpoint));
  }

  items.push({
    type: "separator"
  }, removeBreakpointsOnLineItem(cx, selectedLocation, breakpointActions), breakpoint.disabled ? enableBreakpointsOnLineItem(cx, selectedLocation, breakpointActions) : disableBreakpointsOnLineItem(cx, selectedLocation, breakpointActions), {
    type: "separator"
  });
  items.push(conditionalBreakpointItem(breakpoint, selectedLocation, breakpointActions));
  items.push(logPointItem(breakpoint, selectedLocation, breakpointActions));
  return items;
}

function createBreakpointItems(cx, location, breakpointActions, lineText) {
  const items = [addBreakpointItem(cx, location, breakpointActions), addConditionalBreakpointItem(location, breakpointActions)];

  if (_prefs.features.logPoints) {
    items.push(addLogPointItem(location, breakpointActions));
  }

  if (lineText && lineText.startsWith("debugger")) {
    items.push(toggleDbgStatementItem(cx, location, breakpointActions));
  }

  return items;
} // ToDo: Only enable if there are more than one breakpoints on a line?


const removeBreakpointsOnLineItem = (cx, location, breakpointActions) => ({
  id: "node-menu-remove-breakpoints-on-line",
  label: L10N.getStr("breakpointMenuItem.removeAllAtLine.label"),
  accesskey: L10N.getStr("breakpointMenuItem.removeAllAtLine.accesskey"),
  disabled: false,
  click: () => breakpointActions.removeBreakpointsAtLine(cx, location.sourceId, location.line)
});

exports.removeBreakpointsOnLineItem = removeBreakpointsOnLineItem;

const enableBreakpointsOnLineItem = (cx, location, breakpointActions) => ({
  id: "node-menu-remove-breakpoints-on-line",
  label: L10N.getStr("breakpointMenuItem.enableAllAtLine.label"),
  accesskey: L10N.getStr("breakpointMenuItem.enableAllAtLine.accesskey"),
  disabled: false,
  click: () => breakpointActions.enableBreakpointsAtLine(cx, location.sourceId, location.line)
});

exports.enableBreakpointsOnLineItem = enableBreakpointsOnLineItem;

const disableBreakpointsOnLineItem = (cx, location, breakpointActions) => ({
  id: "node-menu-remove-breakpoints-on-line",
  label: L10N.getStr("breakpointMenuItem.disableAllAtLine.label"),
  accesskey: L10N.getStr("breakpointMenuItem.disableAllAtLine.accesskey"),
  disabled: false,
  click: () => breakpointActions.disableBreakpointsAtLine(cx, location.sourceId, location.line)
});

exports.disableBreakpointsOnLineItem = disableBreakpointsOnLineItem;

function breakpointItemActions(dispatch) {
  return (0, _redux.bindActionCreators)({
    addBreakpoint: _actions.default.addBreakpoint,
    removeBreakpoint: _actions.default.removeBreakpoint,
    removeBreakpointsAtLine: _actions.default.removeBreakpointsAtLine,
    enableBreakpointsAtLine: _actions.default.enableBreakpointsAtLine,
    disableBreakpointsAtLine: _actions.default.disableBreakpointsAtLine,
    disableBreakpoint: _actions.default.disableBreakpoint,
    toggleDisabledBreakpoint: _actions.default.toggleDisabledBreakpoint,
    toggleBreakpointsAtLine: _actions.default.toggleBreakpointsAtLine,
    setBreakpointOptions: _actions.default.setBreakpointOptions,
    openConditionalPanel: _actions.default.openConditionalPanel
  }, dispatch);
}