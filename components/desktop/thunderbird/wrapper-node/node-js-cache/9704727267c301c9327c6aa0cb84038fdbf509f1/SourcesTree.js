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
loader.lazyRequireGetter(this, "_location", "devtools/client/debugger/src/utils/location");
loader.lazyRequireGetter(this, "_index", "devtools/client/debugger/src/selectors/index");

var _index2 = _interopRequireDefault(require("../../actions/index"));

var _SourcesTreeItem = _interopRequireDefault(require("./SourcesTreeItem"));

var _AccessibleImage = _interopRequireDefault(require("../shared/AccessibleImage"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const MenuButton = require("resource://devtools/client/shared/components/menu/MenuButton.js");

const MenuItem = require("resource://devtools/client/shared/components/menu/MenuItem.js");

const MenuList = require("resource://devtools/client/shared/components/menu/MenuList.js");

const classnames = require("resource://devtools/client/shared/classnames.js");

const Tree = require("resource://devtools/client/shared/components/Tree.js");

function shouldAutoExpand(item, mainThreadHost) {
  // There is only one case where we want to force auto expand,
  // when we are on the group of the page's domain.
  return item.type == "group" && item.groupName === mainThreadHost;
}

class SourcesTree extends _react.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "selectSourceItem", item => {
      // Use a dedicated selection method to handle edgecases around pretty printed sources
      // When a source is pretty printed, the `item.source` still refers to the minified source,
      // whereas we expect to open the pretty printed version (if it exists).
      this.props.selectMayBePrettyPrintedLocation((0, _location.createLocation)({
        source: item.source,
        sourceActor: item.sourceActor
      }));
    });

    _defineProperty(this, "onFocus", item => {
      this.props.focusItem(item);
    });

    _defineProperty(this, "onActivate", item => {
      if (item.type == "source") {
        this.selectSourceItem(item);
      }
    });

    _defineProperty(this, "onExpand", (item, shouldIncludeChildren) => {
      this.setExpanded(item, true, shouldIncludeChildren);
    });

    _defineProperty(this, "onCollapse", (item, shouldIncludeChildren) => {
      this.setExpanded(item, false, shouldIncludeChildren);
    });

    _defineProperty(this, "setExpanded", (item, isExpanded, shouldIncludeChildren) => {
      // Note that setExpandedState relies on us to clone this Set
      // which is going to be store as-is in the reducer.
      const expanded = new Set(this.props.expanded);
      let changed = false;

      const expandItem = i => {
        const key = this.getKey(i);

        if (isExpanded) {
          changed |= !expanded.has(key);
          expanded.add(key);
        } else {
          changed |= expanded.has(key);
          expanded.delete(key);
        }
      };

      expandItem(item);

      if (shouldIncludeChildren) {
        let parents = [item];

        while (parents.length) {
          const children = [];

          for (const parent of parents) {
            for (const child of this.getChildren(parent)) {
              expandItem(child);
              children.push(child);
            }
          }

          parents = children;
        }
      }

      if (changed) {
        this.props.setExpandedState(expanded);
      }
    });

    _defineProperty(this, "getRoots", () => {
      return this.props.rootItems;
    });

    _defineProperty(this, "getKey", item => {
      // As this is used as React key in Tree component,
      // we need to update the key when switching to a new project root
      // otherwise these items won't be updated and will have a buggy padding start.
      const {
        projectRoot
      } = this.props;

      if (projectRoot) {
        return projectRoot + item.uniquePath;
      }

      return item.uniquePath;
    });

    _defineProperty(this, "getChildren", item => {
      // This is the precial magic that coalesce "empty" folders,
      // i.e folders which have only one sub-folder as children.
      function skipEmptyDirectories(directory) {
        if (directory.type != "directory") {
          return directory;
        }

        if (directory.children.length == 1 && directory.children[0].type == "directory") {
          return skipEmptyDirectories(directory.children[0]);
        }

        return directory;
      }

      if (item.type == "thread") {
        return item.children;
      } else if (item.type == "group" || item.type == "directory") {
        return item.children.map(skipEmptyDirectories);
      }

      return [];
    });

    _defineProperty(this, "getParent", item => {
      if (item.type == "thread") {
        return null;
      }

      const {
        rootItems
      } = this.props; // This is the second magic which skip empty folders
      // (See getChildren comment)

      function skipEmptyDirectories(directory) {
        if (directory.type == "group" || directory.type == "thread" || rootItems.includes(directory)) {
          return directory;
        }

        if (directory.children.length == 1 && directory.children[0].type == "directory") {
          return skipEmptyDirectories(directory.parent);
        }

        return directory;
      }

      return skipEmptyDirectories(item.parent);
    });

    _defineProperty(this, "renderItem", (item, depth, focused, arrow, expanded) => {
      const {
        mainThreadHost
      } = this.props;
      return _react.default.createElement(_SourcesTreeItem.default, {
        arrow,
        item,
        depth,
        focused,
        autoExpand: shouldAutoExpand(item, mainThreadHost),
        expanded,
        focusItem: this.onFocus,
        selectSourceItem: this.selectSourceItem,
        setExpanded: this.setExpanded,
        getParent: this.getParent
      });
    });

    this.state = {
      hasOverflow: undefined
    }; // Monitor resize to check if the source tree shows a scrollbar.

    this.onResize = this.onResize.bind(this);
    this.resizeObserver = new ResizeObserver(this.onResize);
  }

  static get propTypes() {
    return {
      mainThreadHost: _reactPropTypes.default.string,
      expanded: _reactPropTypes.default.object.isRequired,
      focusItem: _reactPropTypes.default.func.isRequired,
      focused: _reactPropTypes.default.object,
      projectRoot: _reactPropTypes.default.string.isRequired,
      selectMayBePrettyPrintedLocation: _reactPropTypes.default.func.isRequired,
      setExpandedState: _reactPropTypes.default.func.isRequired,
      rootItems: _reactPropTypes.default.array.isRequired,
      clearProjectDirectoryRoot: _reactPropTypes.default.func.isRequired,
      projectRootName: _reactPropTypes.default.string.isRequired,
      setHideOrShowIgnoredSources: _reactPropTypes.default.func.isRequired,
      hideIgnoredSources: _reactPropTypes.default.bool.isRequired
    };
  }

  onResize() {
    const tree = this.refs.tree;

    if (!tree) {
      return;
    } // "treeRef" is created via createRef() in the Tree component.


    const treeEl = tree.treeRef.current;
    const hasOverflow = treeEl.scrollHeight > treeEl.clientHeight;

    if (hasOverflow !== this.state.hasOverflow) {
      this.setState({
        hasOverflow
      });
    }
  }

  componentDidUpdate() {
    this.onResize();
  }

  componentDidMount() {
    this.resizeObserver.observe(this.refs.pane);
    this.onResize();
  }

  componentWillUnmount() {
    this.resizeObserver.disconnect();
  }

  isEmpty() {
    return !this.getRoots().length;
  }

  renderEmptyElement(message) {
    return (0, _reactDomFactories.div)({
      key: "empty",
      className: "no-sources-message"
    }, message);
  }

  renderProjectRootHeader() {
    const {
      projectRootName,
      projectRootFullName
    } = this.props;

    if (!projectRootName) {
      return null;
    }

    return (0, _reactDomFactories.div)({
      key: "root",
      className: "sources-clear-root-container"
    }, (0, _reactDomFactories.button)({
      className: "sources-clear-root",
      onClick: () => this.props.clearProjectDirectoryRoot(),
      title: L10N.getFormatStr("removeDirectoryRoot.label")
    }, _react.default.createElement(_AccessibleImage.default, {
      className: "back"
    })), (0, _reactDomFactories.div)({
      className: "devtools-separator"
    }), (0, _reactDomFactories.span)({
      className: "sources-clear-root-label",
      title: L10N.getFormatStr("directoryRoot.tooltip.label", projectRootFullName || projectRootName)
    }, projectRootName));
  }

  renderTree() {
    const {
      expanded,
      focused
    } = this.props;
    const treeProps = {
      autoExpandAll: false,
      autoExpandDepth: 1,
      expanded,
      focused,
      getChildren: this.getChildren,
      getParent: this.getParent,
      getKey: this.getKey,
      getRoots: this.getRoots,
      onCollapse: this.onCollapse,
      onExpand: this.onExpand,
      onFocus: this.onFocus,
      isExpanded: item => {
        return this.props.expanded.has(this.getKey(item));
      },
      onActivate: this.onActivate,
      ref: "tree",
      renderItem: this.renderItem,
      preventBlur: true
    };
    return _react.default.createElement(Tree, treeProps);
  }

  renderPane(child) {
    const {
      projectRoot
    } = this.props;
    return (0, _reactDomFactories.div)({
      key: "pane",
      className: classnames("sources-pane", {
        "sources-list-custom-root": !!projectRoot
      })
    }, child);
  }

  renderFooter() {
    if (this.props.hideIgnoredSources) {
      return (0, _reactDomFactories.footer)({
        className: "source-list-footer"
      }, L10N.getStr("ignoredSourcesHidden"), (0, _reactDomFactories.button)({
        className: "devtools-togglebutton",
        onClick: () => this.props.setHideOrShowIgnoredSources(false),
        title: L10N.getStr("showIgnoredSources.tooltip.label")
      }, L10N.getStr("showIgnoredSources")));
    }

    return null;
  }

  renderSettingsButton() {
    const {
      toolboxDoc
    } = this.context;
    return _react.default.createElement(MenuButton, {
      menuId: "sources-tree-settings-menu-button",
      toolboxDoc,
      className: "devtools-button command-bar-button debugger-settings-menu-button",
      title: L10N.getStr("sources-settings.button.label"),
      "aria-label": L10N.getStr("sources-settings.button.label")
    }, () => this.renderSettingsMenuItems());
  }

  renderSettingsMenuItems() {
    return _react.default.createElement(MenuList, {
      id: "sources-tree-settings-menu-list"
    }, _react.default.createElement(MenuItem, {
      key: "debugger-settings-menu-item-hide-ignored-sources",
      className: "menu-item debugger-settings-menu-item-hide-ignored-sources",
      checked: _prefs.prefs.hideIgnoredSources,
      label: L10N.getStr("settings.hideIgnoredSources.label"),
      tooltip: L10N.getStr("settings.hideIgnoredSources.tooltip"),
      onClick: () => this.props.setHideOrShowIgnoredSources(!_prefs.prefs.hideIgnoredSources)
    }), _react.default.createElement(MenuItem, {
      key: "debugger-settings-menu-item-show-content-scripts",
      className: "menu-item debugger-settings-menu-item-show-content-scripts",
      checked: _prefs.prefs.showContentScripts,
      label: L10N.getStr("sources-settings.showContentScripts.label"),
      tooltip: L10N.getStr("sources-settings.showContentScripts.tooltip"),
      onClick: () => this.props.setShowContentScripts(!_prefs.prefs.showContentScripts)
    }));
  }

  render() {
    const {
      projectRoot
    } = this.props;
    return (0, _reactDomFactories.div)({
      key: "pane",
      ref: "pane",
      className: classnames("sources-list", {
        "sources-list-custom-root": !!projectRoot,
        "sources-list-has-overflow": this.state.hasOverflow
      })
    }, this.renderSettingsButton(), this.renderProjectRootHeader(), this.isEmpty() ? this.renderEmptyElement(L10N.getStr(projectRoot ? "noSourcesInDirectoryRootText" : "noSourcesText")) : _react.default.createElement(_react.Fragment, null, this.renderTree(), this.renderFooter()));
  }

}

SourcesTree.contextTypes = {
  toolboxDoc: _reactPropTypes.default.object
};

const mapStateToProps = state => {
  return {
    mainThreadHost: (0, _index.getMainThreadHost)(state),
    expanded: (0, _index.getExpandedState)(state),
    focused: (0, _index.getFocusedSourceItem)(state),
    projectRoot: (0, _index.getProjectDirectoryRoot)(state),
    rootItems: (0, _index.getSourcesTreeSources)(state),
    projectRootName: (0, _index.getProjectDirectoryRootName)(state),
    projectRootFullName: (0, _index.getProjectDirectoryRootFullName)(state),
    hideIgnoredSources: (0, _index.getHideIgnoredSources)(state)
  };
};

var _default = (0, _reactRedux.connect)(mapStateToProps, {
  selectMayBePrettyPrintedLocation: _index2.default.selectMayBePrettyPrintedLocation,
  setExpandedState: _index2.default.setExpandedState,
  focusItem: _index2.default.focusItem,
  clearProjectDirectoryRoot: _index2.default.clearProjectDirectoryRoot,
  setHideOrShowIgnoredSources: _index2.default.setHideOrShowIgnoredSources,
  setShowContentScripts: _index2.default.setShowContentScripts
})(SourcesTree);

exports.default = _default;