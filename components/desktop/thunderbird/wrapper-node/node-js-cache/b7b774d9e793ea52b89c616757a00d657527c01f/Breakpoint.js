"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("devtools/client/shared/vendor/react");

var _react2 = _interopRequireDefault(_react);

var _connect = require("../../../utils/connect");

var _reselect = require("devtools/client/debugger/dist/vendors").vendored["reselect"];

var _classnames = require("devtools/client/debugger/dist/vendors").vendored["classnames"];

var _classnames2 = _interopRequireDefault(_classnames);

var _actions = require("../../../actions/index");

var _actions2 = _interopRequireDefault(_actions);

var _lodash = require("devtools/client/shared/vendor/lodash");

var _BreakpointsContextMenu = require("./BreakpointsContextMenu");

var _BreakpointsContextMenu2 = _interopRequireDefault(_BreakpointsContextMenu);

var _Button = require("../../shared/Button/index");

var _breakpoint = require("../../../utils/breakpoint/index");

var _selectedLocation = require("../../../utils/selected-location");

var _prefs = require("../../../utils/prefs");

var _selectors = require("../../../selectors/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

class Breakpoint extends _react.PureComponent {
  constructor(...args) {
    var _temp;

    return _temp = super(...args), this.onContextMenu = e => {
      (0, _BreakpointsContextMenu2.default)({ ...this.props, contextMenuEvent: e });
    }, this.onDoubleClick = () => {
      const { breakpoint, openConditionalPanel } = this.props;
      if (breakpoint.options.condition) {
        openConditionalPanel(this.selectedLocation);
      } else if (breakpoint.options.logValue) {
        openConditionalPanel(this.selectedLocation, true);
      }
    }, this.selectBreakpoint = event => {
      event.preventDefault();
      const { cx, selectSpecificLocation } = this.props;
      selectSpecificLocation(cx, this.selectedLocation);
    }, this.removeBreakpoint = event => {
      const { cx, removeBreakpoint, breakpoint } = this.props;
      event.stopPropagation();
      removeBreakpoint(cx, breakpoint);
    }, this.handleBreakpointCheckbox = () => {
      const { cx, breakpoint, enableBreakpoint, disableBreakpoint } = this.props;
      if (breakpoint.disabled) {
        enableBreakpoint(cx, breakpoint);
      } else {
        disableBreakpoint(cx, breakpoint);
      }
    }, this.highlightText = (0, _lodash.memoize)((text = "", editor) => {
      const node = document.createElement("div");
      editor.CodeMirror.runMode(text, "application/javascript", node);
      return { __html: node.innerHTML };
    }, text => text), _temp;
  }

  get selectedLocation() {
    const { breakpoint, selectedSource } = this.props;
    return (0, _selectedLocation.getSelectedLocation)(breakpoint, selectedSource);
  }

  isCurrentlyPausedAtBreakpoint() {
    const { frame } = this.props;
    if (!frame) {
      return false;
    }

    const bpId = _prefs.features.columnBreakpoints ? (0, _breakpoint.makeBreakpointId)(this.selectedLocation) : (0, _breakpoint.getLocationWithoutColumn)(this.selectedLocation);
    const frameId = _prefs.features.columnBreakpoints ? (0, _breakpoint.makeBreakpointId)(frame.selectedLocation) : (0, _breakpoint.getLocationWithoutColumn)(frame.selectedLocation);
    return bpId == frameId;
  }

  getBreakpointLocation() {
    const { source } = this.props;
    const { column, line } = this.selectedLocation;

    const isWasm = source && source.isWasm;
    const columnVal = _prefs.features.columnBreakpoints && column ? `:${column}` : "";
    const bpLocation = isWasm ? `0x${line.toString(16).toUpperCase()}` : `${line}${columnVal}`;

    return bpLocation;
  }

  getBreakpointText() {
    const { breakpoint, selectedSource } = this.props;
    const { condition, logValue } = breakpoint.options;
    return logValue || condition || (0, _breakpoint.getSelectedText)(breakpoint, selectedSource);
  }

  render() {
    const { breakpoint, editor } = this.props;
    const text = this.getBreakpointText();
    const labelId = `${breakpoint.id}-label`;

    return _react2.default.createElement(
      "div",
      {
        className: (0, _classnames2.default)({
          breakpoint,
          paused: this.isCurrentlyPausedAtBreakpoint(),
          disabled: breakpoint.disabled,
          "is-conditional": !!breakpoint.options.condition,
          "is-log": !!breakpoint.options.logValue
        }),
        onClick: this.selectBreakpoint,
        onDoubleClick: this.onDoubleClick,
        onContextMenu: this.onContextMenu
      },
      _react2.default.createElement("input", {
        id: breakpoint.id,
        type: "checkbox",
        className: "breakpoint-checkbox",
        checked: !breakpoint.disabled,
        onChange: this.handleBreakpointCheckbox,
        onClick: ev => ev.stopPropagation(),
        "aria-labelledby": labelId
      }),
      _react2.default.createElement(
        "span",
        {
          id: labelId,
          className: "breakpoint-label cm-s-mozilla devtools-monospace",
          onClick: this.selectBreakpoint,
          title: text
        },
        _react2.default.createElement("span", { dangerouslySetInnerHTML: this.highlightText(text, editor) })
      ),
      _react2.default.createElement(
        "div",
        { className: "breakpoint-line-close" },
        _react2.default.createElement(
          "div",
          { className: "breakpoint-line devtools-monospace" },
          this.getBreakpointLocation()
        ),
        _react2.default.createElement(_Button.CloseButton, {
          handleClick: e => this.removeBreakpoint(e),
          tooltip: L10N.getStr("breakpoints.removeBreakpointTooltip")
        })
      )
    );
  }
}

const getFormattedFrame = (0, _reselect.createSelector)(_selectors.getSelectedSource, _selectors.getSelectedFrame, (selectedSource, frame) => {
  if (!frame) {
    return null;
  }

  return {
    ...frame,
    selectedLocation: (0, _selectedLocation.getSelectedLocation)(frame, selectedSource)
  };
});

const mapStateToProps = state => ({
  cx: (0, _selectors.getContext)(state),
  breakpoints: (0, _selectors.getBreakpointsList)(state),
  frame: getFormattedFrame(state, (0, _selectors.getCurrentThread)(state))
});

exports.default = (0, _connect.connect)(mapStateToProps, {
  enableBreakpoint: _actions2.default.enableBreakpoint,
  removeBreakpoint: _actions2.default.removeBreakpoint,
  removeBreakpoints: _actions2.default.removeBreakpoints,
  removeAllBreakpoints: _actions2.default.removeAllBreakpoints,
  disableBreakpoint: _actions2.default.disableBreakpoint,
  selectSpecificLocation: _actions2.default.selectSpecificLocation,
  setBreakpointOptions: _actions2.default.setBreakpointOptions,
  toggleAllBreakpoints: _actions2.default.toggleAllBreakpoints,
  toggleBreakpoints: _actions2.default.toggleBreakpoints,
  toggleDisabledBreakpoint: _actions2.default.toggleDisabledBreakpoint,
  openConditionalPanel: _actions2.default.openConditionalPanel
})(Breakpoint);