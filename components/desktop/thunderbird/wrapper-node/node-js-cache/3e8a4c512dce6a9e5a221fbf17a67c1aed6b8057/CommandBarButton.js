"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /* This Source Code Form is subject to the terms of the Mozilla Public
                                                                                                                                                                                                                                                                   * License, v. 2.0. If a copy of the MPL was not distributed with this
                                                                                                                                                                                                                                                                   * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

exports.debugBtn = debugBtn;

var _classnames = require("devtools/client/debugger/dist/vendors").vendored["classnames"];

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require("devtools/client/shared/vendor/react");

var _react2 = _interopRequireDefault(_react);

var _AccessibleImage = require("../AccessibleImage");

var _AccessibleImage2 = _interopRequireDefault(_AccessibleImage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function debugBtn(onClick, type, className, tooltip, disabled = false, ariaPressed = false) {
  return _react2.default.createElement(
    CommandBarButton,
    {
      className: (0, _classnames2.default)(type, className),
      disabled: disabled,
      key: type,
      onClick: onClick,
      pressed: ariaPressed,
      title: tooltip
    },
    _react2.default.createElement(_AccessibleImage2.default, { className: type })
  );
}

const CommandBarButton = props => {
  const { children, className, pressed = false, ...rest } = props;

  return _react2.default.createElement(
    "button",
    _extends({
      "aria-pressed": pressed,
      className: (0, _classnames2.default)("command-bar-button", className)
    }, rest),
    children
  );
};

exports.default = CommandBarButton;