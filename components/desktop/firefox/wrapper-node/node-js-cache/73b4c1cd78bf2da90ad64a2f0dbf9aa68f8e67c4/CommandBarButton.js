"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.debugBtn = debugBtn;
exports.default = void 0;

var _classnames = _interopRequireDefault(require("devtools/client/debugger/dist/vendors").vendored["classnames"]);

var _react = _interopRequireDefault(require("devtools/client/shared/vendor/react"));

var _AccessibleImage = _interopRequireDefault(require("../AccessibleImage"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function debugBtn(onClick, type, className, tooltip, disabled = false, ariaPressed = false) {
  return _react.default.createElement(CommandBarButton, {
    className: (0, _classnames.default)(type, className),
    disabled: disabled,
    key: type,
    onClick: onClick,
    pressed: ariaPressed,
    title: tooltip
  }, _react.default.createElement(_AccessibleImage.default, {
    className: type
  }));
}

const CommandBarButton = props => {
  const {
    children,
    className,
    pressed = false,
    ...rest
  } = props;
  return _react.default.createElement("button", _extends({
    "aria-pressed": pressed,
    className: (0, _classnames.default)("command-bar-button", className)
  }, rest), children);
};

var _default = CommandBarButton;
exports.default = _default;