"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _reactDomFactories = require("devtools/client/shared/vendor/react-dom-factories");

var _reactPropTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

var _AccessibleImage = _interopRequireDefault(require("./AccessibleImage"));

loader.lazyRequireGetter(this, "_resultList", "devtools/client/debugger/src/utils/result-list");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const classnames = require("resource://devtools/client/shared/classnames.js");

class ResultList extends _react.Component {
  static get propTypes() {
    return {
      items: _reactPropTypes.default.array.isRequired,
      role: _reactPropTypes.default.oneOf(["listbox"]),
      selectItem: _reactPropTypes.default.func.isRequired,
      selected: _reactPropTypes.default.number.isRequired,
      size: _reactPropTypes.default.oneOf(["big", "small"])
    };
  }

  constructor(_props) {
    super(_props);

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
        title: item.value,
        "aria-labelledby": `${item.id}-title`,
        "aria-describedby": `${item.id}-subtitle`,
        role: "option",
        className: classnames("result-item", {
          selected: index === selected
        })
      };
      return (0, _reactDomFactories.li)(props, item.icon && (0, _reactDomFactories.div)({
        className: "icon"
      }, _react.default.createElement(_AccessibleImage.default, {
        className: item.icon
      })), (0, _reactDomFactories.div)({
        id: `${item.id}-title`,
        className: "title"
      }, item.title), item.subtitle != item.title ? (0, _reactDomFactories.div)({
        id: `${item.id}-subtitle`,
        className: "subtitle"
      }, item.subtitle) : null);
    });

    this.ref = _react.default.createRef();
  }

  componentDidUpdate() {
    if (this.ref.current.childNodes) {
      (0, _resultList.scrollList)(this.ref.current.childNodes, this.props.selected);
    }
  }

  render() {
    const {
      size,
      items,
      role
    } = this.props;
    return (0, _reactDomFactories.ul)({
      ref: this.ref,
      className: classnames("result-list", size),
      id: "result-list",
      role,
      "aria-live": "polite"
    }, items.map(this.renderListItem));
  }

}

exports.default = ResultList;

_defineProperty(ResultList, "defaultProps", {
  size: "small",
  role: "listbox"
});