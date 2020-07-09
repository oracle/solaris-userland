"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("devtools/client/shared/vendor/react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class A11yIntention extends _react.default.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "state", {
      keyboard: false
    });

    _defineProperty(this, "handleKeyDown", () => {
      this.setState({
        keyboard: true
      });
    });

    _defineProperty(this, "handleMouseDown", () => {
      this.setState({
        keyboard: false
      });
    });
  }

  render() {
    return _react.default.createElement("div", {
      className: this.state.keyboard ? "A11y-keyboard" : "A11y-mouse",
      onKeyDown: this.handleKeyDown,
      onMouseDown: this.handleMouseDown
    }, this.props.children);
  }

}

exports.default = A11yIntention;