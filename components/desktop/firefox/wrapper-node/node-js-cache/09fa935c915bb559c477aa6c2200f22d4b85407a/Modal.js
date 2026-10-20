"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactPropTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

var _react = _interopRequireDefault(require("devtools/client/shared/vendor/react"));

var _reactDomFactories = require("devtools/client/shared/vendor/react-dom-factories");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const classnames = require("resource://devtools/client/shared/classnames.js");

class Modal extends _react.default.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "onClick", e => {
      e.stopPropagation();
    });
  }

  static get propTypes() {
    return {
      additionalClass: _reactPropTypes.default.string,
      children: _reactPropTypes.default.node.isRequired,
      handleClose: _reactPropTypes.default.func.isRequired
    };
  }

  render() {
    const {
      additionalClass,
      children,
      handleClose
    } = this.props;
    return (0, _reactDomFactories.div)({
      className: "modal-wrapper",
      onClick: handleClose
    }, (0, _reactDomFactories.div)({
      className: classnames("modal", additionalClass),
      onClick: this.onClick
    }, children));
  }

}

Modal.contextTypes = {
  shortcuts: _reactPropTypes.default.object
};
var _default = Modal;
exports.default = _default;