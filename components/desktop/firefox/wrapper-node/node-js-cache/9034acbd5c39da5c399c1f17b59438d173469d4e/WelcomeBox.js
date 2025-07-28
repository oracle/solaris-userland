"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.WelcomeBox = void 0;

var _react = require("devtools/client/shared/vendor/react");

var _reactDomFactories = require("devtools/client/shared/vendor/react-dom-factories");

var _reactPropTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

var _reactRedux = require("devtools/client/shared/vendor/react-redux");

loader.lazyRequireGetter(this, "_constants", "devtools/client/debugger/src/constants");

var _index = _interopRequireDefault(require("../actions/index"));

loader.lazyRequireGetter(this, "_index2", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_text", "devtools/client/debugger/src/utils/text");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
class WelcomeBox extends _react.Component {
  static get propTypes() {
    return {
      openQuickOpen: _reactPropTypes.default.func.isRequired,
      setActiveSearch: _reactPropTypes.default.func.isRequired,
      toggleShortcutsModal: _reactPropTypes.default.func.isRequired,
      setPrimaryPaneTab: _reactPropTypes.default.func.isRequired
    };
  }

  render() {
    const searchSourcesShortcut = (0, _text.formatKeyShortcut)(L10N.getStr("sources.search.key2"));
    const searchProjectShortcut = (0, _text.formatKeyShortcut)(L10N.getStr("projectTextSearch.key"));
    const allShortcutsShortcut = (0, _text.formatKeyShortcut)(L10N.getStr("allShortcut.key"));
    const allShortcutsLabel = L10N.getStr("welcome.allShortcuts");
    const searchSourcesLabel = L10N.getStr("welcome.search2").substring(2);
    const searchProjectLabel = L10N.getStr("welcome.findInFiles2").substring(2);
    return (0, _reactDomFactories.div)({
      className: "welcomebox"
    }, (0, _reactDomFactories.div)({
      className: "alignlabel"
    }, (0, _reactDomFactories.div)({
      className: "shortcutFunction"
    }, (0, _reactDomFactories.p)({
      className: "welcomebox__searchSources",
      role: "button",
      tabIndex: "0",
      onClick: () => this.props.openQuickOpen()
    }, (0, _reactDomFactories.span)({
      className: "shortcutKey"
    }, searchSourcesShortcut), (0, _reactDomFactories.span)({
      className: "shortcutLabel"
    }, searchSourcesLabel)), (0, _reactDomFactories.p)({
      className: "welcomebox__searchProject",
      role: "button",
      tabIndex: "0",
      onClick: () => {
        this.props.setActiveSearch(_constants.primaryPaneTabs.PROJECT_SEARCH);
        this.props.setPrimaryPaneTab(_constants.primaryPaneTabs.PROJECT_SEARCH);
      }
    }, (0, _reactDomFactories.span)({
      className: "shortcutKey"
    }, searchProjectShortcut), (0, _reactDomFactories.span)({
      className: "shortcutLabel"
    }, searchProjectLabel)), (0, _reactDomFactories.p)({
      className: "welcomebox__allShortcuts",
      role: "button",
      tabIndex: "0",
      onClick: () => this.props.toggleShortcutsModal()
    }, (0, _reactDomFactories.span)({
      className: "shortcutKey"
    }, allShortcutsShortcut), (0, _reactDomFactories.span)({
      className: "shortcutLabel"
    }, allShortcutsLabel)))));
  }

}

exports.WelcomeBox = WelcomeBox;

const mapStateToProps = state => ({
  endPanelCollapsed: (0, _index2.getPaneCollapse)(state, "end")
});

var _default = (0, _reactRedux.connect)(mapStateToProps, {
  togglePaneCollapse: _index.default.togglePaneCollapse,
  setActiveSearch: _index.default.setActiveSearch,
  openQuickOpen: _index.default.openQuickOpen,
  setPrimaryPaneTab: _index.default.setPrimaryPaneTab
})(WelcomeBox);

exports.default = _default;