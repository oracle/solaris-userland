"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _reactDom = _interopRequireDefault(require("devtools/client/shared/vendor/react-dom"));

loader.lazyRequireGetter(this, "_connect", "devtools/client/debugger/src/utils/connect");
loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_ui", "devtools/client/debugger/src/utils/ui");
loader.lazyRequireGetter(this, "_tabs", "devtools/client/debugger/src/utils/tabs");
loader.lazyRequireGetter(this, "_source", "devtools/client/debugger/src/utils/source");

var _actions = _interopRequireDefault(require("../../actions/index"));

var _lodash = require("devtools/client/shared/vendor/lodash");

var _Tab = _interopRequireDefault(require("./Tab"));

loader.lazyRequireGetter(this, "_Button", "devtools/client/debugger/src/components/shared/Button/index");

var _Dropdown = _interopRequireDefault(require("../shared/Dropdown"));

var _AccessibleImage = _interopRequireDefault(require("../shared/AccessibleImage"));

var _CommandBar = _interopRequireDefault(require("../SecondaryPanes/CommandBar"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function haveTabSourcesChanged(tabSources, prevTabSources) {
  if (tabSources.length !== prevTabSources.length) {
    return true;
  }

  for (let i = 0; i < tabSources.length; ++i) {
    if (tabSources[i].id !== prevTabSources[i].id) {
      return true;
    }
  }

  return false;
}

class Tabs extends _react.PureComponent {
  constructor(props) {
    super(props);

    _defineProperty(this, "updateHiddenTabs", () => {
      if (!this.refs.sourceTabs) {
        return;
      }

      const {
        selectedSource,
        tabSources,
        moveTab
      } = this.props;
      const sourceTabEls = this.refs.sourceTabs.children;
      const hiddenTabs = (0, _tabs.getHiddenTabs)(tabSources, sourceTabEls);

      if (selectedSource && (0, _ui.isVisible)() && hiddenTabs.find(tab => tab.id == selectedSource.id)) {
        return moveTab(selectedSource.url, 0);
      }

      this.setState({
        hiddenTabs
      });
    });

    _defineProperty(this, "renderDropdownSource", source => {
      const {
        cx,
        selectSource
      } = this.props;
      const filename = (0, _source.getFilename)(source);

      const onClick = () => selectSource(cx, source.id);

      return _react.default.createElement("li", {
        key: source.id,
        onClick: onClick,
        title: (0, _source.getFileURL)(source, false)
      }, _react.default.createElement(_AccessibleImage.default, {
        className: `dropdown-icon ${this.getIconClass(source)}`
      }), _react.default.createElement("span", {
        className: "dropdown-label"
      }, filename));
    });

    _defineProperty(this, "onTabDragStart", (source, index) => {
      this.draggedSource = source;
      this.draggedSourceIndex = index;
    });

    _defineProperty(this, "onTabDragEnd", () => {
      this.draggedSource = null;
      this.draggedSourceIndex = null;
    });

    _defineProperty(this, "onTabDragOver", (e, source, hoveredTabIndex) => {
      const {
        moveTabBySourceId
      } = this.props;

      if (hoveredTabIndex === this.draggedSourceIndex) {
        return;
      }

      const tabDOM = _reactDom.default.findDOMNode(this.refs[`tab_${source.id}`].getWrappedInstance());
      /* $FlowIgnore: tabDOM.nodeType will always be of Node.ELEMENT_NODE since it comes from a ref;
        however; the return type of findDOMNode is null | Element | Text */


      const tabDOMRect = tabDOM.getBoundingClientRect();
      const {
        pageX: mouseCursorX
      } = e;

      if (
      /* Case: the mouse cursor moves into the left half of any target tab */
      mouseCursorX - tabDOMRect.left < tabDOMRect.width / 2) {
        // The current tab goes to the left of the target tab
        const targetTab = hoveredTabIndex > this.draggedSourceIndex ? hoveredTabIndex - 1 : hoveredTabIndex;
        moveTabBySourceId(this.draggedSource.id, targetTab);
        this.draggedSourceIndex = targetTab;
      } else if (
      /* Case: the mouse cursor moves into the right half of any target tab */
      mouseCursorX - tabDOMRect.left >= tabDOMRect.width / 2) {
        // The current tab goes to the right of the target tab
        const targetTab = hoveredTabIndex < this.draggedSourceIndex ? hoveredTabIndex + 1 : hoveredTabIndex;
        moveTabBySourceId(this.draggedSource.id, targetTab);
        this.draggedSourceIndex = targetTab;
      }
    });

    this.state = {
      dropdownShown: false,
      hiddenTabs: []
    };
    this.onResize = (0, _lodash.debounce)(() => {
      this.updateHiddenTabs();
    });
  }

  get draggedSource() {
    return this._draggedSource == null ? {
      url: null,
      id: null
    } : this._draggedSource;
  }

  set draggedSource(source) {
    this._draggedSource = source;
  }

  get draggedSourceIndex() {
    return this._draggedSourceIndex == null ? -1 : this._draggedSourceIndex;
  }

  set draggedSourceIndex(index) {
    this._draggedSourceIndex = index;
  }

  componentDidUpdate(prevProps) {
    if (this.props.selectedSource !== prevProps.selectedSource || haveTabSourcesChanged(this.props.tabSources, prevProps.tabSources)) {
      this.updateHiddenTabs();
    }
  }

  componentDidMount() {
    window.requestIdleCallback(this.updateHiddenTabs);
    window.addEventListener("resize", this.onResize);
    window.document.querySelector(".editor-pane").addEventListener("resizeend", this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.onResize);
    window.document.querySelector(".editor-pane").removeEventListener("resizeend", this.onResize);
  }
  /*
   * Updates the hiddenSourceTabs state, by
   * finding the source tabs which are wrapped and are not on the top row.
   */


  toggleSourcesDropdown() {
    this.setState(prevState => ({
      dropdownShown: !prevState.dropdownShown
    }));
  }

  getIconClass(source) {
    if ((0, _source.isPretty)(source)) {
      return "prettyPrint";
    }

    if (source.isBlackBoxed) {
      return "blackBox";
    }

    return "file";
  }

  renderTabs() {
    const {
      tabSources
    } = this.props;

    if (!tabSources) {
      return;
    }

    return _react.default.createElement("div", {
      className: "source-tabs",
      ref: "sourceTabs"
    }, tabSources.map((source, index) => {
      return _react.default.createElement(_Tab.default, {
        onDragStart: _ => this.onTabDragStart(source, index),
        onDragOver: e => {
          this.onTabDragOver(e, source, index);
          e.preventDefault();
        },
        onDragEnd: this.onTabDragEnd,
        key: index,
        source: source,
        ref: `tab_${source.id}`
      });
    }));
  }

  renderDropdown() {
    const {
      hiddenTabs
    } = this.state;

    if (!hiddenTabs || hiddenTabs.length == 0) {
      return null;
    }

    const Panel = _react.default.createElement("ul", null, hiddenTabs.map(this.renderDropdownSource));

    const icon = _react.default.createElement(_AccessibleImage.default, {
      className: "more-tabs"
    });

    return _react.default.createElement(_Dropdown.default, {
      panel: Panel,
      icon: icon
    });
  }

  renderCommandBar() {
    const {
      horizontal,
      endPanelCollapsed,
      isPaused
    } = this.props;

    if (!endPanelCollapsed || !isPaused) {
      return;
    }

    return _react.default.createElement(_CommandBar.default, {
      horizontal: horizontal
    });
  }

  renderStartPanelToggleButton() {
    return _react.default.createElement(_Button.PaneToggleButton, {
      position: "start",
      collapsed: this.props.startPanelCollapsed,
      handleClick: this.props.togglePaneCollapse
    });
  }

  renderEndPanelToggleButton() {
    const {
      horizontal,
      endPanelCollapsed,
      togglePaneCollapse
    } = this.props;

    if (!horizontal) {
      return;
    }

    return _react.default.createElement(_Button.PaneToggleButton, {
      position: "end",
      collapsed: endPanelCollapsed,
      handleClick: togglePaneCollapse,
      horizontal: horizontal
    });
  }

  render() {
    return _react.default.createElement("div", {
      className: "source-header"
    }, this.renderStartPanelToggleButton(), this.renderTabs(), this.renderDropdown(), this.renderEndPanelToggleButton(), this.renderCommandBar());
  }

}

const mapStateToProps = state => ({
  cx: (0, _selectors.getContext)(state),
  selectedSource: (0, _selectors.getSelectedSource)(state),
  tabSources: (0, _selectors.getSourcesForTabs)(state),
  isPaused: (0, _selectors.getIsPaused)(state, (0, _selectors.getCurrentThread)(state))
});

var _default = (0, _connect.connect)(mapStateToProps, {
  selectSource: _actions.default.selectSource,
  moveTab: _actions.default.moveTab,
  moveTabBySourceId: _actions.default.moveTabBySourceId,
  closeTab: _actions.default.closeTab,
  togglePaneCollapse: _actions.default.togglePaneCollapse,
  showSource: _actions.default.showSource
})(Tabs);

exports.default = _default;