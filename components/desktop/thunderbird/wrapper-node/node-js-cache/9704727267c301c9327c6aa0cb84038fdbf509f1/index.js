"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _reactPropTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

var _index = _interopRequireDefault(require("../../actions/index"));

loader.lazyRequireGetter(this, "_index2", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_prefs", "devtools/client/debugger/src/utils/prefs");

var _reactRedux = require("devtools/client/shared/vendor/react-redux");

loader.lazyRequireGetter(this, "_constants", "devtools/client/debugger/src/constants");

var _Outline = _interopRequireDefault(require("./Outline"));

var _SourcesTree = _interopRequireDefault(require("./SourcesTree"));

var _ProjectSearch = _interopRequireDefault(require("./ProjectSearch"));

var _Tracer = _interopRequireDefault(require("./Tracer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const AppErrorBoundary = require("resource://devtools/client/shared/components/AppErrorBoundary.js");

const {
  TabPanel,
  Tabs
} = ChromeUtils.importESModule("resource://devtools/client/shared/components/tabs/Tabs.mjs", {
  global: "current"
}); // Note that the following list should follow the same order as displayed

const tabs = [_constants.primaryPaneTabs.SOURCES, _constants.primaryPaneTabs.OUTLINE, _constants.primaryPaneTabs.PROJECT_SEARCH];

if (_prefs.features.javascriptTracing) {
  tabs.push(_constants.primaryPaneTabs.TRACER);
}

class PrimaryPanes extends _react.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "onAlphabetizeClick", () => {
      const alphabetizeOutline = !_prefs.prefs.alphabetizeOutline;
      _prefs.prefs.alphabetizeOutline = alphabetizeOutline;
      this.setState({
        alphabetizeOutline
      });
    });

    _defineProperty(this, "onActivateTab", index => {
      const tab = tabs.at(index);
      this.props.setPrimaryPaneTab(tab);

      if (tab == _constants.primaryPaneTabs.PROJECT_SEARCH) {
        this.props.setActiveSearch(tab);
      } else {
        this.props.closeActiveSearch();
      }
    });

    this.state = {
      alphabetizeOutline: _prefs.prefs.alphabetizeOutline
    };
  }

  static get propTypes() {
    return {
      selectedTab: _reactPropTypes.default.oneOf(tabs).isRequired,
      setPrimaryPaneTab: _reactPropTypes.default.func.isRequired,
      setActiveSearch: _reactPropTypes.default.func.isRequired,
      closeActiveSearch: _reactPropTypes.default.func.isRequired
    };
  }

  render() {
    const {
      selectedTab
    } = this.props;
    return _react.default.createElement("aside", {
      className: "tab-panel sources-panel"
    }, _react.default.createElement(Tabs, {
      activeTab: tabs.indexOf(selectedTab),
      onAfterChange: this.onActivateTab
    }, _react.default.createElement(TabPanel, {
      id: "sources-tab",
      key: `sources-tab${selectedTab === _constants.primaryPaneTabs.SOURCES ? "-selected" : ""}`,
      className: "tab sources-tab",
      title: L10N.getStr("sources.header")
    }, _react.default.createElement(_SourcesTree.default, null)), _react.default.createElement(TabPanel, {
      id: "outline-tab",
      key: `outline-tab${selectedTab === _constants.primaryPaneTabs.OUTLINE ? "-selected" : ""}`,
      className: "tab outline-tab",
      title: L10N.getStr("outline.header")
    }, _react.default.createElement(_Outline.default, {
      alphabetizeOutline: this.state.alphabetizeOutline,
      onAlphabetizeClick: this.onAlphabetizeClick
    })), _react.default.createElement(TabPanel, {
      id: "search-tab",
      key: `search-tab${selectedTab === _constants.primaryPaneTabs.PROJECT_SEARCH ? "-selected" : ""}`,
      className: "tab search-tab",
      title: L10N.getStr("search.header")
    }, _react.default.createElement(_ProjectSearch.default, null)), _prefs.features.javascriptTracing ? _react.default.createElement(TabPanel, {
      id: "tracer-tab",
      key: `tracer-tab${selectedTab === _constants.primaryPaneTabs.TRACER ? "-selected" : ""}`,
      className: "tab tracer-tab",
      title: L10N.getStr("tracer.header")
    }, // As the tracer is an application on its own (and is prototypish)
    // let's encapsulate it to track its own exceptions.
    _react.default.createElement(AppErrorBoundary, {
      componentName: "Debugger",
      panel: "JavaScript Tracer"
    }, _react.default.createElement(_Tracer.default))) : null));
  }

}

const mapStateToProps = state => {
  return {
    selectedTab: (0, _index2.getSelectedPrimaryPaneTab)(state)
  };
};

const connector = (0, _reactRedux.connect)(mapStateToProps, {
  setPrimaryPaneTab: _index.default.setPrimaryPaneTab,
  setActiveSearch: _index.default.setActiveSearch,
  closeActiveSearch: _index.default.closeActiveSearch
});

var _default = connector(PrimaryPanes);

exports.default = _default;