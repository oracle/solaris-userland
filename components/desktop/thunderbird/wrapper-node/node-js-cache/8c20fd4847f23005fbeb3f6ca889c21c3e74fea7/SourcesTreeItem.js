"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

loader.lazyRequireGetter(this, "_connect", "devtools/client/debugger/src/utils/connect");

var _classnames = _interopRequireDefault(require("devtools/client/debugger/dist/vendors").vendored["classnames"]);

var _devtoolsContextmenu = require("devtools/client/debugger/dist/vendors").vendored["devtools-contextmenu"];

var _SourceIcon = _interopRequireDefault(require("../shared/SourceIcon"));

var _AccessibleImage = _interopRequireDefault(require("../shared/AccessibleImage"));

loader.lazyRequireGetter(this, "_threads", "devtools/client/debugger/src/utils/threads");
loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");

var _actions = _interopRequireDefault(require("../../actions/index"));

loader.lazyRequireGetter(this, "_source", "devtools/client/debugger/src/utils/source");
loader.lazyRequireGetter(this, "_sourcesTree", "devtools/client/debugger/src/utils/sources-tree/index");
loader.lazyRequireGetter(this, "_clipboard", "devtools/client/debugger/src/utils/clipboard");
loader.lazyRequireGetter(this, "_prefs", "devtools/client/debugger/src/utils/prefs");
loader.lazyRequireGetter(this, "_utils", "devtools/client/debugger/src/utils/utils");
loader.lazyRequireGetter(this, "_asyncValue", "devtools/client/debugger/src/utils/async-value");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class SourceTreeItem extends _react.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "onClick", e => {
      const {
        item,
        focusItem,
        selectItem
      } = this.props;
      focusItem(item);

      if (!(0, _sourcesTree.isDirectory)(item)) {
        selectItem(item);
      }
    });

    _defineProperty(this, "onContextMenu", (event, item) => {
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
        const {
          contents
        } = item;

        if (!Array.isArray(contents)) {
          const copySourceUri2 = {
            id: "node-menu-copy-source",
            label: copySourceUri2Label,
            accesskey: copySourceUri2Key,
            disabled: false,
            click: () => (0, _clipboard.copyToTheClipboard)(contents.url)
          };
          const {
            cx,
            source
          } = this.props;

          if (source) {
            const blackBoxMenuItem = {
              id: "node-menu-blackbox",
              label: source.isBlackBoxed ? L10N.getStr("blackboxContextItem.unblackbox") : L10N.getStr("blackboxContextItem.blackbox"),
              accesskey: source.isBlackBoxed ? L10N.getStr("blackboxContextItem.unblackbox.accesskey") : L10N.getStr("blackboxContextItem.blackbox.accesskey"),
              disabled: !(0, _source.shouldBlackbox)(source),
              click: () => this.props.toggleBlackBox(cx, source)
            };
            const downloadFileItem = {
              id: "node-menu-download-file",
              label: L10N.getStr("downloadFile.label"),
              accesskey: L10N.getStr("downloadFile.accesskey"),
              disabled: false,
              click: () => this.handleDownloadFile(cx, source, item)
            };
            menuOptions.push(copySourceUri2, blackBoxMenuItem, downloadFileItem);
          }
        }
      }

      if ((0, _sourcesTree.isDirectory)(item)) {
        this.addCollapseExpandAllOptions(menuOptions, item);

        if (_prefs.features.root) {
          const {
            path
          } = item;
          const {
            cx,
            projectRoot
          } = this.props;

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

        this.addBlackboxAllOption(menuOptions, item);
      }

      (0, _devtoolsContextmenu.showMenu)(event, menuOptions);
    });

    _defineProperty(this, "handleDownloadFile", async (cx, source, item) => {
      if (!source) {
        return;
      }

      if (!this.props.sourceContent) {
        await this.props.loadSourceText({
          cx,
          source
        });
      }

      const data = this.props.sourceContent;

      if (!data) {
        return;
      }

      (0, _utils.downloadFile)(data, item.name);
    });

    _defineProperty(this, "addBlackboxAllOption", (menuOptions, item) => {
      const {
        cx,
        depth,
        projectRoot
      } = this.props;
      const {
        sourcesInside,
        sourcesOuside
      } = this.props.getSourcesGroups(item);
      const allInsideBlackBoxed = sourcesInside.every(source => source.isBlackBoxed);
      const allOusideBlackBoxed = sourcesOuside.every(source => source.isBlackBoxed);
      let blackBoxInsideMenuItemLabel;
      let blackBoxOutsideMenuItemLabel;

      if (depth === 0 || depth === 1 && projectRoot === "") {
        blackBoxInsideMenuItemLabel = allInsideBlackBoxed ? L10N.getStr("unblackBoxAllInGroup.label") : L10N.getStr("blackBoxAllInGroup.label");

        if (sourcesOuside.length > 0) {
          blackBoxOutsideMenuItemLabel = allOusideBlackBoxed ? L10N.getStr("unblackBoxAllOutsideGroup.label") : L10N.getStr("blackBoxAllOutsideGroup.label");
        }
      } else {
        blackBoxInsideMenuItemLabel = allInsideBlackBoxed ? L10N.getStr("unblackBoxAllInDir.label") : L10N.getStr("blackBoxAllInDir.label");

        if (sourcesOuside.length > 0) {
          blackBoxOutsideMenuItemLabel = allOusideBlackBoxed ? L10N.getStr("unblackBoxAllOutsideDir.label") : L10N.getStr("blackBoxAllOutsideDir.label");
        }
      }

      const blackBoxInsideMenuItem = {
        id: allInsideBlackBoxed ? "node-unblackbox-all-inside" : "node-blackbox-all-inside",
        label: blackBoxInsideMenuItemLabel,
        disabled: false,
        click: () => this.props.blackBoxSources(cx, sourcesInside, !allInsideBlackBoxed)
      };

      if (sourcesOuside.length > 0) {
        menuOptions.push({
          id: "node-blackbox-all",
          label: L10N.getStr("blackBoxAll.label"),
          submenu: [blackBoxInsideMenuItem, {
            id: allOusideBlackBoxed ? "node-unblackbox-all-outside" : "node-blackbox-all-outside",
            label: blackBoxOutsideMenuItemLabel,
            disabled: false,
            click: () => this.props.blackBoxSources(cx, sourcesOuside, !allOusideBlackBoxed)
          }]
        });
      } else {
        menuOptions.push(blackBoxInsideMenuItem);
      }
    });

    _defineProperty(this, "addCollapseExpandAllOptions", (menuOptions, item) => {
      const {
        setExpanded
      } = this.props;
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
    });
  }

  componentDidMount() {
    const {
      autoExpand,
      item
    } = this.props;

    if (autoExpand) {
      this.props.setExpanded(item, true, false);
    }
  }

  renderItemArrow() {
    const {
      item,
      expanded
    } = this.props;
    return (0, _sourcesTree.isDirectory)(item) ? _react.default.createElement(_AccessibleImage.default, {
      className: (0, _classnames.default)("arrow", {
        expanded
      })
    }) : _react.default.createElement("span", {
      className: "img no-arrow"
    });
  }

  renderIcon(item, depth) {
    const {
      debuggeeUrl,
      projectRoot,
      source,
      hasPrettyTab,
      threads
    } = this.props;

    if (item.name === "webpack://") {
      return _react.default.createElement(_AccessibleImage.default, {
        className: "webpack"
      });
    } else if (item.name === "ng://") {
      return _react.default.createElement(_AccessibleImage.default, {
        className: "angular"
      });
    } else if ((0, _source.isExtensionDirectoryPath)(item.path)) {
      return _react.default.createElement(_AccessibleImage.default, {
        className: "extension"
      });
    } // Threads level


    if (depth === 0 && projectRoot === "") {
      const thread = threads.find(thrd => thrd.actor == item.name);

      if (thread) {
        const icon = (0, _threads.isWorker)(thread) ? "worker" : "window";
        return _react.default.createElement(_AccessibleImage.default, {
          className: (0, _classnames.default)(icon, {
            debuggee: debuggeeUrl && debuggeeUrl.includes(item.name)
          })
        });
      }
    }

    if ((0, _sourcesTree.isDirectory)(item)) {
      // Domain level
      if (depth === 1 && projectRoot === "" || depth === 0 && threads.find(thrd => thrd.actor === projectRoot)) {
        return _react.default.createElement(_AccessibleImage.default, {
          className: "globe-small"
        });
      }

      return _react.default.createElement(_AccessibleImage.default, {
        className: "folder"
      });
    }

    if (source === null || source === void 0 ? void 0 : source.isBlackBoxed) {
      return _react.default.createElement(_AccessibleImage.default, {
        className: "blackBox"
      });
    }

    if (hasPrettyTab) {
      return _react.default.createElement(_AccessibleImage.default, {
        className: "prettyPrint"
      });
    }

    if (source) {
      return _react.default.createElement(_SourceIcon.default, {
        source: source,
        modifier: icon => icon === "extension" ? "javascript" : icon
      });
    }

    return null;
  }

  renderItemName(depth) {
    const {
      item,
      threads,
      extensionName
    } = this.props;

    if (depth === 0) {
      const thread = threads.find(({
        actor
      }) => actor == item.name);

      if (thread) {
        return thread.name + (thread.serviceWorkerStatus ? ` (${thread.serviceWorkerStatus})` : "");
      }
    }

    if (isExtensionDirectory(depth, extensionName)) {
      return extensionName;
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

  renderItemTooltip() {
    const {
      item,
      depth,
      extensionName
    } = this.props;

    if (isExtensionDirectory(depth, extensionName)) {
      return item.name;
    }

    return item.type === "source" ? unescape(item.contents.url) : (0, _sourcesTree.getPathWithoutThread)(item.path);
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
    const suffix = hasMatchingGeneratedSource ? _react.default.createElement("span", {
      className: "suffix"
    }, L10N.getStr("sourceFooter.mappedSuffix")) : null;
    let querystring;

    if (hasSiblingOfSameName) {
      querystring = (0, _source.getSourceQueryString)(source);
    }

    const query = hasSiblingOfSameName && querystring ? _react.default.createElement("span", {
      className: "query"
    }, querystring) : null;
    return _react.default.createElement("div", {
      className: (0, _classnames.default)("node", {
        focused
      }),
      key: item.path,
      onClick: this.onClick,
      onContextMenu: e => this.onContextMenu(e, item),
      title: this.renderItemTooltip()
    }, this.renderItemArrow(), this.renderIcon(item, depth), _react.default.createElement("span", {
      className: "label"
    }, this.renderItemName(depth), query, " ", suffix));
  }

}

function getHasMatchingGeneratedSource(state, source) {
  if (!source || !(0, _source.isOriginal)(source)) {
    return false;
  }

  return !!(0, _selectors.getGeneratedSourceByURL)(state, source.url);
}

function getSourceContentValue(state, source) {
  const content = (0, _selectors.getSourceContent)(state, source.id);
  return content && (0, _asyncValue.isFulfilled)(content) ? content.value : null;
}

function isExtensionDirectory(depth, extensionName) {
  return extensionName && (depth === 1 || depth === 0);
}

const mapStateToProps = (state, props) => {
  const {
    source,
    item
  } = props;
  return {
    cx: (0, _selectors.getContext)(state),
    mainThread: (0, _selectors.getMainThread)(state),
    hasMatchingGeneratedSource: getHasMatchingGeneratedSource(state, source),
    hasSiblingOfSameName: (0, _selectors.getHasSiblingOfSameName)(state, source),
    hasPrettyTab: source ? (0, _selectors.hasPrettyTab)(state, source.url) : false,
    sourceContent: source ? getSourceContentValue(state, source) : null,
    extensionName: (0, _source.isUrlExtension)(item.name) && (0, _selectors.getExtensionNameBySourceUrl)(state, item.name) || null
  };
};

var _default = (0, _connect.connect)(mapStateToProps, {
  setProjectDirectoryRoot: _actions.default.setProjectDirectoryRoot,
  clearProjectDirectoryRoot: _actions.default.clearProjectDirectoryRoot,
  toggleBlackBox: _actions.default.toggleBlackBox,
  loadSourceText: _actions.default.loadSourceText,
  blackBoxSources: _actions.default.blackBoxSources,
  setBlackBoxAllOutside: _actions.default.setBlackBoxAllOutside
})(SourceTreeItem);

exports.default = _default;