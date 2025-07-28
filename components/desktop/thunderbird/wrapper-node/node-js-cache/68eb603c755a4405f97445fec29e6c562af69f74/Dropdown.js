"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Dropdown = void 0;

var _react = require("devtools/client/shared/vendor/react");

var _reactDomFactories = require("devtools/client/shared/vendor/react-dom-factories");

var _reactPropTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Dropdown extends _react.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "toggleDropdown", () => {
      this.setState(prevState => ({
        dropdownShown: !prevState.dropdownShown
      }));
    });

    this.state = {
      dropdownShown: false
    };
  }

  static get propTypes() {
    return {
      icon: _reactPropTypes.default.node.isRequired,
      panel: _reactPropTypes.default.node.isRequired
    };
  }

  renderPanel() {
    return (0, _reactDomFactories.div)({
      className: "dropdown",
      onClick: this.toggleDropdown,
      style: {
        display: this.state.dropdownShown ? "block" : "none"
      }
    }, this.props.panel);
  }

  renderButton() {
    return (0, _reactDomFactories.button)({
      className: "dropdown-button",
      onClick: this.toggleDropdown
    }, this.props.icon);
  }

  renderMask() {
    return (0, _reactDomFactories.div)({
      className: "dropdown-mask",
      onClick: this.toggleDropdown,
      style: {
        display: this.state.dropdownShown ? "block" : "none"
      }
    });
  }

  render() {
    return (0, _reactDomFactories.div)({
      className: "dropdown-block"
    }, this.renderPanel(), this.renderButton(), this.renderMask());
  }

}

exports.Dropdown = Dropdown;
var _default = Dropdown;
exports.default = _default;