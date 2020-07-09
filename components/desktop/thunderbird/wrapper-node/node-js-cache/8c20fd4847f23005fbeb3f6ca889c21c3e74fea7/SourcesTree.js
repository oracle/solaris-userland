"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _classnames = _interopRequireDefault(require("devtools/client/debugger/dist/vendors").vendored["classnames"]);

loader.lazyRequireGetter(this, "_connect", "devtools/client/debugger/src/utils/connect");

var _lodash = require("devtools/client/shared/vendor/lodash");

loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_sources", "devtools/client/debugger/src/reducers/sources");

var _actions = _interopRequireDefault(require("../../actions/index"));

var _SourcesTreeItem = _interopRequireDefault(require("./SourcesTreeItem"));

var _ManagedTree = _interopRequireDefault(require("../shared/ManagedTree"));

loader.lazyRequireGetter(this, "_sourcesTree", "devtools/client/debugger/src/utils/sources-tree/index");
loader.lazyRequireGetter(this, "_url", "devtools/client/debugger/src/utils/url");
loader.lazyRequireGetter(this, "_source", "devtools/client/debugger/src/utils/source");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function shouldAutoExpand(depth, item, debuggeeUrl, projectRoot) {
  if (projectRoot != "" || depth !== 1) {
    return false;
  }

  const {
    host
  } = (0, _url.parse)(debuggeeUrl);
  return item.name === host;
}

class SourcesTree extends _react.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "selectItem", item => {
      if (item.type == "source" && !Array.isArray(item.contents)) {
        this.props.selectSource(this.props.cx, item.contents.id);
      }
    });

    _defineProperty(this, "onFocus", item => {
      this.props.focusItem(item);
    });

    _defineProperty(this, "onActivate", item => {
      this.selectItem(item);
    });

    _defineProperty(this, "getPath", item => {
      const {
        path
      } = item;
      const source = (0, _sourcesTree.getSource)(item, this.props);

      if (!source || (0, _sourcesTree.isDirectory)(item)) {
        return path;
      }

      const blackBoxedPart = source.isBlackBoxed ? ":blackboxed" : "";
      return `${path}/${source.id}/${blackBoxedPart}`;
    });

    _defineProperty(this, "onExpand", (item, expandedState) => {
      this.props.setExpandedState(expandedState);
    });

    _defineProperty(this, "onCollapse", (item, expandedState) => {
      this.props.setExpandedState(expandedState);
    });

    _defineProperty(this, "getRoots", (sourceTree, projectRoot) => {
      const sourceContents = sourceTree.contents[0];

      if (projectRoot && sourceContents) {
        const roots = (0, _sourcesTree.findSourceTreeNodes)(sourceTree, projectRoot); // NOTE if there is one root, we want to show its content
        // TODO with multiple roots we should try and show the thread name

        return roots && roots.length == 1 ? roots[0].contents : roots;
      }

      return sourceTree.contents;
    });

    _defineProperty(this, "getSourcesGroups", item => {
      const sourcesAll = (0, _sourcesTree.getAllSources)(this.props);
      const sourcesInside = (0, _sourcesTree.getSourcesInsideGroup)(item, this.props);
      const sourcesOuside = (0, _lodash.difference)(sourcesAll, sourcesInside);
      return {
        sourcesInside,
        sourcesOuside
      };
    });

    _defineProperty(this, "renderItem", (item, depth, focused, _, expanded, {
      setExpanded
    }) => {
      const {
        debuggeeUrl,
        projectRoot,
        threads
      } = this.props;
      return _react.default.createElement(_SourcesTreeItem.default, {
        item: item,
        threads: threads,
        depth: depth,
        focused: focused,
        autoExpand: shouldAutoExpand(depth, item, debuggeeUrl, projectRoot),
        expanded: expanded,
        focusItem: this.onFocus,
        selectItem: this.selectItem,
        source: (0, _sourcesTree.getSource)(item, this.props),
        debuggeeUrl: debuggeeUrl,
        projectRoot: projectRoot,
        setExpanded: setExpanded,
        getSourcesGroups: this.getSourcesGroups
      });
    });

    const {
      debuggeeUrl: _debuggeeUrl,
      sources,
      threads: _threads
    } = this.props;
    this.state = (0, _sourcesTree.createTree)({
      debuggeeUrl: _debuggeeUrl,
      sources,
      threads: _threads
    });
  }

  componentWillReceiveProps(nextProps) {
    const {
      projectRoot,
      debuggeeUrl,
      sources,
      shownSource,
      selectedSource,
      threads
    } = this.props;
    const {
      uncollapsedTree,
      sourceTree
    } = this.state;

    if (projectRoot != nextProps.projectRoot || debuggeeUrl != nextProps.debuggeeUrl || threads != nextProps.threads || nextProps.sourceCount === 0) {
      // early recreate tree because of changes
      // to project root, debuggee url or lack of sources
      return this.setState((0, _sourcesTree.createTree)({
        sources: nextProps.sources,
        debuggeeUrl: nextProps.debuggeeUrl,
        threads: nextProps.threads
      }));
    }

    if (nextProps.shownSource && nextProps.shownSource != shownSource) {
      const listItems = (0, _sourcesTree.getDirectories)(nextProps.shownSource, sourceTree);
      return this.setState({
        listItems
      });
    }

    if (nextProps.selectedSource && nextProps.selectedSource != selectedSource) {
      const highlightItems = (0, _sourcesTree.getDirectories)(nextProps.selectedSource, sourceTree);
      this.setState({
        highlightItems
      });
    } // NOTE: do not run this every time a source is clicked,
    // only when a new source is added


    if (nextProps.sources != this.props.sources) {
      const update = (0, _sourcesTree.updateTree)({
        newSources: nextProps.sources,
        threads: nextProps.threads,
        prevSources: sources,
        debuggeeUrl,
        uncollapsedTree,
        sourceTree
      });

      if (update) {
        this.setState(update);
      }
    }
  }

  isEmpty() {
    const {
      sourceTree
    } = this.state;
    return sourceTree.contents.length === 0;
  }

  renderEmptyElement(message) {
    return _react.default.createElement("div", {
      key: "empty",
      className: "no-sources-message"
    }, message);
  }

  renderTree() {
    const {
      expanded,
      focused,
      projectRoot
    } = this.props;
    const {
      highlightItems,
      listItems,
      parentMap,
      sourceTree
    } = this.state;
    const treeProps = {
      autoExpandAll: false,
      autoExpandDepth: 1,
      expanded,
      focused,
      getChildren: _sourcesTree.getChildren,
      getParent: item => parentMap.get(item),
      getPath: this.getPath,
      getRoots: () => this.getRoots(sourceTree, projectRoot),
      highlightItems,
      itemHeight: 21,
      key: this.isEmpty() ? "empty" : "full",
      listItems,
      onCollapse: this.onCollapse,
      onExpand: this.onExpand,
      onFocus: this.onFocus,
      onActivate: this.onActivate,
      renderItem: this.renderItem,
      preventBlur: true
    };
    return _react.default.createElement(_ManagedTree.default, treeProps);
  }

  renderPane(child) {
    const {
      projectRoot
    } = this.props;
    return _react.default.createElement("div", {
      key: "pane",
      className: (0, _classnames.default)("sources-pane", {
        "sources-list-custom-root": projectRoot
      })
    }, child);
  }

  render() {
    return this.renderPane(this.isEmpty() ? this.renderEmptyElement(L10N.getStr("noSourcesText")) : _react.default.createElement("div", {
      key: "tree",
      className: "sources-list"
    }, this.renderTree()));
  }

}

function getSourceForTree(state, displayedSources, source) {
  if (!source) {
    return null;
  }

  if (!source || !source.isPrettyPrinted) {
    return source;
  }

  return (0, _sources.getGeneratedSourceByURL)(state, (0, _source.getRawSourceURL)(source.url));
}

const mapStateToProps = (state, props) => {
  const selectedSource = (0, _selectors.getSelectedSource)(state);
  const shownSource = (0, _selectors.getShownSource)(state);
  const displayedSources = (0, _selectors.getDisplayedSources)(state);
  return {
    threads: props.threads,
    cx: (0, _selectors.getContext)(state),
    shownSource: getSourceForTree(state, displayedSources, shownSource),
    selectedSource: getSourceForTree(state, displayedSources, selectedSource),
    debuggeeUrl: (0, _selectors.getDebuggeeUrl)(state),
    expanded: (0, _selectors.getExpandedState)(state),
    focused: (0, _selectors.getFocusedSourceItem)(state),
    projectRoot: (0, _selectors.getProjectDirectoryRoot)(state),
    sources: displayedSources,
    sourceCount: Object.values(displayedSources).length
  };
};

var _default = (0, _connect.connect)(mapStateToProps, {
  selectSource: _actions.default.selectSource,
  setExpandedState: _actions.default.setExpandedState,
  focusItem: _actions.default.focusItem
})(SourcesTree);

exports.default = _default;