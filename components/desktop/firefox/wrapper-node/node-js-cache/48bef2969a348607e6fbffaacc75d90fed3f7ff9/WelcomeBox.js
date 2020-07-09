"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.WelcomeBox = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

loader.lazyRequireGetter(this, "_connect", "devtools/client/debugger/src/utils/connect");

var _actions = _interopRequireDefault(require("../actions/index"));

loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_text", "devtools/client/debugger/src/utils/text");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
class WelcomeBox extends _react.Component {
  render() {
    const searchSourcesShortcut = (0, _text.formatKeyShortcut)(L10N.getStr("sources.search.key2"));
    const searchProjectShortcut = (0, _text.formatKeyShortcut)(L10N.getStr("projectTextSearch.key"));
    const allShortcutsShortcut = (0, _text.formatKeyShortcut)(L10N.getStr("allShortcut.key"));
    const allShortcutsLabel = L10N.getStr("welcome.allShortcuts");
    const searchSourcesLabel = L10N.getStr("welcome.search2").substring(2);
    const searchProjectLabel = L10N.getStr("welcome.findInFiles2").substring(2);
    const {
      setActiveSearch,
      openQuickOpen,
      toggleShortcutsModal
    } = this.props;
    return _react.default.createElement("div", {
      className: "welcomebox"
    }, _react.default.createElement("div", {
      className: "alignlabel"
    }, _react.default.createElement("div", {
      className: "shortcutFunction"
    }, _react.default.createElement("p", {
      className: "welcomebox__searchSources",
      role: "button",
      tabIndex: "0",
      onClick: () => openQuickOpen()
    }, _react.default.createElement("span", {
      className: "shortcutKey"
    }, searchSourcesShortcut), _react.default.createElement("span", {
      className: "shortcutLabel"
    }, searchSourcesLabel)), _react.default.createElement("p", {
      className: "welcomebox__searchProject",
      role: "button",
      tabIndex: "0",
      onClick: setActiveSearch.bind(null, "project")
    }, _react.default.createElement("span", {
      className: "shortcutKey"
    }, searchProjectShortcut), _react.default.createElement("span", {
      className: "shortcutLabel"
    }, searchProjectLabel)), _react.default.createElement("p", {
      className: "welcomebox__allShortcuts",
      role: "button",
      tabIndex: "0",
      onClick: () => toggleShortcutsModal()
    }, _react.default.createElement("span", {
      className: "shortcutKey"
    }, allShortcutsShortcut), _react.default.createElement("span", {
      className: "shortcutLabel"
    }, allShortcutsLabel)))));
  }

}

exports.WelcomeBox = WelcomeBox;

const mapStateToProps = state => ({
  endPanelCollapsed: (0, _selectors.getPaneCollapse)(state, "end")
});

var _default = (0, _connect.connect)(mapStateToProps, {
  togglePaneCollapse: _actions.default.togglePaneCollapse,
  setActiveSearch: _actions.default.setActiveSearch,
  openQuickOpen: _actions.default.openQuickOpen
})(WelcomeBox);

exports.default = _default;