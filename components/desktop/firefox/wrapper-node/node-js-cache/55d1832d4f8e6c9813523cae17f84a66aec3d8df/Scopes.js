"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _reactDomFactories = require("devtools/client/shared/vendor/react-dom-factories");

var _reactPropTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

var _AccessibleImage = _interopRequireDefault(require("../shared/AccessibleImage"));

loader.lazyRequireGetter(this, "_menu", "devtools/client/debugger/src/context-menu/menu");

var _reactRedux = require("devtools/client/shared/vendor/react-redux");

var _index = _interopRequireDefault(require("../../actions/index"));

loader.lazyRequireGetter(this, "_index2", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_scopes", "devtools/client/debugger/src/utils/pause/scopes");
loader.lazyRequireGetter(this, "_firefox", "devtools/client/debugger/src/client/firefox");

var objectInspector = _interopRequireWildcard(require("resource://devtools/client/shared/components/object-inspector/index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const {
  ObjectInspector
} = objectInspector;

class Scopes extends _react.PureComponent {
  constructor(props) {
    const {
      why,
      selectedFrame,
      originalFrameScopes,
      generatedFrameScopes
    } = props;
    super(props);

    _defineProperty(this, "onContextMenu", (event, item) => {
      const {
        addWatchpoint,
        removeWatchpoint
      } = this.props;

      if (!item.parent || !item.contents.configurable) {
        return;
      }

      if (!item.contents || item.contents.watchpoint) {
        const removeWatchpointLabel = L10N.getStr("watchpoints.removeWatchpoint");
        const removeWatchpointItem = {
          id: "node-menu-remove-watchpoint",
          label: removeWatchpointLabel,
          disabled: false,
          click: () => removeWatchpoint(item)
        };
        const menuItems = [removeWatchpointItem];
        (0, _menu.showMenu)(event, menuItems);
        return;
      }

      const addSetWatchpointLabel = L10N.getStr("watchpoints.setWatchpoint");
      const addGetWatchpointLabel = L10N.getStr("watchpoints.getWatchpoint");
      const addGetOrSetWatchpointLabel = L10N.getStr("watchpoints.getOrSetWatchpoint");
      const watchpointsSubmenuLabel = L10N.getStr("watchpoints.submenu");
      const addSetWatchpointItem = {
        id: "node-menu-add-set-watchpoint",
        label: addSetWatchpointLabel,
        disabled: false,
        click: () => addWatchpoint(item, "set")
      };
      const addGetWatchpointItem = {
        id: "node-menu-add-get-watchpoint",
        label: addGetWatchpointLabel,
        disabled: false,
        click: () => addWatchpoint(item, "get")
      };
      const addGetOrSetWatchpointItem = {
        id: "node-menu-add-get-watchpoint",
        label: addGetOrSetWatchpointLabel,
        disabled: false,
        click: () => addWatchpoint(item, "getorset")
      };
      const watchpointsSubmenuItem = {
        id: "node-menu-watchpoints",
        label: watchpointsSubmenuLabel,
        disabled: false,
        click: () => addWatchpoint(item, "set"),
        submenu: [addSetWatchpointItem, addGetWatchpointItem, addGetOrSetWatchpointItem]
      };
      const menuItems = [watchpointsSubmenuItem];
      (0, _menu.showMenu)(event, menuItems);
    });

    _defineProperty(this, "renderWatchpointButton", item => {
      const {
        removeWatchpoint
      } = this.props;

      if (!item || !item.contents || !item.contents.watchpoint || typeof L10N === "undefined") {
        return null;
      }

      const {
        watchpoint
      } = item.contents;
      return (0, _reactDomFactories.button)({
        className: `remove-watchpoint-${watchpoint}`,
        title: L10N.getStr("watchpoints.removeWatchpointTooltip"),
        onClick: e => {
          e.stopPropagation();
          removeWatchpoint(item);
        }
      });
    });

    this.state = {
      originalScopes: (0, _scopes.getScopesItemsForSelectedFrame)(why, selectedFrame, originalFrameScopes),
      generatedScopes: (0, _scopes.getScopesItemsForSelectedFrame)(why, selectedFrame, generatedFrameScopes)
    };
  }

  static get propTypes() {
    return {
      addWatchpoint: _reactPropTypes.default.func.isRequired,
      expandedScopes: _reactPropTypes.default.array.isRequired,
      generatedFrameScopes: _reactPropTypes.default.object,
      highlightDomElement: _reactPropTypes.default.func.isRequired,
      isLoading: _reactPropTypes.default.bool.isRequired,
      isPaused: _reactPropTypes.default.bool.isRequired,
      mapScopesEnabled: _reactPropTypes.default.bool.isRequired,
      openElementInInspector: _reactPropTypes.default.func.isRequired,
      openLink: _reactPropTypes.default.func.isRequired,
      originalFrameScopes: _reactPropTypes.default.object,
      removeWatchpoint: _reactPropTypes.default.func.isRequired,
      setExpandedScope: _reactPropTypes.default.func.isRequired,
      unHighlightDomElement: _reactPropTypes.default.func.isRequired,
      why: _reactPropTypes.default.object.isRequired,
      selectedFrame: _reactPropTypes.default.object,
      toggleMapScopes: _reactPropTypes.default.func.isRequired,
      selectedSource: _reactPropTypes.default.object.isRequired
    };
  } // FIXME: https://bugzilla.mozilla.org/show_bug.cgi?id=1774507


  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      selectedFrame,
      originalFrameScopes,
      generatedFrameScopes,
      isPaused,
      selectedSource
    } = this.props;
    const isPausedChanged = isPaused !== nextProps.isPaused;
    const selectedFrameChanged = selectedFrame !== nextProps.selectedFrame;
    const originalFrameScopesChanged = originalFrameScopes !== nextProps.originalFrameScopes;
    const generatedFrameScopesChanged = generatedFrameScopes !== nextProps.generatedFrameScopes;
    const selectedSourceChanged = selectedSource !== nextProps.selectedSource;

    if (isPausedChanged || selectedFrameChanged || originalFrameScopesChanged || generatedFrameScopesChanged || selectedSourceChanged) {
      this.setState({
        originalScopes: (0, _scopes.getScopesItemsForSelectedFrame)(nextProps.why, nextProps.selectedFrame, nextProps.originalFrameScopes),
        generatedScopes: (0, _scopes.getScopesItemsForSelectedFrame)(nextProps.why, nextProps.selectedFrame, nextProps.generatedFrameScopes)
      });
    }
  }

  renderScopesList() {
    const {
      isLoading,
      openLink,
      openElementInInspector,
      highlightDomElement,
      unHighlightDomElement,
      mapScopesEnabled,
      selectedFrame,
      setExpandedScope,
      expandedScopes,
      selectedSource
    } = this.props;

    if (!selectedSource) {
      return (0, _reactDomFactories.div)({
        className: "pane scopes-list"
      }, (0, _reactDomFactories.div)({
        className: "pane-info"
      }, L10N.getStr("scopes.notAvailable")));
    }

    const {
      originalScopes,
      generatedScopes
    } = this.state;
    let scopes = null;

    if (selectedSource.isOriginal && !selectedSource.isPrettyPrinted && !selectedFrame.generatedLocation?.source.isWasm) {
      if (!mapScopesEnabled) {
        return (0, _reactDomFactories.div)({
          className: "pane scopes-list"
        }, (0, _reactDomFactories.div)({
          className: "pane-info no-original-scopes-info",
          "aria-role": "status"
        }, (0, _reactDomFactories.span)({
          className: "info icon"
        }, _react.default.createElement(_AccessibleImage.default, {
          className: "sourcemap"
        })), L10N.getFormatStr("scopes.noOriginalScopes", L10N.getStr("scopes.showOriginalScopes"))));
      }

      if (isLoading) {
        return (0, _reactDomFactories.div)({
          className: "pane scopes-list"
        }, (0, _reactDomFactories.div)({
          className: "pane-info"
        }, (0, _reactDomFactories.span)({
          className: "info icon"
        }, _react.default.createElement(_AccessibleImage.default, {
          className: "loader"
        })), L10N.getStr("scopes.loadingOriginalScopes")));
      }

      scopes = originalScopes;
    } else {
      if (isLoading) {
        return (0, _reactDomFactories.div)({
          className: "pane scopes-list"
        }, (0, _reactDomFactories.div)({
          className: "pane-info"
        }, (0, _reactDomFactories.span)({
          className: "info icon"
        }, _react.default.createElement(_AccessibleImage.default, {
          className: "loader"
        })), L10N.getStr("loadingText")));
      }

      scopes = generatedScopes;
    }

    function initiallyExpanded(item) {
      return expandedScopes.some(path => path == (0, _scopes.getScopeItemPath)(item));
    }

    if (scopes && !!scopes.length) {
      return (0, _reactDomFactories.div)({
        className: "pane scopes-list"
      }, _react.default.createElement(ObjectInspector, {
        roots: scopes,
        autoExpandAll: false,
        autoExpandDepth: 1,
        client: _firefox.clientCommands,
        createElement: tagName => document.createElement(tagName),
        disableWrap: true,
        dimTopLevelWindow: true,
        frame: selectedFrame,
        mayUseCustomFormatter: true,
        openLink,
        onDOMNodeClick: grip => openElementInInspector(grip),
        onInspectIconClick: grip => openElementInInspector(grip),
        onDOMNodeMouseOver: grip => highlightDomElement(grip),
        onDOMNodeMouseOut: grip => unHighlightDomElement(grip),
        onContextMenu: this.onContextMenu,
        preventBlur: true,
        setExpanded: (path, expand) => setExpandedScope(selectedFrame, path, expand),
        initiallyExpanded,
        renderItemActions: this.renderWatchpointButton,
        shouldRenderTooltip: true
      }));
    }

    return (0, _reactDomFactories.div)({
      className: "pane scopes-list"
    }, (0, _reactDomFactories.div)({
      className: "pane-info"
    }, L10N.getStr("scopes.notAvailable")));
  }

  render() {
    return (0, _reactDomFactories.div)({
      className: "scopes-content"
    }, this.renderScopesList());
  }

}

const mapStateToProps = state => {
  // This component doesn't need any prop when we are not paused
  const selectedFrame = (0, _index2.getSelectedFrame)(state);

  if (!selectedFrame) {
    return {};
  }

  const why = (0, _index2.getPauseReason)(state, selectedFrame.thread);
  const expandedScopes = (0, _index2.getLastExpandedScopes)(state, selectedFrame.thread);
  const isPaused = (0, _index2.getIsCurrentThreadPaused)(state);
  const selectedSource = (0, _index2.getSelectedSource)(state);
  let originalFrameScopes;
  let generatedFrameScopes;
  let isLoading;
  let mapScopesEnabled = false;

  if (selectedSource?.isOriginal && !selectedSource?.isPrettyPrinted && !selectedFrame.generatedLocation?.source.isWasm) {
    const {
      scope,
      pending: originalPending
    } = (0, _index2.getOriginalFrameScope)(state, selectedFrame) || {
      scope: null,
      pending: false
    };
    originalFrameScopes = scope;
    isLoading = originalPending;
    mapScopesEnabled = (0, _index2.isMapScopesEnabled)(state);
  } else {
    const {
      scope,
      pending: generatedPending
    } = (0, _index2.getGeneratedFrameScope)(state, selectedFrame) || {
      scope: null,
      pending: false
    };
    generatedFrameScopes = scope;
    isLoading = generatedPending;
  }

  return {
    originalFrameScopes,
    generatedFrameScopes,
    mapScopesEnabled,
    selectedFrame,
    isLoading,
    why,
    expandedScopes,
    isPaused,
    selectedSource
  };
};

var _default = (0, _reactRedux.connect)(mapStateToProps, {
  openLink: _index.default.openLink,
  openElementInInspector: _index.default.openElementInInspectorCommand,
  highlightDomElement: _index.default.highlightDomElement,
  unHighlightDomElement: _index.default.unHighlightDomElement,
  setExpandedScope: _index.default.setExpandedScope,
  addWatchpoint: _index.default.addWatchpoint,
  removeWatchpoint: _index.default.removeWatchpoint,
  toggleMapScopes: _index.default.toggleMapScopes
})(Scopes);

exports.default = _default;