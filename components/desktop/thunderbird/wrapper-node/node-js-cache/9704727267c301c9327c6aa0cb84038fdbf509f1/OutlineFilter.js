"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("devtools/client/shared/vendor/react");

var _reactDomFactories = require("devtools/client/shared/vendor/react-dom-factories");

var _reactPropTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const classnames = require("resource://devtools/client/shared/classnames.js");

class OutlineFilter extends _react.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "state", {
      focused: false
    });

    _defineProperty(this, "setFocus", shouldFocus => {
      this.setState({
        focused: shouldFocus
      });
    });

    _defineProperty(this, "onChange", e => {
      this.props.updateFilter(e.target.value);
    });

    _defineProperty(this, "onKeyDown", e => {
      if (e.key === "Escape" && this.props.filter !== "") {
        // use preventDefault to override toggling the split-console which is
        // also bound to the ESC key
        e.preventDefault();
        this.props.updateFilter("");
      } else if (e.key === "Enter") {
        // We must prevent the form submission from taking any action
        // https://github.com/firefox-devtools/debugger/pull/7308
        e.preventDefault();
      }
    });
  }

  static get propTypes() {
    return {
      filter: _reactPropTypes.default.string.isRequired,
      updateFilter: _reactPropTypes.default.func.isRequired
    };
  }

  render() {
    const {
      focused
    } = this.state;
    return (0, _reactDomFactories.div)({
      className: "outline-filter"
    }, (0, _reactDomFactories.form)(null, (0, _reactDomFactories.input)({
      className: classnames("outline-filter-input devtools-filterinput", {
        focused
      }),
      onFocus: () => this.setFocus(true),
      onBlur: () => this.setFocus(false),
      placeholder: L10N.getStr("outline.placeholder"),
      value: this.props.filter,
      type: "text",
      onChange: this.onChange,
      onKeyDown: this.onKeyDown
    })));
  }

}

exports.default = OutlineFilter;