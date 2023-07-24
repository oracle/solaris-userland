"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _propTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

loader.lazyRequireGetter(this, "_connect", "devtools/client/debugger/src/utils/connect");
loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");

var _actions = _interopRequireDefault(require("../../actions/index"));

var _SourcesTreeItem = _interopRequireDefault(require("./SourcesTreeItem"));

var _AccessibleImage = _interopRequireDefault(require("../shared/AccessibleImage"));

loader.lazyRequireGetter(this, "_source", "devtools/client/debugger/src/utils/source");
loader.lazyRequireGetter(this, "_location", "devtools/client/debugger/src/utils/location");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const classnames = require("devtools/client/shared/classnames.js");

const Tree = require("devtools/client/shared/components/Tree");

function shouldAutoExpand(item, mainThreadHost) {
  // There is only one case where we want to force auto expand,
  // when we are on the group of the page's domain.
  return item.type == "group" && item.groupName === mainThreadHost;
}
/**
 * Get the SourceItem displayed in the SourceTree for a given "tree location".
 *
 * @param {Object} treeLocation
 *        An object containing  the Source coming from the sources.js reducer and the source actor
 *        See getTreeLocation().
 * @param {object} rootItems
 *        Result of getSourcesTreeSources selector, containing all sources sorted in a tree structure.
 *        items to be displayed in the source tree.
 * @return {SourceItem}
 *        The directory source item where the given source is displayed.
 */


function getSourceItemForTreeLocation(treeLocation, rootItems) {
  // Sources without URLs are not visible in the SourceTree
  const {
    source,
    sourceActor
  } = treeLocation;

  if (!source.url) {
    return null;
  }

  const {
    displayURL
  } = source;

  function findSourceInItem(item, path) {
    if (item.type == "source") {
      if (item.source.url == source.url) {
        return item;
      }

      return null;
    } // Bail out if we the current item doesn't match the source


    if (item.type == "thread" && item.threadActorID != (sourceActor === null || sourceActor === void 0 ? void 0 : sourceActor.thread)) {
      return null;
    }

    if (item.type == "group" && displayURL.group != item.groupName) {
      return null;
    }

    if (item.type == "directory" && !path.startsWith(item.path)) {
      return null;
    } // Otherwise, walk down the tree if this ancestor item seems to match


    for (const child of item.children) {
      const match = findSourceInItem(child, path);

      if (match) {
        return match;
      }
    }

    return null;
  }

  for (const rootItem of rootItems) {
    // Note that when we are setting a project root, rootItem
    // may no longer be only Thread Item, but also be Group, Directory or Source Items.
    const item = findSourceInItem(rootItem, displayURL.path);

    if (item) {
      return item;
    }
  }

  return null;
}

class SourcesTree extends _react.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "selectSourceItem", item => {
      this.props.selectSource(this.props.cx, item.source, item.sourceActor);
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
      const {
        expanded
      } = this.props;
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

    _defineProperty(this, "getBlackBoxSourcesGroups", item => {
      const allSources = [];

      function collectAllSources(list, _item) {
        if (_item.children) {
          _item.children.forEach(i => collectAllSources(list, i));
        }

        if (_item.type == "source") {
          list.push(_item.source);
        }
      }

      for (const rootItem of this.props.rootItems) {
        collectAllSources(allSources, rootItem);
      }

      const sourcesInside = [];
      collectAllSources(sourcesInside, item);
      const sourcesOutside = allSources.filter(source => !sourcesInside.includes(source));
      const allInsideBlackBoxed = sourcesInside.every(source => this.props.blackBoxRanges[source.url]);
      const allOutsideBlackBoxed = sourcesOutside.every(source => this.props.blackBoxRanges[source.url]);
      return {
        sourcesInside,
        sourcesOutside,
        allInsideBlackBoxed,
        allOutsideBlackBoxed
      };
    });

    _defineProperty(this, "renderItem", (item, depth, focused, _, expanded) => {
      const {
        mainThreadHost,
        projectRoot
      } = this.props;
      return _react.default.createElement(_SourcesTreeItem.default, {
        item: item,
        depth: depth,
        focused: focused,
        autoExpand: shouldAutoExpand(item, mainThreadHost),
        expanded: expanded,
        focusItem: this.onFocus,
        selectSourceItem: this.selectSourceItem,
        projectRoot: projectRoot,
        setExpanded: this.setExpanded,
        getBlackBoxSourcesGroups: this.getBlackBoxSourcesGroups,
        getParent: this.getParent
      });
    });

    this.state = {};
  }

  static get propTypes() {
    return {
      cx: _propTypes.default.object.isRequired,
      mainThreadHost: _propTypes.default.string.isRequired,
      expanded: _propTypes.default.object.isRequired,
      focusItem: _propTypes.default.func.isRequired,
      focused: _propTypes.default.object,
      projectRoot: _propTypes.default.string.isRequired,
      selectSource: _propTypes.default.func.isRequired,
      selectedTreeLocation: _propTypes.default.object,
      setExpandedState: _propTypes.default.func.isRequired,
      blackBoxRanges: _propTypes.default.object.isRequired,
      rootItems: _propTypes.default.object.isRequired,
      clearProjectDirectoryRoot: _propTypes.default.func.isRequired,
      projectRootName: _propTypes.default.string.isRequired,
      setHideOrShowIgnoredSources: _propTypes.default.func.isRequired,
      hideIgnoredSources: _propTypes.default.bool.isRequired
    };
  } // FIXME: https://bugzilla.mozilla.org/show_bug.cgi?id=1774507


  UNSAFE_componentWillReceiveProps(nextProps) {
    var _nextProps$selectedTr;

    const {
      selectedTreeLocation
    } = this.props; // We might fail to find the source if its thread is registered late,
    // so that we should re-search the selected source if state.focused is null.

    if (((_nextProps$selectedTr = nextProps.selectedTreeLocation) === null || _nextProps$selectedTr === void 0 ? void 0 : _nextProps$selectedTr.source) && (nextProps.selectedTreeLocation.source != (selectedTreeLocation === null || selectedTreeLocation === void 0 ? void 0 : selectedTreeLocation.source) || nextProps.selectedTreeLocation.source === (selectedTreeLocation === null || selectedTreeLocation === void 0 ? void 0 : selectedTreeLocation.source) && nextProps.selectedTreeLocation.sourceActor != (selectedTreeLocation === null || selectedTreeLocation === void 0 ? void 0 : selectedTreeLocation.sourceActor) || !this.props.focused)) {
      const sourceItem = getSourceItemForTreeLocation(nextProps.selectedTreeLocation, this.props.rootItems);

      if (sourceItem) {
        // Walk up the tree to expand all ancestor items up to the root of the tree.
        const expanded = new Set(this.props.expanded);
        let parentDirectory = sourceItem;

        while (parentDirectory) {
          expanded.add(this.getKey(parentDirectory));
          parentDirectory = this.getParent(parentDirectory);
        }

        this.props.setExpandedState(expanded);
        this.onFocus(sourceItem);
      }
    }
  }

  isEmpty() {
    return !this.getRoots().length;
  }

  renderEmptyElement(message) {
    return _react.default.createElement("div", {
      key: "empty",
      className: "no-sources-message"
    }, message);
  }

  renderProjectRootHeader() {
    const {
      cx,
      projectRootName
    } = this.props;

    if (!projectRootName) {
      return null;
    }

    return _react.default.createElement("div", {
      key: "root",
      className: "sources-clear-root-container"
    }, _react.default.createElement("button", {
      className: "sources-clear-root",
      onClick: () => this.props.clearProjectDirectoryRoot(cx),
      title: L10N.getStr("removeDirectoryRoot.label")
    }, _react.default.createElement(_AccessibleImage.default, {
      className: "home"
    }), _react.default.createElement(_AccessibleImage.default, {
      className: "breadcrumb"
    }), _react.default.createElement("span", {
      className: "sources-clear-root-label"
    }, projectRootName)));
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
      itemHeight: 21,
      key: this.isEmpty() ? "empty" : "full",
      onCollapse: this.onCollapse,
      onExpand: this.onExpand,
      onFocus: this.onFocus,
      isExpanded: item => {
        return this.props.expanded.has(this.getKey(item));
      },
      onActivate: this.onActivate,
      renderItem: this.renderItem,
      preventBlur: true
    };
    return _react.default.createElement(Tree, treeProps);
  }

  renderPane(child) {
    const {
      projectRoot
    } = this.props;
    return _react.default.createElement("div", {
      key: "pane",
      className: classnames("sources-pane", {
        "sources-list-custom-root": !!projectRoot
      })
    }, child);
  }

  renderFooter() {
    if (this.props.hideIgnoredSources) {
      return _react.default.createElement("footer", {
        className: "source-list-footer"
      }, L10N.getStr("ignoredSourcesHidden"), _react.default.createElement("button", {
        className: "devtools-togglebutton",
        onClick: () => this.props.setHideOrShowIgnoredSources(false),
        title: L10N.getStr("showIgnoredSources.tooltip.label")
      }, L10N.getStr("showIgnoredSources")));
    }

    return null;
  }

  render() {
    const {
      projectRoot
    } = this.props;
    return _react.default.createElement("div", {
      key: "pane",
      className: classnames("sources-list", {
        "sources-list-custom-root": !!projectRoot
      })
    }, this.isEmpty() ? this.renderEmptyElement(L10N.getStr("noSourcesText")) : _react.default.createElement(_react.default.Fragment, null, this.renderProjectRootHeader(), this.renderTree(), this.renderFooter()));
  }

}

function getTreeLocation(state, location) {
  // In the SourceTree, we never show the pretty printed sources and only
  // the minified version, so if we are selecting a pretty file, fake selecting
  // the minified version.
  if (location === null || location === void 0 ? void 0 : location.source.isPrettyPrinted) {
    const source = (0, _selectors.getGeneratedSourceByURL)(state, (0, _source.getRawSourceURL)(location.source.url));

    if (source) {
      return (0, _location.createLocation)({
        source,
        // A source actor is required by getSourceItemForTreeLocation
        // in order to know in which thread this source relates to.
        sourceActor: location.sourceActor
      });
    }
  }

  return location;
}

const mapStateToProps = state => {
  const rootItems = (0, _selectors.getSourcesTreeSources)(state);
  return {
    cx: (0, _selectors.getContext)(state),
    selectedTreeLocation: getTreeLocation(state, (0, _selectors.getSelectedLocation)(state)),
    mainThreadHost: (0, _selectors.getMainThreadHost)(state),
    expanded: (0, _selectors.getExpandedState)(state),
    focused: (0, _selectors.getFocusedSourceItem)(state),
    projectRoot: (0, _selectors.getProjectDirectoryRoot)(state),
    rootItems,
    blackBoxRanges: (0, _selectors.getBlackBoxRanges)(state),
    projectRootName: (0, _selectors.getProjectDirectoryRootName)(state),
    hideIgnoredSources: (0, _selectors.getHideIgnoredSources)(state)
  };
};

var _default = (0, _connect.connect)(mapStateToProps, {
  selectSource: _actions.default.selectSource,
  setExpandedState: _actions.default.setExpandedState,
  focusItem: _actions.default.focusItem,
  clearProjectDirectoryRoot: _actions.default.clearProjectDirectoryRoot,
  setHideOrShowIgnoredSources: _actions.default.setHideOrShowIgnoredSources
})(SourcesTree);

exports.default = _default;