"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

loader.lazyRequireGetter(this, "_connect", "devtools/client/debugger/src/utils/connect");

var _devtoolsContextmenu = require("devtools/client/debugger/dist/vendors").vendored["devtools-contextmenu"];

var _SourceIcon = _interopRequireDefault(require("../shared/SourceIcon"));

loader.lazyRequireGetter(this, "_Button", "devtools/client/debugger/src/components/shared/Button/index");
loader.lazyRequireGetter(this, "_clipboard", "devtools/client/debugger/src/utils/clipboard");

var _actions = _interopRequireDefault(require("../../actions/index"));

loader.lazyRequireGetter(this, "_source", "devtools/client/debugger/src/utils/source");
loader.lazyRequireGetter(this, "_tabs", "devtools/client/debugger/src/utils/tabs");
loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");

var _classnames = _interopRequireDefault(require("devtools/client/debugger/dist/vendors").vendored["classnames"]);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Tab extends _react.PureComponent {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "onTabContextMenu", (event, tab) => {
      event.preventDefault();
      this.showContextMenu(event, tab);
    });
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
      selectedSource,
      source
    } = this.props;
    const tabCount = tabSources.length;
    const otherTabs = tabSources.filter(t => t.id !== tab);
    const sourceTab = tabSources.find(t => t.id == tab);
    const tabURLs = tabSources.map(t => t.url);
    const otherTabURLs = otherTabs.map(t => t.url);

    if (!sourceTab || !selectedSource) {
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
      item: { ...tabMenuItems.copyToClipboard,
        disabled: selectedSource.id !== tab,
        click: () => copyToClipboard(sourceTab)
      }
    }, {
      item: { ...tabMenuItems.copySourceUri2,
        disabled: !selectedSource.url,
        click: () => (0, _clipboard.copyToTheClipboard)((0, _source.getRawSourceURL)(sourceTab.url))
      }
    }, {
      item: { ...tabMenuItems.showSource,
        disabled: !selectedSource.url,
        click: () => showSource(cx, tab)
      }
    }, {
      item: { ...tabMenuItems.toggleBlackBox,
        label: source.isBlackBoxed ? L10N.getStr("blackboxContextItem.unblackbox") : L10N.getStr("blackboxContextItem.blackbox"),
        disabled: !(0, _source.shouldBlackbox)(source),
        click: () => toggleBlackBox(cx, source)
      }
    }, {
      item: { ...tabMenuItems.prettyPrint,
        click: () => togglePrettyPrint(cx, tab),
        disabled: (0, _source.isPretty)(sourceTab)
      }
    }];
    (0, _devtoolsContextmenu.showMenu)(e, (0, _devtoolsContextmenu.buildMenu)(items));
  }

  isProjectSearchEnabled() {
    return this.props.activeSearch === "project";
  }

  isSourceSearchEnabled() {
    return this.props.activeSearch === "source";
  }

  render() {
    const {
      cx,
      selectedSource,
      selectSource,
      closeTab,
      source,
      tabSources,
      hasSiblingOfSameName,
      onDragOver,
      onDragStart,
      onDragEnd
    } = this.props;
    const sourceId = source.id;
    const active = selectedSource && sourceId == selectedSource.id && !this.isProjectSearchEnabled() && !this.isSourceSearchEnabled();
    const isPrettyCode = (0, _source.isPretty)(source);

    function onClickClose(e) {
      e.stopPropagation();
      closeTab(cx, source);
    }

    function handleTabClick(e) {
      e.preventDefault();
      e.stopPropagation();
      return selectSource(cx, sourceId);
    }

    const className = (0, _classnames.default)("source-tab", {
      active,
      pretty: isPrettyCode
    });
    const path = (0, _source.getDisplayPath)(source, tabSources);
    const query = hasSiblingOfSameName ? (0, _source.getSourceQueryString)(source) : "";
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
      source: source,
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
  const selectedSource = (0, _selectors.getSelectedSource)(state);
  return {
    cx: (0, _selectors.getContext)(state),
    tabSources: (0, _selectors.getSourcesForTabs)(state),
    selectedSource,
    activeSearch: (0, _selectors.getActiveSearch)(state),
    hasSiblingOfSameName: (0, _selectors.getHasSiblingOfSameName)(state, source)
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