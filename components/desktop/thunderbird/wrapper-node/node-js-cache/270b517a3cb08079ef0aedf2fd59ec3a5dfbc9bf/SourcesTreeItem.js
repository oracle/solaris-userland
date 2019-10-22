"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("devtools/client/shared/vendor/react");

var _react2 = _interopRequireDefault(_react);

var _connect = require("../../utils/connect");

var _classnames = require("devtools/client/debugger/dist/vendors").vendored["classnames"];

var _classnames2 = _interopRequireDefault(_classnames);

var _devtoolsContextmenu = require("devtools/client/debugger/dist/vendors").vendored["devtools-contextmenu"];

var _SourceIcon = require("../shared/SourceIcon");

var _SourceIcon2 = _interopRequireDefault(_SourceIcon);

var _AccessibleImage = require("../shared/AccessibleImage");

var _AccessibleImage2 = _interopRequireDefault(_AccessibleImage);

var _workers = require("../../utils/workers");

var _selectors = require("../../selectors/index");

var _actions = require("../../actions/index");

var _actions2 = _interopRequireDefault(_actions);

var _source = require("../../utils/source");

var _sourcesTree = require("../../utils/sources-tree/index");

var _clipboard = require("../../utils/clipboard");

var _prefs = require("../../utils/prefs");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class SourceTreeItem extends _react.Component {
  constructor(...args) {
    var _temp;

    return _temp = super(...args), this.onClick = e => {
      const { item, focusItem, selectItem } = this.props;

      focusItem(item);
      if (!(0, _sourcesTree.isDirectory)(item)) {
        selectItem(item);
      }
    }, this.onContextMenu = (event, item) => {
      const copySourceUri2Label = L10N.getStr("copySourceUri2");
      const copySourceUri2Key = L10N.getStr("copySourceUri2.accesskey");
      const setDirectoryRootLabel = L10N.getStr("setDirectoryRoot.label");
      const setDirectoryRootKey = L10N.getStr("setDirectoryRoot.accesskey");
      const removeDirectoryRootLabel = L10N.getStr("removeDirectoryRoot.label");

      event.stopPropagation();
      event.preventDefault();

      const menuOptions = [];

      if (!(0, _sourcesTree.isDirectory)(item)) {
        // Flow requires some extra handling to ensure the value of contents.
        const { contents } = item;

        if (!Array.isArray(contents)) {
          const copySourceUri2 = {
            id: "node-menu-copy-source",
            label: copySourceUri2Label,
            accesskey: copySourceUri2Key,
            disabled: false,
            click: () => (0, _clipboard.copyToTheClipboard)(contents.url)
          };

          const { cx, source } = this.props;
          if (source) {
            const blackBoxMenuItem = {
              id: "node-menu-blackbox",
              label: source.isBlackBoxed ? L10N.getStr("sourceFooter.unblackbox") : L10N.getStr("sourceFooter.blackbox"),
              accesskey: L10N.getStr("sourceFooter.blackbox.accesskey"),
              disabled: !(0, _source.shouldBlackbox)(source),
              click: () => this.props.toggleBlackBox(cx, source)
            };
            menuOptions.push(copySourceUri2, blackBoxMenuItem);
          }
        }
      }

      if ((0, _sourcesTree.isDirectory)(item)) {
        this.addCollapseExpandAllOptions(menuOptions, item);

        if (_prefs.features.root) {
          const { path } = item;
          const { cx, projectRoot } = this.props;

          if (projectRoot.endsWith(path)) {
            menuOptions.push({
              id: "node-remove-directory-root",
              label: removeDirectoryRootLabel,
              disabled: false,
              click: () => this.props.clearProjectDirectoryRoot(cx)
            });
          } else {
            menuOptions.push({
              id: "node-set-directory-root",
              label: setDirectoryRootLabel,
              accesskey: setDirectoryRootKey,
              disabled: false,
              click: () => this.props.setProjectDirectoryRoot(cx, path)
            });
          }
        }
      }

      (0, _devtoolsContextmenu.showMenu)(event, menuOptions);
    }, this.addCollapseExpandAllOptions = (menuOptions, item) => {
      const { setExpanded } = this.props;

      menuOptions.push({
        id: "node-menu-collapse-all",
        label: L10N.getStr("collapseAll.label"),
        disabled: false,
        click: () => setExpanded(item, false, true)
      });

      menuOptions.push({
        id: "node-menu-expand-all",
        label: L10N.getStr("expandAll.label"),
        disabled: false,
        click: () => setExpanded(item, true, true)
      });
    }, _temp;
  }

  componentDidMount() {
    const { autoExpand, item } = this.props;
    if (autoExpand) {
      this.props.setExpanded(item, true, false);
    }
  }

  renderItemArrow() {
    const { item, expanded } = this.props;
    return (0, _sourcesTree.isDirectory)(item) ? _react2.default.createElement(_AccessibleImage2.default, { className: (0, _classnames2.default)("arrow", { expanded }) }) : _react2.default.createElement("span", { className: "img no-arrow" });
  }

  renderIcon(item, depth) {
    const {
      debuggeeUrl,
      projectRoot,
      source,
      hasPrettySource,
      threads
    } = this.props;

    if (item.name === "webpack://") {
      return _react2.default.createElement(_AccessibleImage2.default, { className: "webpack" });
    } else if (item.name === "ng://") {
      return _react2.default.createElement(_AccessibleImage2.default, { className: "angular" });
    } else if ((0, _source.isUrlExtension)(item.path) && depth === 1) {
      return _react2.default.createElement(_AccessibleImage2.default, { className: "extension" });
    }

    // Threads level
    if (depth === 0 && projectRoot === "") {
      const thread = threads.find(thrd => thrd.actor == item.name);

      if (thread) {
        const icon = thread === this.props.mainThread ? "window" : "worker";
        return _react2.default.createElement(_AccessibleImage2.default, {
          className: (0, _classnames2.default)(icon, {
            debuggee: debuggeeUrl && debuggeeUrl.includes(item.name)
          })
        });
      }
    }

    if ((0, _sourcesTree.isDirectory)(item)) {
      // Domain level
      if (depth === 1) {
        return _react2.default.createElement(_AccessibleImage2.default, { className: "globe-small" });
      }
      return _react2.default.createElement(_AccessibleImage2.default, { className: "folder" });
    }

    if (hasPrettySource) {
      return _react2.default.createElement(_AccessibleImage2.default, { className: "prettyPrint" });
    }

    if (source) {
      return _react2.default.createElement(_SourceIcon2.default, { source: source });
    }

    return null;
  }

  renderItemName(depth) {
    const { item, threads } = this.props;

    if (depth === 0) {
      const thread = threads.find(({ actor }) => actor == item.name);
      if (thread) {
        return (0, _workers.isWorker)(thread) ? (0, _workers.getDisplayName)(thread) : L10N.getStr("mainThread");
      }
    }

    switch (item.name) {
      case "ng://":
        return "Angular";
      case "webpack://":
        return "Webpack";
      default:
        return `${unescape(item.name)}`;
    }
  }

  render() {
    const {
      item,
      depth,
      source,
      focused,
      hasMatchingGeneratedSource,
      hasSiblingOfSameName
    } = this.props;

    const suffix = hasMatchingGeneratedSource ? _react2.default.createElement(
      "span",
      { className: "suffix" },
      L10N.getStr("sourceFooter.mappedSuffix")
    ) : null;

    let querystring;
    if (hasSiblingOfSameName) {
      querystring = (0, _source.getSourceQueryString)(source);
    }

    const query = hasSiblingOfSameName && querystring ? _react2.default.createElement(
      "span",
      { className: "query" },
      querystring
    ) : null;

    return _react2.default.createElement(
      "div",
      {
        className: (0, _classnames2.default)("node", { focused }),
        key: item.path,
        onClick: this.onClick,
        onContextMenu: e => this.onContextMenu(e, item)
      },
      this.renderItemArrow(),
      this.renderIcon(item, depth),
      _react2.default.createElement(
        "span",
        { className: "label" },
        this.renderItemName(depth),
        query,
        " ",
        suffix
      )
    );
  }
} /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

function getHasMatchingGeneratedSource(state, source) {
  if (!source || !(0, _source.isOriginal)(source)) {
    return false;
  }

  return !!(0, _selectors.getGeneratedSourceByURL)(state, source.url);
}

const mapStateToProps = (state, props) => {
  const { source } = props;
  return {
    cx: (0, _selectors.getContext)(state),
    mainThread: (0, _selectors.getMainThread)(state),
    hasMatchingGeneratedSource: getHasMatchingGeneratedSource(state, source),
    hasSiblingOfSameName: (0, _selectors.getHasSiblingOfSameName)(state, source),
    hasPrettySource: source ? (0, _selectors.hasPrettySource)(state, source.id) : false
  };
};

exports.default = (0, _connect.connect)(mapStateToProps, {
  setProjectDirectoryRoot: _actions2.default.setProjectDirectoryRoot,
  clearProjectDirectoryRoot: _actions2.default.clearProjectDirectoryRoot,
  toggleBlackBox: _actions2.default.toggleBlackBox
})(SourceTreeItem);