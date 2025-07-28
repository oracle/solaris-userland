"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _reactDomFactories = require("devtools/client/shared/vendor/react-dom-factories");

var _reactPropTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

var _reactRedux = require("devtools/client/shared/vendor/react-redux");

loader.lazyRequireGetter(this, "_prefs", "devtools/client/debugger/src/utils/prefs");
loader.lazyRequireGetter(this, "_constants", "devtools/client/debugger/src/constants");

var _index = _interopRequireDefault(require("../actions/index"));

var _AccessibleImage = _interopRequireDefault(require("./shared/AccessibleImage"));

loader.lazyRequireGetter(this, "_index2", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_ShortcutsModal", "devtools/client/debugger/src/components/ShortcutsModal");

var _index3 = _interopRequireDefault(require("./PrimaryPanes/index"));

var _index4 = _interopRequireDefault(require("./Editor/index"));

var _index5 = _interopRequireDefault(require("./SecondaryPanes/index"));

var _WelcomeBox = _interopRequireDefault(require("./WelcomeBox"));

var _Tabs = _interopRequireDefault(require("./Editor/Tabs"));

var _Footer = _interopRequireDefault(require("./Editor/Footer"));

var _QuickOpenModal = _interopRequireDefault(require("./QuickOpenModal"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to set private field on non-instance"); } if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } return value; }

const KeyShortcuts = require("resource://devtools/client/shared/key-shortcuts.js");

const SplitBox = require("resource://devtools/client/shared/components/splitter/SplitBox.js");

const AppErrorBoundary = require("resource://devtools/client/shared/components/AppErrorBoundary.js");

const horizontalLayoutBreakpoint = window.matchMedia("(min-width: 800px)");
const verticalLayoutBreakpoint = window.matchMedia("(min-width: 10px) and (max-width: 799px)");

class App extends _react.Component {
  constructor(props) {
    super(props); // The shortcuts should be built as early as possible because they are
    // exposed via getChildContext.

    _shortcuts.set(this, {
      writable: true,
      value: void 0
    });

    _defineProperty(this, "jumpToProjectSearch", e => {
      e.preventDefault();
      this.props.setPrimaryPaneTab(_constants.primaryPaneTabs.PROJECT_SEARCH);
      this.props.setActiveSearch(_constants.primaryPaneTabs.PROJECT_SEARCH);
    });

    _defineProperty(this, "onEscape", e => {
      const {
        activeSearch,
        closeActiveSearch,
        closeQuickOpen,
        quickOpenEnabled
      } = this.props;
      const {
        shortcutsModalEnabled
      } = this.state;

      if (activeSearch) {
        e.preventDefault();
        closeActiveSearch();
      }

      if (quickOpenEnabled) {
        e.preventDefault();
        closeQuickOpen();
      }

      if (shortcutsModalEnabled) {
        e.preventDefault();
        this.toggleShortcutsModal();
      }
    });

    _defineProperty(this, "onCommandSlash", () => {
      this.toggleShortcutsModal();
    });

    _defineProperty(this, "toggleJumpToLine", e => {
      this.toggleQuickOpenModal(e, ":");
    });

    _defineProperty(this, "toggleQuickOpenModal", (e, query) => {
      const {
        quickOpenEnabled,
        openQuickOpen,
        closeQuickOpen
      } = this.props;
      e.preventDefault();
      e.stopPropagation();

      if (quickOpenEnabled === true) {
        closeQuickOpen();
        return;
      }

      if (query != null) {
        openQuickOpen(query);
        return;
      }

      openQuickOpen();
    });

    _defineProperty(this, "onLayoutChange", () => {
      this.setOrientation();
    });

    _defineProperty(this, "closeSourceMapError", () => {
      this.setState({
        hiddenSourceMapError: this.props.sourceMapError
      });
    });

    _defineProperty(this, "renderEditorPane", () => {
      const {
        startPanelCollapsed,
        endPanelCollapsed
      } = this.props;
      const {
        endPanelSize,
        startPanelSize
      } = this.state;
      const horizontal = this.isHorizontal();
      return (0, _reactDomFactories.main)({
        className: "editor-pane"
      }, (0, _reactDomFactories.div)({
        className: "editor-container"
      }, _react.default.createElement(_Tabs.default, {
        startPanelCollapsed,
        endPanelCollapsed,
        horizontal
      }), _react.default.createElement(_index4.default, {
        startPanelSize,
        endPanelSize
      }), this.props.showWelcomeBox ? _react.default.createElement(_WelcomeBox.default, {
        horizontal,
        toggleShortcutsModal: () => this.toggleShortcutsModal()
      }) : null, this.renderEditorNotificationBar(), _react.default.createElement(_Footer.default, {
        horizontal
      })));
    });

    _defineProperty(this, "renderLayout", () => {
      const {
        startPanelCollapsed,
        endPanelCollapsed
      } = this.props;
      const horizontal = this.isHorizontal();
      return _react.default.createElement(SplitBox, {
        style: {
          width: "100vw"
        },
        initialSize: _prefs.prefs.endPanelSize,
        minSize: 30,
        maxSize: "70%",
        splitterSize: 1,
        vert: horizontal,
        onResizeEnd: num => {
          _prefs.prefs.endPanelSize = num;
          this.triggerEditorPaneResize();
        },
        startPanel: _react.default.createElement(SplitBox, {
          style: {
            width: "100vw"
          },
          initialSize: _prefs.prefs.startPanelSize,
          minSize: 30,
          maxSize: "85%",
          splitterSize: 1,
          onResizeEnd: num => {
            _prefs.prefs.startPanelSize = num;
            this.triggerEditorPaneResize();
          },
          startPanelCollapsed,
          startPanel: _react.default.createElement(_index3.default, {
            horizontal
          }),
          endPanel: this.renderEditorPane()
        }),
        endPanelControl: true,
        endPanel: _react.default.createElement(_index5.default, {
          horizontal
        }),
        endPanelCollapsed
      });
    });

    _classPrivateFieldSet(this, _shortcuts, new KeyShortcuts({
      window
    }));

    this.state = {
      shortcutsModalEnabled: false,
      startPanelSize: 0,
      endPanelSize: 0
    };
  }

  static get propTypes() {
    return {
      activeSearch: _reactPropTypes.default.oneOf(["file", "project"]),
      closeActiveSearch: _reactPropTypes.default.func.isRequired,
      closeQuickOpen: _reactPropTypes.default.func.isRequired,
      endPanelCollapsed: _reactPropTypes.default.bool.isRequired,
      fluentBundles: _reactPropTypes.default.array.isRequired,
      openQuickOpen: _reactPropTypes.default.func.isRequired,
      orientation: _reactPropTypes.default.oneOf(["horizontal", "vertical"]).isRequired,
      quickOpenEnabled: _reactPropTypes.default.bool.isRequired,
      showWelcomeBox: _reactPropTypes.default.bool.isRequired,
      setActiveSearch: _reactPropTypes.default.func.isRequired,
      setOrientation: _reactPropTypes.default.func.isRequired,
      setPrimaryPaneTab: _reactPropTypes.default.func.isRequired,
      startPanelCollapsed: _reactPropTypes.default.bool.isRequired,
      toolboxDoc: _reactPropTypes.default.object.isRequired,
      showOriginalVariableMappingWarning: _reactPropTypes.default.bool
    };
  }

  getChildContext() {
    return {
      fluentBundles: this.props.fluentBundles,
      toolboxDoc: this.props.toolboxDoc,
      shortcuts: _classPrivateFieldGet(this, _shortcuts),
      l10n: L10N
    };
  }

  componentDidMount() {
    horizontalLayoutBreakpoint.addListener(this.onLayoutChange);
    verticalLayoutBreakpoint.addListener(this.onLayoutChange);
    this.setOrientation();

    _classPrivateFieldGet(this, _shortcuts).on(L10N.getStr("symbolSearch.search.key2"), e => this.toggleQuickOpenModal(e, "@"));

    [L10N.getStr("sources.search.key2"), L10N.getStr("sources.search.alt.key")].forEach(key => _classPrivateFieldGet(this, _shortcuts).on(key, this.toggleQuickOpenModal));
    [L10N.getStr("gotoLineModal.key3"), // For consistency with sourceeditor and codemirror5 shortcuts, map
    // sourceeditor jumpToLine command key.
    `CmdOrCtrl+${L10N.getStr("jumpToLine.commandkey")}`].forEach(key => _classPrivateFieldGet(this, _shortcuts).on(key, this.toggleJumpToLine));

    _classPrivateFieldGet(this, _shortcuts).on(L10N.getStr("projectTextSearch.key"), this.jumpToProjectSearch);

    _classPrivateFieldGet(this, _shortcuts).on("Escape", this.onEscape);

    _classPrivateFieldGet(this, _shortcuts).on("CmdOrCtrl+/", this.onCommandSlash);
  }

  componentWillUnmount() {
    horizontalLayoutBreakpoint.removeListener(this.onLayoutChange);
    verticalLayoutBreakpoint.removeListener(this.onLayoutChange);

    _classPrivateFieldGet(this, _shortcuts).destroy();
  }

  isHorizontal() {
    return this.props.orientation === "horizontal";
  }

  setOrientation() {
    // If the orientation does not match (if it is not visible) it will
    // not setOrientation, or if it is the same as before, calling
    // setOrientation will not cause a rerender.
    if (horizontalLayoutBreakpoint.matches) {
      this.props.setOrientation("horizontal");
    } else if (verticalLayoutBreakpoint.matches) {
      this.props.setOrientation("vertical");
    }
  }

  renderEditorNotificationBar() {
    if (this.props.sourceMapError && this.state.hiddenSourceMapError != this.props.sourceMapError) {
      return (0, _reactDomFactories.div)({
        className: "editor-notification-footer",
        "aria-role": "status"
      }, (0, _reactDomFactories.span)({
        className: "info icon"
      }, _react.default.createElement(_AccessibleImage.default, {
        className: "sourcemap"
      })), `Source Map Error: ${this.props.sourceMapError}`, (0, _reactDomFactories.button)({
        className: "close-button",
        onClick: this.closeSourceMapError
      }));
    }

    if (this.props.showOriginalVariableMappingWarning) {
      return (0, _reactDomFactories.div)({
        className: "editor-notification-footer",
        "aria-role": "status"
      }, (0, _reactDomFactories.span)({
        className: "info icon"
      }, _react.default.createElement(_AccessibleImage.default, {
        className: "sourcemap"
      })), L10N.getFormatStr("editorNotificationFooter.noOriginalScopes", L10N.getStr("scopes.showOriginalScopes")));
    }

    return null;
  }

  toggleShortcutsModal() {
    this.setState(prevState => ({
      shortcutsModalEnabled: !prevState.shortcutsModalEnabled
    }));
  } // Important so that the tabs chevron updates appropriately when
  // the user resizes the left or right columns


  triggerEditorPaneResize() {
    const editorPane = window.document.querySelector(".editor-pane");

    if (editorPane) {
      editorPane.dispatchEvent(new Event("resizeend"));
    }
  }

  render() {
    const {
      quickOpenEnabled
    } = this.props;
    return (0, _reactDomFactories.div)({
      className: "debugger"
    }, _react.default.createElement(AppErrorBoundary, {
      componentName: "Debugger",
      panel: L10N.getStr("ToolboxDebugger.label")
    }, this.renderLayout(), quickOpenEnabled === true && _react.default.createElement(_QuickOpenModal.default, {
      shortcutsModalEnabled: this.state.shortcutsModalEnabled,
      toggleShortcutsModal: () => this.toggleShortcutsModal()
    }), _react.default.createElement(_ShortcutsModal.ShortcutsModal, {
      enabled: this.state.shortcutsModalEnabled,
      handleClose: () => this.toggleShortcutsModal()
    })));
  }

}

var _shortcuts = new WeakMap();

App.childContextTypes = {
  toolboxDoc: _reactPropTypes.default.object,
  shortcuts: _reactPropTypes.default.object,
  l10n: _reactPropTypes.default.object,
  fluentBundles: _reactPropTypes.default.array
};

const mapStateToProps = state => {
  const selectedLocation = (0, _index2.getSelectedLocation)(state);
  const mapScopeEnabled = (0, _index2.isMapScopesEnabled)(state);
  const isPaused = (0, _index2.getIsCurrentThreadPaused)(state);
  const showOriginalVariableMappingWarning = isPaused && selectedLocation?.source.isOriginal && !selectedLocation?.source.isPrettyPrinted && !mapScopeEnabled;
  return {
    showOriginalVariableMappingWarning,
    showWelcomeBox: !selectedLocation,
    startPanelCollapsed: (0, _index2.getPaneCollapse)(state, "start"),
    endPanelCollapsed: (0, _index2.getPaneCollapse)(state, "end"),
    activeSearch: (0, _index2.getActiveSearch)(state),
    quickOpenEnabled: (0, _index2.getQuickOpenEnabled)(state),
    orientation: (0, _index2.getOrientation)(state),
    sourceMapError: selectedLocation?.sourceActor ? (0, _index2.getSourceMapErrorForSourceActor)(state, selectedLocation.sourceActor.id) : null
  };
};

var _default = (0, _reactRedux.connect)(mapStateToProps, {
  setActiveSearch: _index.default.setActiveSearch,
  closeActiveSearch: _index.default.closeActiveSearch,
  openQuickOpen: _index.default.openQuickOpen,
  closeQuickOpen: _index.default.closeQuickOpen,
  setOrientation: _index.default.setOrientation,
  setPrimaryPaneTab: _index.default.setPrimaryPaneTab
})(App);

exports.default = _default;