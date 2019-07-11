"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("devtools/client/shared/vendor/react");

var _react2 = _interopRequireDefault(_react);

var _classnames = require("devtools/client/debugger/dist/vendors").vendored["classnames"];

var _classnames2 = _interopRequireDefault(_classnames);

var _AccessibleImage = require("../AccessibleImage");

var _AccessibleImage2 = _interopRequireDefault(_AccessibleImage);

var _ = require(".//index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

class PaneToggleButton extends _react.PureComponent {

  label(position, collapsed) {
    switch (position) {
      case "start":
        return L10N.getStr(collapsed ? "expandSources" : "collapseSources");
      case "end":
        return L10N.getStr(collapsed ? "expandBreakpoints" : "collapseBreakpoints");
    }
  }

  render() {
    const { position, collapsed, horizontal, handleClick } = this.props;

    return _react2.default.createElement(
      _.CommandBarButton,
      {
        className: (0, _classnames2.default)("toggle-button", position, {
          collapsed,
          vertical: !horizontal
        }),
        onClick: () => handleClick(position, !collapsed),
        title: this.label(position, collapsed)
      },
      _react2.default.createElement(_AccessibleImage2.default, {
        className: collapsed ? "pane-expand" : "pane-collapse"
      })
    );
  }
}

PaneToggleButton.defaultProps = {
  horizontal: false,
  position: "start"
};
exports.default = PaneToggleButton;