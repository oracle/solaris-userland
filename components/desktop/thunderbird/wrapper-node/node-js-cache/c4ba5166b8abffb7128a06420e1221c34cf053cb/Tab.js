"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _propTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

loader.lazyRequireGetter(this, "_connect", "devtools/client/debugger/src/utils/connect");
loader.lazyRequireGetter(this, "_menu", "devtools/client/debugger/src/context-menu/menu");

var _SourceIcon = _interopRequireDefault(require("../shared/SourceIcon"));

loader.lazyRequireGetter(this, "_Button", "devtools/client/debugger/src/components/shared/Button/index");
loader.lazyRequireGetter(this, "_clipboard", "devtools/client/debugger/src/utils/clipboard");

var _actions = _interopRequireDefault(require("../../actions/index"));

loader.lazyRequireGetter(this, "_source", "devtools/client/debugger/src/utils/source");
loader.lazyRequireGetter(this, "_tabs", "devtools/client/debugger/src/utils/tabs");
loader.lazyRequireGetter(this, "_location", "devtools/client/debugger/src/utils/location");
loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const classnames = require("devtools/client/shared/classnames.js");

class Tab extends _react.PureComponent {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "onTabContextMenu", (event, tab) => {
      event.preventDefault();
      this.showContextMenu(event, tab);
    });
  }

  static get propTypes() {
    return {
      activeSearch: _propTypes.default.string,
      closeTab: _propTypes.default.func.isRequired,
      closeTabs: _propTypes.default.func.isRequired,
      copyToClipboard: _propTypes.default.func.isRequired,
      cx: _propTypes.default.object.isRequired,
      onDragEnd: _propTypes.default.func.isRequired,
      onDragOver: _propTypes.default.func.isRequired,
      onDragStart: _propTypes.default.func.isRequired,
      selectSource: _propTypes.default.func.isRequired,
      selectedLocation: _propTypes.default.object,
      showSource: _propTypes.default.func.isRequired,
      source: _propTypes.default.object.isRequired,
      sourceActor: _propTypes.default.object.isRequired,
      tabSources: _propTypes.default.array.isRequired,
      toggleBlackBox: _propTypes.default.func.isRequired,
      togglePrettyPrint: _propTypes.default.func.isRequired,
      isBlackBoxed: _propTypes.default.bool.isRequired,
      isSourceOnIgnoreList: _propTypes.default.bool.isRequired
    };
  }

  showContextMenu(e, tab) {
    const {
      cx,
      closeTab,
      closeTabs,
      copyToClipboard,
      tabSources,
      showSource,
      toggleBlackBox,
      togglePrettyPrint,
      selectedLocation,
      source,
      isBlackBoxed,
      isSourceOnIgnoreList
    } = this.props;
    const tabCount = tabSources.length;
    const otherTabs = tabSources.filter(t => t.id !== tab);
    const sourceTab = tabSources.find(t => t.id == tab);
    const tabURLs = tabSources.map(t => t.url);
    const otherTabURLs = otherTabs.map(t => t.url);

    if (!sourceTab || !selectedLocation || !selectedLocation.sourceId) {
      return;
    }

    const tabMenuItems = (0, _tabs.getTabMenuItems)();
    const items = [{
      item: { ...tabMenuItems.closeTab,
        click: () => closeTab(cx, sourceTab)
      }
    }, {
      item: { ...tabMenuItems.closeOtherTabs,
        click: () => closeTabs(cx, otherTabURLs),
        disabled: otherTabURLs.length === 0
      }
    }, {
      item: { ...tabMenuItems.closeTabsToEnd,
        click: () => {
          const tabIndex = tabSources.findIndex(t => t.id == tab);
          closeTabs(cx, tabURLs.filter((t, i) => i > tabIndex));
        },
        disabled: tabCount === 1 || tabSources.some((t, i) => t === tab && tabCount - 1 === i)
      }
    }, {
      item: { ...tabMenuItems.closeAllTabs,
        click: () => closeTabs(cx, tabURLs)
      }
    }, {
      item: {
        type: "separator"
      }
    }, {
      item: { ...tabMenuItems.copySource,
        disabled: selectedLocation.sourceId !== tab,
        click: () => copyToClipboard(sourceTab)
      }
    }, {
      item: { ...tabMenuItems.copySourceUri2,
        disabled: !selectedLocation.sourceUrl,
        click: () => (0, _clipboard.copyToTheClipboard)((0, _source.getRawSourceURL)(sourceTab.url))
      }
    }, {
      item: { ...tabMenuItems.showSource,
        disabled: !selectedLocation.sourceUrl,
        click: () => showSource(cx, tab)
      }
    }, {
      item: { ...tabMenuItems.toggleBlackBox,
        label: isBlackBoxed ? L10N.getStr("ignoreContextItem.unignore") : L10N.getStr("ignoreContextItem.ignore"),
        disabled: isSourceOnIgnoreList || !(0, _source.shouldBlackbox)(source),
        click: () => toggleBlackBox(cx, source)
      }
    }, {
      item: { ...tabMenuItems.prettyPrint,
        click: () => togglePrettyPrint(cx, tab),
        disabled: (0, _source.isPretty)(sourceTab)
      }
    }];
    (0, _menu.showMenu)(e, (0, _menu.buildMenu)(items));
  }

  isSourceSearchEnabled() {
    return this.props.activeSearch === "source";
  }

  render() {
    const {
      cx,
      selectedLocation,
      selectSource,
      closeTab,
      source,
      sourceActor,
      tabSources,
      onDragOver,
      onDragStart,
      onDragEnd
    } = this.props;
    const sourceId = source.id;
    const active = selectedLocation && sourceId == selectedLocation.sourceId && !this.isSourceSearchEnabled();
    const isPrettyCode = (0, _source.isPretty)(source);

    function onClickClose(e) {
      e.stopPropagation();
      closeTab(cx, source);
    }

    function handleTabClick(e) {
      e.preventDefault();
      e.stopPropagation();
      return selectSource(cx, source, sourceActor);
    }

    const className = classnames("source-tab", {
      active,
      pretty: isPrettyCode,
      blackboxed: this.props.isBlackBoxed
    });
    const path = (0, _source.getDisplayPath)(source, tabSources);
    const query = (0, _source.getSourceQueryString)(source);
    return _react.default.createElement("div", {
      draggable: true,
      onDragOver: onDragOver,
      onDragStart: onDragStart,
      onDragEnd: onDragEnd,
      className: className,
      key: sourceId,
      onClick: handleTabClick // Accommodate middle click to close tab
      ,
      onMouseUp: e => e.button === 1 && closeTab(cx, source),
      onContextMenu: e => this.onTabContextMenu(e, sourceId),
      title: (0, _source.getFileURL)(source, false)
    }, _react.default.createElement(_SourceIcon.default, {
      location: (0, _location.createLocation)({
        source,
        sourceActor
      }),
      forTab: true,
      modifier: icon => ["file", "javascript"].includes(icon) ? null : icon
    }), _react.default.createElement("div", {
      className: "filename"
    }, (0, _source.getTruncatedFileName)(source, query), path && _react.default.createElement("span", null, `../${path}/..`)), _react.default.createElement(_Button.CloseButton, {
      handleClick: onClickClose,
      tooltip: L10N.getStr("sourceTabs.closeTabButtonTooltip")
    }));
  }

}

const mapStateToProps = (state, {
  source
}) => {
  return {
    cx: (0, _selectors.getContext)(state),
    tabSources: (0, _selectors.getSourcesForTabs)(state),
    selectedLocation: (0, _selectors.getSelectedLocation)(state),
    isBlackBoxed: (0, _selectors.isSourceBlackBoxed)(state, source),
    isSourceOnIgnoreList: (0, _selectors.isSourceMapIgnoreListEnabled)(state) && (0, _selectors.isSourceOnSourceMapIgnoreList)(state, source),
    activeSearch: (0, _selectors.getActiveSearch)(state)
  };
};

var _default = (0, _connect.connect)(mapStateToProps, {
  selectSource: _actions.default.selectSource,
  copyToClipboard: _actions.default.copyToClipboard,
  closeTab: _actions.default.closeTab,
  closeTabs: _actions.default.closeTabs,
  togglePrettyPrint: _actions.default.togglePrettyPrint,
  showSource: _actions.default.showSource,
  toggleBlackBox: _actions.default.toggleBlackBox
}, null, {
  withRef: true
})(Tab);

exports.default = _default;