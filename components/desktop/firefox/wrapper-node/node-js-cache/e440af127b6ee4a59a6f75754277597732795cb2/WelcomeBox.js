"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WelcomeBox = undefined;

var _react = require("devtools/client/shared/vendor/react");

var _react2 = _interopRequireDefault(_react);

var _connect = require("../utils/connect");

var _actions = require("../actions/index");

var _actions2 = _interopRequireDefault(_actions);

var _selectors = require("../selectors/index");

var _text = require("../utils/text");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class WelcomeBox extends _react.Component {
  render() {
    const searchSourcesShortcut = (0, _text.formatKeyShortcut)(L10N.getStr("sources.search.key2"));

    const searchProjectShortcut = (0, _text.formatKeyShortcut)(L10N.getStr("projectTextSearch.key"));

    const allShortcutsShortcut = (0, _text.formatKeyShortcut)(L10N.getStr("allShortcut.key"));

    const allShortcutsLabel = L10N.getStr("welcome.allShortcuts");
    const searchSourcesLabel = L10N.getStr("welcome.search2").substring(2);
    const searchProjectLabel = L10N.getStr("welcome.findInFiles2").substring(2);
    const { setActiveSearch, openQuickOpen, toggleShortcutsModal } = this.props;

    return _react2.default.createElement(
      "div",
      { className: "welcomebox" },
      _react2.default.createElement(
        "div",
        { className: "alignlabel" },
        _react2.default.createElement(
          "div",
          { className: "shortcutFunction" },
          _react2.default.createElement(
            "p",
            {
              className: "welcomebox__searchSources",
              role: "button",
              tabIndex: "0",
              onClick: () => openQuickOpen()
            },
            _react2.default.createElement(
              "span",
              { className: "shortcutKey" },
              searchSourcesShortcut
            ),
            _react2.default.createElement(
              "span",
              { className: "shortcutLabel" },
              searchSourcesLabel
            )
          ),
          _react2.default.createElement(
            "p",
            {
              className: "welcomebox__searchProject",
              role: "button",
              tabIndex: "0",
              onClick: setActiveSearch.bind(null, "project")
            },
            _react2.default.createElement(
              "span",
              { className: "shortcutKey" },
              searchProjectShortcut
            ),
            _react2.default.createElement(
              "span",
              { className: "shortcutLabel" },
              searchProjectLabel
            )
          ),
          _react2.default.createElement(
            "p",
            {
              className: "welcomebox__allShortcuts",
              role: "button",
              tabIndex: "0",
              onClick: () => toggleShortcutsModal()
            },
            _react2.default.createElement(
              "span",
              { className: "shortcutKey" },
              allShortcutsShortcut
            ),
            _react2.default.createElement(
              "span",
              { className: "shortcutLabel" },
              allShortcutsLabel
            )
          )
        )
      )
    );
  }
}

exports.WelcomeBox = WelcomeBox; /* This Source Code Form is subject to the terms of the Mozilla Public
                                  * License, v. 2.0. If a copy of the MPL was not distributed with this
                                  * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

const mapStateToProps = state => ({
  endPanelCollapsed: (0, _selectors.getPaneCollapse)(state, "end")
});

exports.default = (0, _connect.connect)(mapStateToProps, {
  togglePaneCollapse: _actions2.default.togglePaneCollapse,
  setActiveSearch: _actions2.default.setActiveSearch,
  openQuickOpen: _actions2.default.openQuickOpen
})(WelcomeBox);