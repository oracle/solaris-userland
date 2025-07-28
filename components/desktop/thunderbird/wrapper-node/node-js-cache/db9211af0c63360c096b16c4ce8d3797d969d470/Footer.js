"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _reactDomFactories = require("devtools/client/shared/vendor/react-dom-factories");

var _reactPropTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

var _reactRedux = require("devtools/client/shared/vendor/react-redux");

var _index = _interopRequireDefault(require("../../actions/index"));

loader.lazyRequireGetter(this, "_index2", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_source", "devtools/client/debugger/src/utils/source");
loader.lazyRequireGetter(this, "_index3", "devtools/client/debugger/src/components/shared/Button/index");

var _AccessibleImage = _interopRequireDefault(require("../shared/AccessibleImage"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const classnames = require("resource://devtools/client/shared/classnames.js");

const MenuButton = require("resource://devtools/client/shared/components/menu/MenuButton.js");

const MenuItem = require("resource://devtools/client/shared/components/menu/MenuItem.js");

const MenuList = require("resource://devtools/client/shared/components/menu/MenuList.js");

class SourceFooter extends _react.PureComponent {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "openSourceMap", () => {
      let line, column;

      if (this.props.sourceMapError && this.props.sourceMapError.includes("JSON.parse")) {
        const match = this.props.sourceMapError.match(/at line (\d+) column (\d+)/);

        if (match) {
          line = match[1];
          column = match[2];
        }
      }

      this.props.openSourceMap(this.props.resolvedSourceMapURL || this.props.selectedLocation.source.url, line, column);
    });

    _defineProperty(this, "toggleSourceMaps", () => {
      this.props.toggleSourceMapsEnabled(!this.props.areSourceMapsEnabled);
    });

    _defineProperty(this, "toggleSelectOriginalByDefault", () => {
      this.props.setDefaultSelectedLocation(!this.props.shouldSelectOriginalLocation);
      this.props.jumpToMappedSelectedLocation();
    });
  }

  static get propTypes() {
    return {
      canPrettyPrint: _reactPropTypes.default.bool.isRequired,
      prettyPrintMessage: _reactPropTypes.default.string,
      endPanelCollapsed: _reactPropTypes.default.bool.isRequired,
      horizontal: _reactPropTypes.default.bool.isRequired,
      jumpToMappedLocation: _reactPropTypes.default.func.isRequired,
      mappedSource: _reactPropTypes.default.object,
      selectedSource: _reactPropTypes.default.object,
      selectedLocation: _reactPropTypes.default.object,
      isSelectedSourceBlackBoxed: _reactPropTypes.default.bool,
      sourceLoaded: _reactPropTypes.default.bool.isRequired,
      toggleBlackBox: _reactPropTypes.default.func.isRequired,
      togglePaneCollapse: _reactPropTypes.default.func.isRequired,
      prettyPrintAndSelectSource: _reactPropTypes.default.func.isRequired,
      isSourceOnIgnoreList: _reactPropTypes.default.bool.isRequired
    };
  }

  prettyPrintButton() {
    const {
      selectedSource,
      canPrettyPrint,
      prettyPrintMessage,
      prettyPrintAndSelectSource,
      sourceLoaded
    } = this.props;

    if (!selectedSource) {
      return null;
    }

    if (!sourceLoaded && selectedSource.isPrettyPrinted) {
      return (0, _reactDomFactories.div)({
        className: "action",
        key: "pretty-loader"
      }, _react.default.createElement(_AccessibleImage.default, {
        className: "loader spin"
      }));
    }

    const type = "prettyPrint";
    return (0, _reactDomFactories.button)({
      onClick: () => {
        if (!canPrettyPrint) {
          return;
        }

        prettyPrintAndSelectSource(selectedSource);
      },
      className: classnames("action", type, {
        active: sourceLoaded && canPrettyPrint,
        pretty: (0, _source.isPretty)(selectedSource)
      }),
      key: type,
      title: prettyPrintMessage,
      "aria-label": prettyPrintMessage,
      disabled: !canPrettyPrint
    }, _react.default.createElement(_AccessibleImage.default, {
      className: type
    }));
  }

  blackBoxButton() {
    const {
      selectedSource,
      isSelectedSourceBlackBoxed,
      toggleBlackBox,
      sourceLoaded,
      isSourceOnIgnoreList
    } = this.props;

    if (!selectedSource || !(0, _source.shouldBlackbox)(selectedSource)) {
      return null;
    }

    let tooltip = isSelectedSourceBlackBoxed ? L10N.getStr("sourceFooter.unignore") : L10N.getStr("sourceFooter.ignore");

    if (isSourceOnIgnoreList) {
      tooltip = L10N.getStr("sourceFooter.ignoreList");
    }

    const type = "black-box";
    return (0, _reactDomFactories.button)({
      onClick: () => toggleBlackBox(selectedSource),
      className: classnames("action", type, {
        active: sourceLoaded,
        blackboxed: isSelectedSourceBlackBoxed || isSourceOnIgnoreList
      }),
      key: type,
      title: tooltip,
      "aria-label": tooltip,
      disabled: isSourceOnIgnoreList
    }, _react.default.createElement(_AccessibleImage.default, {
      className: "blackBox"
    }));
  }

  renderToggleButton() {
    if (this.props.horizontal) {
      return null;
    }

    return _react.default.createElement(_index3.PaneToggleButton, {
      key: "toggle",
      collapsed: this.props.endPanelCollapsed,
      horizontal: this.props.horizontal,
      handleClick: this.props.togglePaneCollapse,
      position: "end"
    });
  }

  renderCommands() {
    const commands = [this.blackBoxButton(), this.prettyPrintButton(), this.renderSourceMapButton()].filter(Boolean);
    return commands.length ? (0, _reactDomFactories.div)({
      className: "commands"
    }, commands) : null;
  }

  renderMappedSource() {
    const {
      mappedSource,
      jumpToMappedLocation,
      selectedLocation
    } = this.props;

    if (!mappedSource) {
      return null;
    }

    const tooltip = L10N.getFormatStr(mappedSource.isOriginal ? "sourceFooter.mappedOriginalSource.tooltip" : "sourceFooter.mappedGeneratedSource.tooltip", mappedSource.url);
    const label = L10N.getFormatStr(mappedSource.isOriginal ? "sourceFooter.mappedOriginalSource.title" : "sourceFooter.mappedGeneratedSource.title", mappedSource.shortName);
    return (0, _reactDomFactories.button)({
      className: "mapped-source",
      onClick: () => jumpToMappedLocation(selectedLocation),
      title: tooltip
    }, (0, _reactDomFactories.span)(null, label));
  }

  renderCursorPosition() {
    // When we open a new source, there is no particular location selected and the line will be set to zero or falsy
    if (!this.props.selectedLocation || !this.props.selectedLocation.line) {
      return null;
    } // Note that line is 1-based while column is 0-based.


    const {
      line,
      column
    } = this.props.selectedLocation;
    const text = L10N.getFormatStr("sourceFooter.currentCursorPosition", line, column + 1);
    const title = L10N.getFormatStr("sourceFooter.currentCursorPosition.tooltip", line, column + 1);
    return (0, _reactDomFactories.div)({
      className: "cursor-position",
      title
    }, text);
  }

  getSourceMapLabel() {
    if (!this.props.selectedLocation) {
      return undefined;
    }

    if (!this.props.areSourceMapsEnabled) {
      return L10N.getStr("sourceFooter.sourceMapButton.disabled");
    }

    if (this.props.sourceMapError) {
      return undefined;
    }

    if (!this.props.isSourceActorWithSourceMap) {
      return L10N.getStr("sourceFooter.sourceMapButton.sourceNotMapped");
    }

    if (this.props.selectedLocation.source.isOriginal) {
      return L10N.getStr("sourceFooter.sourceMapButton.isOriginalSource");
    }

    return L10N.getStr("sourceFooter.sourceMapButton.isBundleSource");
  }

  getSourceMapTitle() {
    if (this.props.sourceMapError) {
      return L10N.getFormatStr("sourceFooter.sourceMapButton.errorTitle", this.props.sourceMapError);
    }

    if (this.props.isSourceMapLoading) {
      return L10N.getStr("sourceFooter.sourceMapButton.loadingTitle");
    }

    return L10N.getStr("sourceFooter.sourceMapButton.title");
  }

  renderSourceMapButton() {
    const {
      toolboxDoc
    } = this.context;
    return _react.default.createElement(MenuButton, {
      menuId: "debugger-source-map-button",
      key: "debugger-source-map-button",
      toolboxDoc,
      className: classnames("devtools-button", "debugger-source-map-button", {
        error: !!this.props.sourceMapError,
        loading: this.props.isSourceMapLoading,
        disabled: !this.props.areSourceMapsEnabled,
        "not-mapped": !this.props.selectedLocation?.source.isOriginal && !this.props.isSourceActorWithSourceMap,
        original: this.props.selectedLocation?.source.isOriginal
      }),
      title: this.getSourceMapTitle(),
      label: this.getSourceMapLabel(),
      icon: true
    }, () => this.renderSourceMapMenuItems());
  }

  renderSourceMapMenuItems() {
    const items = [_react.default.createElement(MenuItem, {
      className: "menu-item debugger-source-map-enabled",
      checked: this.props.areSourceMapsEnabled,
      label: L10N.getStr("sourceFooter.sourceMapButton.enable"),
      onClick: this.toggleSourceMaps
    }), (0, _reactDomFactories.hr)(), _react.default.createElement(MenuItem, {
      className: "menu-item debugger-source-map-open-original",
      checked: this.props.shouldSelectOriginalLocation,
      label: L10N.getStr("sourceFooter.sourceMapButton.showOriginalSourceByDefault"),
      onClick: this.toggleSelectOriginalByDefault
    })];

    if (this.props.mappedSource) {
      items.push(_react.default.createElement(MenuItem, {
        className: "menu-item debugger-jump-mapped-source",
        label: this.props.mappedSource.isOriginal ? L10N.getStr("sourceFooter.sourceMapButton.jumpToOriginalSource") : L10N.getStr("sourceFooter.sourceMapButton.jumpToGeneratedSource"),
        tooltip: this.props.mappedSource.url,
        onClick: () => this.props.jumpToMappedLocation(this.props.selectedLocation)
      }));
    }

    if (this.props.resolvedSourceMapURL) {
      items.push(_react.default.createElement(MenuItem, {
        className: "menu-item debugger-source-map-link",
        label: L10N.getStr("sourceFooter.sourceMapButton.openSourceMapInNewTab"),
        onClick: this.openSourceMap
      }));
    }

    return _react.default.createElement(MenuList, {
      id: "debugger-source-map-list"
    }, items);
  }

  render() {
    return (0, _reactDomFactories.div)({
      className: "source-footer"
    }, (0, _reactDomFactories.div)({
      className: "source-footer-start"
    }, this.renderCommands()), (0, _reactDomFactories.div)({
      className: "source-footer-end"
    }, this.renderMappedSource(), this.renderCursorPosition(), this.renderToggleButton()));
  }

}

SourceFooter.contextTypes = {
  toolboxDoc: _reactPropTypes.default.object
};

const mapStateToProps = state => {
  const selectedSource = (0, _index2.getSelectedSource)(state);
  const selectedLocation = (0, _index2.getSelectedLocation)(state);
  const sourceTextContent = (0, _index2.getSelectedSourceTextContent)(state);
  const areSourceMapsEnabledProp = (0, _index2.areSourceMapsEnabled)(state);
  const isSourceActorWithSourceMapProp = selectedLocation?.sourceActor ? (0, _index2.isSourceActorWithSourceMap)(state, selectedLocation?.sourceActor.id) : false;
  const sourceMapError = selectedLocation?.sourceActor ? (0, _index2.getSourceMapErrorForSourceActor)(state, selectedLocation.sourceActor.id) : null;
  const mappedSource = (0, _index2.getSelectedMappedSource)(state);
  const isSourceMapLoading = areSourceMapsEnabledProp && isSourceActorWithSourceMapProp && // `mappedSource` will be null while loading, we need another way to know when it is done computing
  !mappedSource && (0, _index2.isSelectedMappedSourceLoading)(state) && !sourceMapError;
  return {
    selectedSource,
    selectedLocation,
    isSelectedSourceBlackBoxed: selectedSource ? (0, _index2.isSourceBlackBoxed)(state, selectedSource) : null,
    isSourceOnIgnoreList: (0, _index2.isSourceMapIgnoreListEnabled)(state) && (0, _index2.isSourceOnSourceMapIgnoreList)(state, selectedSource),
    sourceLoaded: !!sourceTextContent,
    mappedSource,
    isSourceMapLoading,
    prettySource: (0, _index2.getPrettySource)(state, selectedSource ? selectedSource.id : null),
    endPanelCollapsed: (0, _index2.getPaneCollapse)(state, "end"),
    canPrettyPrint: selectedLocation ? (0, _index2.canPrettyPrintSource)(state, selectedLocation) : false,
    prettyPrintMessage: selectedLocation ? (0, _index2.getPrettyPrintMessage)(state, selectedLocation) : null,
    sourceMapError,
    resolvedSourceMapURL: selectedLocation?.sourceActor ? (0, _index2.getSourceMapResolvedURL)(state, selectedLocation.sourceActor.id) : null,
    isSourceActorWithSourceMap: isSourceActorWithSourceMapProp,
    areSourceMapsEnabled: areSourceMapsEnabledProp,
    shouldSelectOriginalLocation: (0, _index2.getShouldSelectOriginalLocation)(state)
  };
};

var _default = (0, _reactRedux.connect)(mapStateToProps, {
  prettyPrintAndSelectSource: _index.default.prettyPrintAndSelectSource,
  toggleBlackBox: _index.default.toggleBlackBox,
  jumpToMappedLocation: _index.default.jumpToMappedLocation,
  togglePaneCollapse: _index.default.togglePaneCollapse,
  toggleSourceMapsEnabled: _index.default.toggleSourceMapsEnabled,
  setDefaultSelectedLocation: _index.default.setDefaultSelectedLocation,
  jumpToMappedSelectedLocation: _index.default.jumpToMappedSelectedLocation,
  openSourceMap: _index.default.openSourceMap
})(SourceFooter);

exports.default = _default;