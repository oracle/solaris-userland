"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Slide;
exports.Modal = exports.transitionTimeout = void 0;

var _propTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

var _react = _interopRequireDefault(require("devtools/client/shared/vendor/react"));

var _classnames = _interopRequireDefault(require("devtools/client/debugger/dist/vendors").vendored["classnames"]);

var _Transition = _interopRequireDefault(require("devtools/client/debugger/dist/vendors").vendored["react-transition-group/Transition"]);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const transitionTimeout = 50;
exports.transitionTimeout = transitionTimeout;

class Modal extends _react.default.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "onClick", e => {
      e.stopPropagation();
    });
  }

  render() {
    const {
      additionalClass,
      children,
      handleClose,
      status
    } = this.props;
    return _react.default.createElement("div", {
      className: "modal-wrapper",
      onClick: handleClose
    }, _react.default.createElement("div", {
      className: (0, _classnames.default)("modal", additionalClass, status),
      onClick: this.onClick
    }, children));
  }

}

exports.Modal = Modal;
Modal.contextTypes = {
  shortcuts: _propTypes.default.object
};

function Slide({
  in: inProp,
  children,
  additionalClass,
  handleClose
}) {
  return _react.default.createElement(_Transition.default, {
    in: inProp,
    timeout: transitionTimeout,
    appear: true
  }, status => _react.default.createElement(Modal, {
    status: status,
    additionalClass: additionalClass,
    handleClose: handleClose
  }, children));
}