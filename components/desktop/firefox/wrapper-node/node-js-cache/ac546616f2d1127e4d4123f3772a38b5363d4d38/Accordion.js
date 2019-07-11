"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("devtools/client/shared/vendor/react");

var _react2 = _interopRequireDefault(_react);

var _AccessibleImage = require("./AccessibleImage");

var _AccessibleImage2 = _interopRequireDefault(_AccessibleImage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

class Accordion extends _react.Component {
  constructor(props) {
    super(props);

    this.renderContainer = (item, i) => {
      const { opened } = item;

      return _react2.default.createElement(
        "li",
        { className: item.className, key: i },
        _react2.default.createElement(
          "h2",
          {
            className: "_header",
            tabIndex: "0",
            onKeyDown: e => this.onHandleHeaderKeyDown(e, i),
            onClick: () => this.handleHeaderClick(i)
          },
          _react2.default.createElement(_AccessibleImage2.default, { className: `arrow ${opened ? "expanded" : ""}` }),
          _react2.default.createElement(
            "span",
            { className: "header-label" },
            item.header
          ),
          item.buttons ? _react2.default.createElement(
            "div",
            { className: "header-buttons", tabIndex: "-1" },
            item.buttons
          ) : null
        ),
        opened && _react2.default.createElement(
          "div",
          { className: "_content" },
          (0, _react.cloneElement)(item.component, item.componentProps || {})
        )
      );
    };

    this.state = {
      opened: props.items.map(item => item.opened),
      created: []
    };
  }

  handleHeaderClick(i) {
    const item = this.props.items[i];
    const opened = !item.opened;
    item.opened = opened;

    if (item.onToggle) {
      item.onToggle(opened);
    }

    // We force an update because otherwise the accordion
    // would not re-render
    this.forceUpdate();
  }

  onHandleHeaderKeyDown(e, i) {
    if (e && (e.key === " " || e.key === "Enter")) {
      this.handleHeaderClick(i);
    }
  }

  render() {
    return _react2.default.createElement(
      "ul",
      { className: "accordion" },
      this.props.items.map(this.renderContainer)
    );
  }
}

exports.default = Accordion;