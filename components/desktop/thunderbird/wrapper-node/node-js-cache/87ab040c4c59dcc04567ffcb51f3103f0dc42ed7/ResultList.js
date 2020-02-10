"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("devtools/client/shared/vendor/react");

var _react2 = _interopRequireDefault(_react);

var _classnames = require("devtools/client/debugger/dist/vendors").vendored["classnames"];

var _classnames2 = _interopRequireDefault(_classnames);

var _AccessibleImage = require("./AccessibleImage");

var _AccessibleImage2 = _interopRequireDefault(_AccessibleImage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ResultList extends _react.Component {
  constructor(...args) {
    var _temp;

    return _temp = super(...args), this.renderListItem = (item, index) => {
      if (item.value === "/" && item.title === "") {
        item.title = "(index)";
      }

      const { selectItem, selected } = this.props;
      const props = {
        onClick: event => selectItem(event, item, index),
        key: `${item.id}${item.value}${index}`,
        ref: String(index),
        title: item.value,
        "aria-labelledby": `${item.id}-title`,
        "aria-describedby": `${item.id}-subtitle`,
        role: "option",
        className: (0, _classnames2.default)("result-item", {
          selected: index === selected
        })
      };

      return _react2.default.createElement(
        "li",
        props,
        item.icon && _react2.default.createElement(
          "div",
          { className: "icon" },
          _react2.default.createElement(_AccessibleImage2.default, { className: item.icon })
        ),
        _react2.default.createElement(
          "div",
          { id: `${item.id}-title`, className: "title" },
          item.title
        ),
        item.subtitle != item.title ? _react2.default.createElement(
          "div",
          { id: `${item.id}-subtitle`, className: "subtitle" },
          item.subtitle
        ) : null
      );
    }, _temp;
  }

  render() {
    const { size, items, role } = this.props;

    return _react2.default.createElement(
      "ul",
      {
        className: (0, _classnames2.default)("result-list", size),
        id: "result-list",
        role: role,
        "aria-live": "polite"
      },
      items.map(this.renderListItem)
    );
  }
}
exports.default = ResultList; /* This Source Code Form is subject to the terms of the Mozilla Public
                               * License, v. 2.0. If a copy of the MPL was not distributed with this
                               * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

ResultList.defaultProps = {
  size: "small",
  role: "listbox"
};