"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("devtools/client/shared/vendor/react");

var _react2 = _interopRequireDefault(_react);

var _classnames = require("devtools/client/debugger/dist/vendors").vendored["classnames"];

var _classnames2 = _interopRequireDefault(_classnames);

var _connect = require("../../utils/connect");

var _selectors = require("../../selectors/index");

var _sources = require("../../reducers/sources");

var _actions = require("../../actions/index");

var _actions2 = _interopRequireDefault(_actions);

var _SourcesTreeItem = require("./SourcesTreeItem");

var _SourcesTreeItem2 = _interopRequireDefault(_SourcesTreeItem);

var _ManagedTree = require("../shared/ManagedTree");

var _ManagedTree2 = _interopRequireDefault(_ManagedTree);

var _sourcesTree = require("../../utils/sources-tree/index");

var _url = require("../../utils/url");

var _source = require("../../utils/source");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Actions


// Selectors
function shouldAutoExpand(depth, item, debuggeeUrl) {
  if (depth !== 1) {
    return false;
  }

  const { host } = (0, _url.parse)(debuggeeUrl);
  return item.name === host;
}

// Utils


// Components
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

// Dependencies


class SourcesTree extends _react.Component {
  constructor(props) {
    super(props);

    _initialiseProps.call(this);

    const { debuggeeUrl, sources, threads } = this.props;

    this.state = (0, _sourcesTree.createTree)({
      debuggeeUrl,
      sources,
      threads
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
    const { uncollapsedTree, sourceTree } = this.state;

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
      return this.setState({ listItems });
    }

    if (nextProps.selectedSource && nextProps.selectedSource != selectedSource) {
      const highlightItems = (0, _sourcesTree.getDirectories)(nextProps.selectedSource, sourceTree);
      this.setState({ highlightItems });
    }

    // NOTE: do not run this every time a source is clicked,
    // only when a new source is added
    if (nextProps.sources != this.props.sources) {
      this.setState((0, _sourcesTree.updateTree)({
        newSources: nextProps.sources,
        threads: nextProps.threads,
        prevSources: sources,
        debuggeeUrl,
        uncollapsedTree,
        sourceTree
      }));
    }
  }

  // NOTE: we get the source from sources because item.contents is cached
  getSource(item) {
    return (0, _sourcesTree.getSourceFromNode)(item);
  }

  isEmpty() {
    const { sourceTree } = this.state;
    return sourceTree.contents.length === 0;
  }

  renderEmptyElement(message) {
    return _react2.default.createElement(
      "div",
      { key: "empty", className: "no-sources-message" },
      message
    );
  }

  renderTree() {
    const { expanded, focused } = this.props;

    const { highlightItems, listItems, parentMap } = this.state;

    const treeProps = {
      autoExpandAll: false,
      autoExpandDepth: 1,
      expanded,
      focused,
      getChildren: this.getChildren,
      getParent: item => parentMap.get(item),
      getPath: this.getPath,
      getRoots: this.getRoots,
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

    return _react2.default.createElement(_ManagedTree2.default, treeProps);
  }

  renderPane(...children) {
    const { projectRoot } = this.props;

    return _react2.default.createElement(
      "div",
      {
        key: "pane",
        className: (0, _classnames2.default)("sources-pane", {
          "sources-list-custom-root": projectRoot
        })
      },
      children
    );
  }

  render() {
    return this.renderPane(this.isEmpty() ? this.renderEmptyElement(L10N.getStr("noSourcesText")) : _react2.default.createElement(
      "div",
      { key: "tree", className: "sources-list" },
      this.renderTree()
    ));
  }
}

var _initialiseProps = function () {
  this.selectItem = item => {
    if (item.type == "source" && !Array.isArray(item.contents)) {
      this.props.selectSource(this.props.cx, item.contents.id);
    }
  };

  this.onFocus = item => {
    this.props.focusItem(item);
  };

  this.onActivate = item => {
    this.selectItem(item);
  };

  this.getPath = item => {
    const { path } = item;
    const source = this.getSource(item);

    if (!source || (0, _sourcesTree.isDirectory)(item)) {
      return path;
    }

    const blackBoxedPart = source.isBlackBoxed ? ":blackboxed" : "";

    return `${path}/${source.id}/${blackBoxedPart}`;
  };

  this.onExpand = (item, expandedState) => {
    this.props.setExpandedState(expandedState);
  };

  this.onCollapse = (item, expandedState) => {
    this.props.setExpandedState(expandedState);
  };

  this.getRoots = () => {
    const { projectRoot } = this.props;
    const { sourceTree } = this.state;

    const sourceContents = sourceTree.contents[0];
    const rootLabel = projectRoot.split("/").pop();

    // The "sourceTree.contents[0]" check ensures that there are contents
    // A custom root with no existing sources will be ignored
    if (projectRoot && sourceContents) {
      if (sourceContents && sourceContents.name !== rootLabel) {
        return sourceContents.contents[0].contents;
      }
      return sourceContents.contents;
    }

    return sourceTree.contents;
  };

  this.getChildren = item => {
    return (0, _sourcesTree.nodeHasChildren)(item) ? item.contents : [];
  };

  this.renderItem = (item, depth, focused, _, expanded, { setExpanded }) => {
    const { debuggeeUrl, projectRoot, threads } = this.props;

    return _react2.default.createElement(_SourcesTreeItem2.default, {
      item: item,
      threads: threads,
      depth: depth,
      focused: focused,
      autoExpand: shouldAutoExpand(depth, item, debuggeeUrl),
      expanded: expanded,
      focusItem: this.onFocus,
      selectItem: this.selectItem,
      source: this.getSource(item),
      debuggeeUrl: debuggeeUrl,
      projectRoot: projectRoot,
      setExpanded: setExpanded
    });
  };
};

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

exports.default = (0, _connect.connect)(mapStateToProps, {
  selectSource: _actions2.default.selectSource,
  setExpandedState: _actions2.default.setExpandedState,
  focusItem: _actions2.default.focusItem
})(SourcesTree);