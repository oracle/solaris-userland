"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _propTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

var _tabs = require("devtools/client/debugger/dist/vendors").vendored["react-aria-components/src/tabs"];

var _actions = _interopRequireDefault(require("../../actions/index"));

loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_prefs", "devtools/client/debugger/src/utils/prefs");
loader.lazyRequireGetter(this, "_connect", "devtools/client/debugger/src/utils/connect");
loader.lazyRequireGetter(this, "_constants", "devtools/client/debugger/src/constants");
loader.lazyRequireGetter(this, "_text", "devtools/client/debugger/src/utils/text");

var _Outline = _interopRequireDefault(require("./Outline"));

var _SourcesTree = _interopRequireDefault(require("./SourcesTree"));

var _ProjectSearch = _interopRequireDefault(require("./ProjectSearch"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const classnames = require("devtools/client/shared/classnames.js");

const tabs = [_constants.primaryPaneTabs.SOURCES, _constants.primaryPaneTabs.OUTLINE, _constants.primaryPaneTabs.PROJECT_SEARCH];

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
      cx: _propTypes.default.object.isRequired,
      projectRootName: _propTypes.default.string.isRequired,
      selectedTab: _propTypes.default.oneOf(tabs).isRequired,
      setPrimaryPaneTab: _propTypes.default.func.isRequired,
      setActiveSearch: _propTypes.default.func.isRequired,
      closeActiveSearch: _propTypes.default.func.isRequired
    };
  }

  renderTabList() {
    return [_react.default.createElement(_tabs.Tab, {
      className: classnames("tab sources-tab", {
        active: this.props.selectedTab === _constants.primaryPaneTabs.SOURCES
      }),
      key: "sources-tab"
    }, (0, _text.formatKeyShortcut)(L10N.getStr("sources.header"))), _react.default.createElement(_tabs.Tab, {
      className: classnames("tab outline-tab", {
        active: this.props.selectedTab === _constants.primaryPaneTabs.OUTLINE
      }),
      key: "outline-tab"
    }, (0, _text.formatKeyShortcut)(L10N.getStr("outline.header"))), _react.default.createElement(_tabs.Tab, {
      className: classnames("tab search-tab", {
        active: this.props.selectedTab === _constants.primaryPaneTabs.PROJECT_SEARCH
      }),
      key: "search-tab"
    }, (0, _text.formatKeyShortcut)(L10N.getStr("search.header")))];
  }

  render() {
    const {
      selectedTab
    } = this.props;
    return _react.default.createElement(_tabs.Tabs, {
      activeIndex: tabs.indexOf(selectedTab),
      className: "sources-panel",
      onActivateTab: this.onActivateTab
    }, _react.default.createElement(_tabs.TabList, {
      className: "source-outline-tabs"
    }, this.renderTabList()), _react.default.createElement(_tabs.TabPanels, {
      className: "source-outline-panel",
      hasFocusableContent: true
    }, _react.default.createElement(_SourcesTree.default, null), _react.default.createElement(_Outline.default, {
      alphabetizeOutline: this.state.alphabetizeOutline,
      onAlphabetizeClick: this.onAlphabetizeClick
    }), _react.default.createElement(_ProjectSearch.default, null)));
  }

}

const mapStateToProps = state => {
  return {
    cx: (0, _selectors.getContext)(state),
    selectedTab: (0, _selectors.getSelectedPrimaryPaneTab)(state)
  };
};

const connector = (0, _connect.connect)(mapStateToProps, {
  setPrimaryPaneTab: _actions.default.setPrimaryPaneTab,
  setActiveSearch: _actions.default.setActiveSearch,
  closeActiveSearch: _actions.default.closeActiveSearch
});

var _default = connector(PrimaryPanes);

exports.default = _default;