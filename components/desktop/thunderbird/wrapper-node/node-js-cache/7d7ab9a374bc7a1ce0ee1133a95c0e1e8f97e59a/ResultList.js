"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _classnames = _interopRequireDefault(require("devtools/client/debugger/dist/vendors").vendored["classnames"]);

var _AccessibleImage = _interopRequireDefault(require("./AccessibleImage"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class ResultList extends _react.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "renderListItem", (item, index) => {
      if (item.value === "/" && item.title === "") {
        item.title = "(index)";
      }

      const {
        selectItem,
        selected
      } = this.props;
      const props = {
        onClick: event => selectItem(event, item, index),
        key: `${item.id}${item.value}${index}`,
        ref: String(index),
        title: item.value,
        "aria-labelledby": `${item.id}-title`,
        "aria-describedby": `${item.id}-subtitle`,
        role: "option",
        className: (0, _classnames.default)("result-item", {
          selected: index === selected
        })
      };
      return _react.default.createElement("li", props, item.icon && _react.default.createElement("div", {
        className: "icon"
      }, _react.default.createElement(_AccessibleImage.default, {
        className: item.icon
      })), _react.default.createElement("div", {
        id: `${item.id}-title`,
        className: "title"
      }, item.title), item.subtitle != item.title ? _react.default.createElement("div", {
        id: `${item.id}-subtitle`,
        className: "subtitle"
      }, item.subtitle) : null);
    });
  }

  render() {
    const {
      size,
      items,
      role
    } = this.props;
    return _react.default.createElement("ul", {
      className: (0, _classnames.default)("result-list", size),
      id: "result-list",
      role: role,
      "aria-live": "polite"
    }, items.map(this.renderListItem));
  }

}

exports.default = ResultList;

_defineProperty(ResultList, "defaultProps", {
  size: "small",
  role: "listbox"
});