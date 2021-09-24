"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _classnames = _interopRequireDefault(require("devtools/client/debugger/dist/vendors").vendored["classnames"]);

var _tabs = require("devtools/client/debugger/dist/vendors").vendored["react-aria-components/src/tabs"];

var _actions = _interopRequireDefault(require("../../actions/index"));

loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_prefs", "devtools/client/debugger/src/utils/prefs");
loader.lazyRequireGetter(this, "_connect", "devtools/client/debugger/src/utils/connect");
loader.lazyRequireGetter(this, "_text", "devtools/client/debugger/src/utils/text");

var _Outline = _interopRequireDefault(require("./Outline"));

var _SourcesTree = _interopRequireDefault(require("./SourcesTree"));

var _AccessibleImage = _interopRequireDefault(require("../shared/AccessibleImage"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class PrimaryPanes extends _react.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "showPane", selectedPane => {
      this.props.setPrimaryPaneTab(selectedPane);
    });

    _defineProperty(this, "onAlphabetizeClick", () => {
      const alphabetizeOutline = !_prefs.prefs.alphabetizeOutline;
      _prefs.prefs.alphabetizeOutline = alphabetizeOutline;
      this.setState({
        alphabetizeOutline
      });
    });

    _defineProperty(this, "onActivateTab", index => {
      if (index === 0) {
        this.showPane("sources");
      } else {
        this.showPane("outline");
      }
    });

    this.state = {
      alphabetizeOutline: _prefs.prefs.alphabetizeOutline
    };
  }

  componentDidCatch(error) {
    console.log(error);
  }

  renderOutlineTabs() {
    if (!_prefs.features.outline) {
      return;
    }

    const sources = (0, _text.formatKeyShortcut)(L10N.getStr("sources.header"));
    const outline = (0, _text.formatKeyShortcut)(L10N.getStr("outline.header"));
    const isSources = this.props.selectedTab === "sources";
    const isOutline = this.props.selectedTab === "outline";
    return [_react.default.createElement(_tabs.Tab, {
      className: (0, _classnames.default)("tab sources-tab", {
        active: isSources
      }),
      key: "sources-tab"
    }, sources), _react.default.createElement(_tabs.Tab, {
      className: (0, _classnames.default)("tab outline-tab", {
        active: isOutline
      }),
      key: "outline-tab"
    }, outline)];
  }

  renderProjectRootHeader() {
    const {
      cx,
      projectRootName
    } = this.props;

    if (!projectRootName) {
      return null;
    }

    return _react.default.createElement("div", {
      key: "root",
      className: "sources-clear-root-container"
    }, _react.default.createElement("button", {
      className: "sources-clear-root",
      onClick: () => this.props.clearProjectDirectoryRoot(cx),
      title: L10N.getStr("removeDirectoryRoot.label")
    }, _react.default.createElement(_AccessibleImage.default, {
      className: "home"
    }), _react.default.createElement(_AccessibleImage.default, {
      className: "breadcrumb"
    }), _react.default.createElement("span", {
      className: "sources-clear-root-label"
    }, projectRootName)));
  }

  renderThreadSources() {
    return _react.default.createElement(_SourcesTree.default, {
      threads: this.props.threads
    });
  }

  render() {
    const {
      selectedTab,
      projectRootName
    } = this.props;
    const activeIndex = selectedTab === "sources" ? 0 : 1;
    return _react.default.createElement(_tabs.Tabs, {
      activeIndex: activeIndex,
      className: "sources-panel",
      onActivateTab: this.onActivateTab
    }, _react.default.createElement(_tabs.TabList, {
      className: "source-outline-tabs"
    }, this.renderOutlineTabs()), _react.default.createElement(_tabs.TabPanels, {
      className: (0, _classnames.default)("source-outline-panel", {
        "has-root": projectRootName
      }),
      hasFocusableContent: true
    }, _react.default.createElement("div", {
      className: "threads-list"
    }, this.renderProjectRootHeader(), this.renderThreadSources()), _react.default.createElement(_Outline.default, {
      alphabetizeOutline: this.state.alphabetizeOutline,
      onAlphabetizeClick: this.onAlphabetizeClick
    })));
  }

}

const mapStateToProps = state => {
  return {
    cx: (0, _selectors.getContext)(state),
    selectedTab: (0, _selectors.getSelectedPrimaryPaneTab)(state),
    sourceSearchOn: (0, _selectors.getActiveSearch)(state) === "source",
    threads: (0, _selectors.getAllThreads)(state),
    projectRootName: (0, _selectors.getProjectDirectoryRootName)(state)
  };
};

const connector = (0, _connect.connect)(mapStateToProps, {
  setPrimaryPaneTab: _actions.default.setPrimaryPaneTab,
  setActiveSearch: _actions.default.setActiveSearch,
  closeActiveSearch: _actions.default.closeActiveSearch,
  clearProjectDirectoryRoot: _actions.default.clearProjectDirectoryRoot
});

var _default = connector(PrimaryPanes);

exports.default = _default;