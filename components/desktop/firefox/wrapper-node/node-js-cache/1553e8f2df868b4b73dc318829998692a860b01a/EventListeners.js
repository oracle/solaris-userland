"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("devtools/client/shared/vendor/react");

var _react2 = _interopRequireDefault(_react);

var _classnames = require("devtools/client/debugger/dist/vendors").vendored["classnames"];

var _classnames2 = _interopRequireDefault(_classnames);

var _connect = require("../../utils/connect");

var _actions = require("../../actions/index");

var _actions2 = _interopRequireDefault(_actions);

var _selectors = require("../../selectors/index");

var _AccessibleImage = require("../shared/AccessibleImage");

var _AccessibleImage2 = _interopRequireDefault(_AccessibleImage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

const CATEGORIES = {
  Mouse: ["click", "mouseover", "dblclick"],
  Keyboard: ["keyup", "keydown"]
};

function getKey(category, eventType) {
  return `${category}:${eventType}`;
}

class EventListeners extends _react.Component {
  constructor(props) {
    super(props);

    this.state = {
      expandedCategories: []
    };
  }

  onCategoryToggle(category, event) {
    const { expandedCategories } = this.state;

    if (expandedCategories.includes(category)) {
      this.setState({
        expandedCategories: expandedCategories.filter(eventCategory => eventCategory !== category)
      });
    } else {
      this.setState({
        expandedCategories: [...expandedCategories, category]
      });
    }
  }

  onCategoryClick(category, isChecked) {
    const { addEventListeners, removeEventListeners } = this.props;
    const events = CATEGORIES[category].map(eventType => getKey(category, eventType));

    if (isChecked) {
      addEventListeners(events);
    } else {
      removeEventListeners(events);
    }
  }

  onEventTypeClick(eventType, isChecked) {
    const { addEventListeners, removeEventListeners } = this.props;
    if (isChecked) {
      addEventListeners([eventType]);
    } else {
      removeEventListeners([eventType]);
    }
  }

  renderCategoryHeading(category) {
    const { expandedCategories } = this.state;
    const { activeEventListeners } = this.props;

    const eventTypes = CATEGORIES[category];

    const expanded = expandedCategories.includes(category);
    const checked = eventTypes.every(eventType => activeEventListeners.includes(getKey(category, eventType)));
    const indeterminate = !checked && eventTypes.some(eventType => activeEventListeners.includes(getKey(category, eventType)));

    return _react2.default.createElement(
      "div",
      { className: "event-listener-header" },
      _react2.default.createElement(
        "button",
        {
          className: "event-listener-expand",
          onClick: e => this.onCategoryToggle(category, e)
        },
        _react2.default.createElement(_AccessibleImage2.default, { className: (0, _classnames2.default)("arrow", { expanded }) })
      ),
      _react2.default.createElement(
        "label",
        { className: "event-listener-label" },
        _react2.default.createElement("input", {
          type: "checkbox",
          value: category,
          onChange: e => this.onCategoryClick(category, e.target.checked),
          checked: checked,
          ref: el => el && (el.indeterminate = indeterminate)
        }),
        _react2.default.createElement(
          "span",
          { className: "event-listener-category" },
          category
        )
      )
    );
  }

  renderCategoryListing(category) {
    const { activeEventListeners } = this.props;
    const { expandedCategories } = this.state;

    const expanded = expandedCategories.includes(category);
    if (!expanded) {
      return null;
    }

    return _react2.default.createElement(
      "ul",
      null,
      CATEGORIES[category].map(eventType => {
        const key = getKey(category, eventType);
        return _react2.default.createElement(
          "li",
          { className: "event-listener-event", key: key },
          _react2.default.createElement(
            "label",
            { className: "event-listener-label" },
            _react2.default.createElement("input", {
              type: "checkbox",
              value: key,
              onChange: e => this.onEventTypeClick(key, e.target.checked),
              checked: activeEventListeners.includes(key)
            }),
            _react2.default.createElement(
              "span",
              { className: "event-listener-name" },
              eventType
            )
          )
        );
      })
    );
  }

  render() {
    return _react2.default.createElement(
      "div",
      { className: "event-listeners-content" },
      _react2.default.createElement(
        "ul",
        { className: "event-listeners-list" },
        Object.keys(CATEGORIES).map(category => {
          return _react2.default.createElement(
            "li",
            { className: "event-listener-group", key: category },
            this.renderCategoryHeading(category),
            this.renderCategoryListing(category)
          );
        })
      )
    );
  }
}

const mapStateToProps = state => ({
  activeEventListeners: (0, _selectors.getActiveEventListeners)(state)
});

exports.default = (0, _connect.connect)(mapStateToProps, {
  addEventListeners: _actions2.default.addEventListeners,
  removeEventListeners: _actions2.default.removeEventListeners
})(EventListeners);