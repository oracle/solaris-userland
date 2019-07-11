"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("devtools/client/shared/vendor/react");

var _react2 = _interopRequireDefault(_react);

var _connect = require("../../../utils/connect");

var _actions = require("../../../actions/index");

var _actions2 = _interopRequireDefault(_actions);

var _source = require("../../../utils/source");

var _selectors = require("../../../selectors/index");

var _SourceIcon = require("../../shared/SourceIcon");

var _SourceIcon2 = _interopRequireDefault(_SourceIcon);

var _BreakpointHeadingsContextMenu = require("./BreakpointHeadingsContextMenu");

var _BreakpointHeadingsContextMenu2 = _interopRequireDefault(_BreakpointHeadingsContextMenu);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class BreakpointHeading extends _react.PureComponent {
  constructor(...args) {
    var _temp;

    return _temp = super(...args), this.onContextMenu = e => {
      (0, _BreakpointHeadingsContextMenu2.default)({ ...this.props, contextMenuEvent: e });
    }, _temp;
  }

  render() {
    const {
      cx,
      sources,
      source,
      hasSiblingOfSameName,
      selectSource
    } = this.props;

    const path = (0, _source.getDisplayPath)(source, sources);
    const query = hasSiblingOfSameName ? (0, _source.getSourceQueryString)(source) : "";

    return _react2.default.createElement(
      "div",
      {
        className: "breakpoint-heading",
        title: (0, _source.getFileURL)(source, false),
        onClick: () => selectSource(cx, source.id),
        onContextMenu: this.onContextMenu
      },
      _react2.default.createElement(_SourceIcon2.default, {
        source: source,
        shouldHide: icon => ["file", "javascript"].includes(icon)
      }),
      _react2.default.createElement(
        "div",
        { className: "filename" },
        (0, _source.getTruncatedFileName)(source, query),
        path && _react2.default.createElement(
          "span",
          null,
          `../${path}/..`
        )
      )
    );
  }
} /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

const mapStateToProps = (state, { source }) => ({
  cx: (0, _selectors.getContext)(state),
  hasSiblingOfSameName: (0, _selectors.getHasSiblingOfSameName)(state, source),
  breakpointsForSource: (0, _selectors.getBreakpointsForSource)(state, source.id)
});

exports.default = (0, _connect.connect)(mapStateToProps, {
  selectSource: _actions2.default.selectSource,
  enableBreakpointsInSource: _actions2.default.enableBreakpointsInSource,
  disableBreakpointsInSource: _actions2.default.disableBreakpointsInSource,
  removeBreakpointsInSource: _actions2.default.removeBreakpointsInSource
})(BreakpointHeading);