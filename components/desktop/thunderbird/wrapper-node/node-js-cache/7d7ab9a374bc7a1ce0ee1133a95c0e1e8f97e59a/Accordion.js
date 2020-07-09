"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _AccessibleImage = _interopRequireDefault(require("./AccessibleImage"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Accordion extends _react.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "renderContainer", (item, i) => {
      const {
        opened
      } = item;
      return _react.default.createElement("li", {
        className: item.className,
        key: i
      }, _react.default.createElement("h2", {
        className: "_header",
        tabIndex: "0",
        onKeyDown: e => this.onHandleHeaderKeyDown(e, i),
        onClick: () => this.handleHeaderClick(i)
      }, _react.default.createElement(_AccessibleImage.default, {
        className: `arrow ${opened ? "expanded" : ""}`
      }), _react.default.createElement("span", {
        className: "header-label"
      }, item.header), item.buttons ? _react.default.createElement("div", {
        className: "header-buttons",
        tabIndex: "-1"
      }, item.buttons) : null), opened && _react.default.createElement("div", {
        className: "_content"
      }, (0, _react.cloneElement)(item.component, item.componentProps || {})));
    });
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

  onHandleHeaderKeyDown(e, i) {
    if (e && (e.key === " " || e.key === "Enter")) {
      this.handleHeaderClick(i);
    }
  }

  render() {
    return _react.default.createElement("ul", {
      className: "accordion"
    }, this.props.items.map(this.renderContainer));
  }

}

var _default = Accordion;
exports.default = _default;