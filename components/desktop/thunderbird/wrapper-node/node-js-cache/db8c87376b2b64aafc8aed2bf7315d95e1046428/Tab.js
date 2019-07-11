"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("devtools/client/shared/vendor/react");

var _react2 = _interopRequireDefault(_react);

var _connect = require("../../utils/connect");

var _devtoolsContextmenu = require("devtools/client/debugger/dist/vendors").vendored["devtools-contextmenu"];

var _SourceIcon = require("../shared/SourceIcon");

var _SourceIcon2 = _interopRequireDefault(_SourceIcon);

var _Button = require("../shared/Button/index");

var _actions = require("../../actions/index");

var _actions2 = _interopRequireDefault(_actions);

var _source = require("../../utils/source");

var _clipboard = require("../../utils/clipboard");

var _tabs = require("../../utils/tabs");

var _selectors = require("../../selectors/index");

var _classnames = require("devtools/client/debugger/dist/vendors").vendored["classnames"];

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Tab extends _react.PureComponent {
  constructor(...args) {
    var _temp;

    return _temp = super(...args), this.onTabContextMenu = (event, tab) => {
      event.preventDefault();
      this.showContextMenu(event, tab);
    }, _temp;
  }

  showContextMenu(e, tab) {
    const {
      cx,
      closeTab,
      closeTabs,
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

    if (!sourceTab) {
      return;
    }

    const tabMenuItems = (0, _tabs.getTabMenuItems)();
    const items = [{
      item: {
        ...tabMenuItems.closeTab,
        click: () => closeTab(cx, sourceTab)
      }
    }, {
      item: {
        ...tabMenuItems.closeOtherTabs,
        click: () => closeTabs(cx, otherTabURLs),
        disabled: otherTabURLs.length === 0
      }
    }, {
      item: {
        ...tabMenuItems.closeTabsToEnd,
        click: () => {
          const tabIndex = tabSources.findIndex(t => t.id == tab);
          closeTabs(cx, tabURLs.filter((t, i) => i > tabIndex));
        },
        disabled: tabCount === 1 || tabSources.some((t, i) => t === tab && tabCount - 1 === i)
      }
    }, {
      item: {
        ...tabMenuItems.closeAllTabs,
        click: () => closeTabs(cx, tabURLs)
      }
    }, { item: { type: "separator" } }, {
      item: {
        ...tabMenuItems.copyToClipboard,
        disabled: selectedSource.id !== tab,
        click: () => (0, _clipboard.copyToTheClipboard)(sourceTab.text)
      }
    }, {
      item: {
        ...tabMenuItems.copySourceUri2,
        disabled: !selectedSource.url,
        click: () => (0, _clipboard.copyToTheClipboard)((0, _source.getRawSourceURL)(sourceTab.url))
      }
    }, {
      item: {
        ...tabMenuItems.showSource,
        disabled: !selectedSource.url,
        click: () => showSource(cx, tab)
      }
    }, {
      item: {
        ...tabMenuItems.toggleBlackBox,
        label: source.isBlackBoxed ? L10N.getStr("sourceFooter.unblackbox") : L10N.getStr("sourceFooter.blackbox"),
        disabled: !(0, _source.shouldBlackbox)(source),
        click: () => toggleBlackBox(cx, source)
      }
    }, {
      item: {
        ...tabMenuItems.prettyPrint,
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
      hasSiblingOfSameName
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

    const className = (0, _classnames2.default)("source-tab", {
      active,
      pretty: isPrettyCode
    });

    const path = (0, _source.getDisplayPath)(source, tabSources);
    const query = hasSiblingOfSameName ? (0, _source.getSourceQueryString)(source) : "";

    return _react2.default.createElement(
      "div",
      {
        className: className,
        key: sourceId,
        onClick: handleTabClick
        // Accommodate middle click to close tab
        , onMouseUp: e => e.button === 1 && closeTab(cx, source),
        onContextMenu: e => this.onTabContextMenu(e, sourceId),
        title: (0, _source.getFileURL)(source, false)
      },
      _react2.default.createElement(_SourceIcon2.default, {
        source: source,
        shouldHide: icon => ["file", "javascript"].includes(icon)
      }),
      _react2.default.createElement(
        "div",
        { className: "filename" },
        (0, _source.getTruncatedFileName)(source, query),
        path && _react2.default.createElement(
          "span",
          null,
          `../${path}/..`
        )
      ),
      _react2.default.createElement(_Button.CloseButton, {
        handleClick: onClickClose,
        tooltip: L10N.getStr("sourceTabs.closeTabButtonTooltip")
      })
    );
  }
} /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

const mapStateToProps = (state, { source }) => {
  const selectedSource = (0, _selectors.getSelectedSource)(state);

  return {
    cx: (0, _selectors.getContext)(state),
    tabSources: (0, _selectors.getSourcesForTabs)(state),
    selectedSource: selectedSource,
    activeSearch: (0, _selectors.getActiveSearch)(state),
    hasSiblingOfSameName: (0, _selectors.getHasSiblingOfSameName)(state, source)
  };
};

exports.default = (0, _connect.connect)(mapStateToProps, {
  selectSource: _actions2.default.selectSource,
  closeTab: _actions2.default.closeTab,
  closeTabs: _actions2.default.closeTabs,
  togglePrettyPrint: _actions2.default.togglePrettyPrint,
  showSource: _actions2.default.showSource,
  toggleBlackBox: _actions2.default.toggleBlackBox
})(Tab);