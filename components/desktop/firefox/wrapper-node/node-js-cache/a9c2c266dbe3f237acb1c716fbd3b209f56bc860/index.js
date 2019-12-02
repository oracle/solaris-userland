"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("devtools/client/shared/vendor/react");

var _react2 = _interopRequireDefault(_react);

var _classnames = require("devtools/client/debugger/dist/vendors").vendored["classnames"];

var _classnames2 = _interopRequireDefault(_classnames);

var _tabs = require("devtools/client/debugger/dist/vendors").vendored["react-aria-components/src/tabs"];

var _actions = require("../../actions/index");

var _actions2 = _interopRequireDefault(_actions);

var _selectors = require("../../selectors/index");

var _prefs = require("../../utils/prefs");

var _connect = require("../../utils/connect");

var _text = require("../../utils/text");

var _Outline = require("./Outline");

var _Outline2 = _interopRequireDefault(_Outline);

var _SourcesTree = require("./SourcesTree");

var _SourcesTree2 = _interopRequireDefault(_SourcesTree);

var _AccessibleImage = require("../shared/AccessibleImage");

var _AccessibleImage2 = _interopRequireDefault(_AccessibleImage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class PrimaryPanes extends _react.Component {
  constructor(props) {
    super(props);

    this.showPane = selectedPane => {
      this.props.setPrimaryPaneTab(selectedPane);
    };

    this.onAlphabetizeClick = () => {
      const alphabetizeOutline = !_prefs.prefs.alphabetizeOutline;
      _prefs.prefs.alphabetizeOutline = alphabetizeOutline;
      this.setState({ alphabetizeOutline });
    };

    this.onActivateTab = index => {
      if (index === 0) {
        this.showPane("sources");
      } else {
        this.showPane("outline");
      }
    };

    this.state = {
      alphabetizeOutline: _prefs.prefs.alphabetizeOutline
    };
  }

  renderOutlineTabs() {
    if (!_prefs.features.outline) {
      return;
    }

    const sources = (0, _text.formatKeyShortcut)(L10N.getStr("sources.header"));
    const outline = (0, _text.formatKeyShortcut)(L10N.getStr("outline.header"));
    const isSources = this.props.selectedTab === "sources";
    const isOutline = this.props.selectedTab === "outline";

    return [_react2.default.createElement(
      _tabs.Tab,
      {
        className: (0, _classnames2.default)("tab sources-tab", { active: isSources }),
        key: "sources-tab"
      },
      sources
    ), _react2.default.createElement(
      _tabs.Tab,
      {
        className: (0, _classnames2.default)("tab outline-tab", { active: isOutline }),
        key: "outline-tab"
      },
      outline
    )];
  }

  renderProjectRootHeader() {
    const { cx, projectRoot } = this.props;

    if (!projectRoot) {
      return null;
    }

    const rootLabel = projectRoot.split("/").pop();

    return _react2.default.createElement(
      "div",
      { key: "root", className: "sources-clear-root-container" },
      _react2.default.createElement(
        "button",
        {
          className: "sources-clear-root",
          onClick: () => this.props.clearProjectDirectoryRoot(cx),
          title: L10N.getStr("removeDirectoryRoot.label")
        },
        _react2.default.createElement(_AccessibleImage2.default, { className: "home" }),
        _react2.default.createElement(_AccessibleImage2.default, { className: "breadcrumb" }),
        _react2.default.createElement(
          "span",
          { className: "sources-clear-root-label" },
          rootLabel
        )
      )
    );
  }

  renderThreadSources() {
    return _react2.default.createElement(_SourcesTree2.default, { threads: this.props.threads });
  }

  render() {
    const { selectedTab, projectRoot } = this.props;
    const activeIndex = selectedTab === "sources" ? 0 : 1;

    return _react2.default.createElement(
      _tabs.Tabs,
      {
        activeIndex: activeIndex,
        className: "sources-panel",
        onActivateTab: this.onActivateTab
      },
      _react2.default.createElement(
        _tabs.TabList,
        { className: "source-outline-tabs" },
        this.renderOutlineTabs()
      ),
      _react2.default.createElement(
        _tabs.TabPanels,
        {
          className: (0, _classnames2.default)("source-outline-panel", {
            "has-root": projectRoot
          }),
          hasFocusableContent: true
        },
        _react2.default.createElement(
          "div",
          { className: "threads-list" },
          this.renderProjectRootHeader(),
          this.renderThreadSources()
        ),
        _react2.default.createElement(_Outline2.default, {
          alphabetizeOutline: this.state.alphabetizeOutline,
          onAlphabetizeClick: this.onAlphabetizeClick
        })
      )
    );
  }
} /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

const mapStateToProps = state => ({
  cx: (0, _selectors.getContext)(state),
  selectedTab: (0, _selectors.getSelectedPrimaryPaneTab)(state),
  sources: (0, _selectors.getDisplayedSources)(state),
  sourceSearchOn: (0, _selectors.getActiveSearch)(state) === "source",
  threads: (0, _selectors.getThreads)(state),
  projectRoot: (0, _selectors.getProjectDirectoryRoot)(state)
});

const connector = (0, _connect.connect)(mapStateToProps, {
  setPrimaryPaneTab: _actions2.default.setPrimaryPaneTab,
  setActiveSearch: _actions2.default.setActiveSearch,
  closeActiveSearch: _actions2.default.closeActiveSearch,
  clearProjectDirectoryRoot: _actions2.default.clearProjectDirectoryRoot
});

exports.default = connector(PrimaryPanes);