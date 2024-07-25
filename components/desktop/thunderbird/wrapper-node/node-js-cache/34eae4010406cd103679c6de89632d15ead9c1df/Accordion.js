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

class Accordion extends _react.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "renderContainer", (item, i) => {
      const {
        opened
      } = item;
      const contentElementId = `${item.id}-content`;
      return (0, _reactDomFactories.aside)({
        className: item.className,
        key: item.id,
        "aria-labelledby": item.id,
        role: item.role
      }, (0, _reactDomFactories.h2)({
        className: "_header"
      }, (0, _reactDomFactories.button)({
        id: item.id,
        className: "header-label",
        "aria-expanded": `${opened ? "true" : "false"}`,
        "aria-controls": opened ? contentElementId : undefined,
        onClick: () => this.handleHeaderClick(i)
      }, item.header), item.buttons ? (0, _reactDomFactories.div)({
        className: "header-buttons"
      }, item.buttons) : null), opened && (0, _reactDomFactories.div)({
        className: "_content",
        id: contentElementId
      }, (0, _react.cloneElement)(item.component, item.componentProps || {})));
    });
  }

  static get propTypes() {
    return {
      items: _reactPropTypes.default.array.isRequired
    };
  }

  handleHeaderClick(i) {
    const item = this.props.items[i];
    const opened = !item.opened;
    item.opened = opened;

    if (item.onToggle) {
      item.onToggle(opened);
    } // We force an update because otherwise the accordion
    // would not re-render


    this.forceUpdate();
  }

  render() {
    return (0, _reactDomFactories.div)({
      className: "accordion"
    }, this.props.items.map(this.renderContainer));
  }

}

var _default = Accordion;
exports.default = _default;