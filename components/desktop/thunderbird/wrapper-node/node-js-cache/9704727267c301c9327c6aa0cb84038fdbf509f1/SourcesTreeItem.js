"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _reactDomFactories = require("devtools/client/shared/vendor/react-dom-factories");

var _reactPropTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

var _reactRedux = require("devtools/client/shared/vendor/react-redux");

var _SourceIcon = _interopRequireDefault(require("../shared/SourceIcon"));

var _AccessibleImage = _interopRequireDefault(require("../shared/AccessibleImage"));

loader.lazyRequireGetter(this, "_index", "devtools/client/debugger/src/selectors/index");

var _index2 = _interopRequireDefault(require("../../actions/index"));

loader.lazyRequireGetter(this, "_source", "devtools/client/debugger/src/utils/source");
loader.lazyRequireGetter(this, "_location", "devtools/client/debugger/src/utils/location");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const classnames = require("resource://devtools/client/shared/classnames.js");

class SourceTreeItemContents extends _react.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "onClick", () => {
      const {
        item,
        focusItem,
        selectSourceItem
      } = this.props;
      focusItem(item);

      if (item.type == "source") {
        selectSourceItem(item);
      }
    });

    _defineProperty(this, "onContextMenu", event => {
      event.stopPropagation();
      event.preventDefault();
      this.props.showSourceTreeItemContextMenu(event, this.props.item, this.props.depth, this.props.setExpanded, this.renderItemName(), this.props.isSourceOverridden);
    });
  }

  static get propTypes() {
    return {
      autoExpand: _reactPropTypes.default.bool.isRequired,
      depth: _reactPropTypes.default.number.isRequired,
      expanded: _reactPropTypes.default.bool.isRequired,
      focusItem: _reactPropTypes.default.func.isRequired,
      focused: _reactPropTypes.default.bool.isRequired,
      hasMatchingGeneratedSource: _reactPropTypes.default.bool,
      item: _reactPropTypes.default.object.isRequired,
      selectSourceItem: _reactPropTypes.default.func.isRequired,
      setExpanded: _reactPropTypes.default.func.isRequired,
      getParent: _reactPropTypes.default.func.isRequired,
      hideIgnoredSources: _reactPropTypes.default.bool,
      arrow: _reactPropTypes.default.object
    };
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

  renderIcon(item) {
    if (item.type == "thread") {
      const icon = item.thread.targetType.includes("worker") ? "worker" : "window";
      return _react.default.createElement(_AccessibleImage.default, {
        className: classnames(icon)
      });
    }

    if (item.type == "group") {
      if (item.groupName === "Webpack") {
        return _react.default.createElement(_AccessibleImage.default, {
          className: "webpack"
        });
      } else if (item.groupName === "Angular") {
        return _react.default.createElement(_AccessibleImage.default, {
          className: "angular"
        });
      } // Check if the group relates to an extension.
      // This happens when a webextension injects a content script.


      if (item.isForExtensionSource) {
        return _react.default.createElement(_AccessibleImage.default, {
          className: "extension"
        });
      }

      return _react.default.createElement(_AccessibleImage.default, {
        className: "globe-small"
      });
    }

    if (item.type == "directory") {
      return _react.default.createElement(_AccessibleImage.default, {
        className: "folder"
      });
    }

    if (item.type == "source") {
      const {
        source,
        sourceActor
      } = item;
      return _react.default.createElement(_SourceIcon.default, {
        location: (0, _location.createLocation)({
          source,
          sourceActor
        }),
        modifier: icon => {
          // In the SourceTree, extension files should use the file-extension based icon,
          // whereas we use the extension icon in other Components (eg. source tabs and breakpoints pane).
          if (icon === "extension") {
            return _source.sourceTypes[source.displayURL.fileExtension] || "javascript";
          }

          return icon + (this.props.isSourceOverridden ? " has-network-override" : "");
        }
      });
    }

    return null;
  }

  renderItemName() {
    const {
      item
    } = this.props;

    if (item.type == "thread") {
      const {
        thread
      } = item;
      return thread.name + (thread.serviceWorkerStatus ? ` (${thread.serviceWorkerStatus})` : "");
    }

    if (item.type == "group") {
      return item.groupName;
    }

    if (item.type == "directory") {
      const parentItem = this.props.getParent(item);
      return item.path.replace(parentItem.path, "").replace(/^\//, "");
    }

    if (item.type == "source") {
      return item.source.longName;
    }

    return null;
  }

  renderItemTooltip() {
    const {
      item
    } = this.props;

    if (item.type == "thread") {
      return item.thread.name;
    }

    if (item.type == "group") {
      return item.groupName;
    }

    if (item.type == "directory") {
      return item.path;
    }

    if (item.type == "source") {
      return item.source.url;
    }

    return null;
  }

  render() {
    const {
      item,
      focused,
      hasMatchingGeneratedSource,
      hideIgnoredSources
    } = this.props;

    if (hideIgnoredSources && item.isBlackBoxed) {
      return null;
    }

    const suffix = hasMatchingGeneratedSource ? (0, _reactDomFactories.span)({
      className: "suffix"
    }, L10N.getStr("sourceFooter.mappedSuffix")) : null;
    return (0, _reactDomFactories.div)({
      className: classnames("node", {
        focused,
        blackboxed: item.type == "source" && item.isBlackBoxed
      }),
      key: item.path,
      onClick: this.onClick,
      onContextMenu: this.onContextMenu,
      title: this.renderItemTooltip()
    }, this.props.arrow, this.renderIcon(item), (0, _reactDomFactories.span)({
      className: "label"
    }, this.renderItemName(), suffix));
  }

}

function getHasMatchingGeneratedSource(state, source) {
  if (!source || !source.isOriginal) {
    return false;
  }

  return !!(0, _index.getGeneratedSourceByURL)(state, source.url);
}

const toolboxMapStateToProps = (state, props) => {
  const {
    item
  } = props;
  return {
    isSourceOverridden: (0, _index.isSourceOverridden)(state, item.source)
  };
};

const SourceTreeItemInner = (0, _reactRedux.connect)(toolboxMapStateToProps, {}, undefined, {
  storeKey: "toolbox-store"
})(SourceTreeItemContents);

class SourcesTreeItem extends _react.Component {
  static get propTypes() {
    return {
      autoExpand: _reactPropTypes.default.bool.isRequired,
      depth: _reactPropTypes.default.bool.isRequired,
      expanded: _reactPropTypes.default.bool.isRequired,
      focusItem: _reactPropTypes.default.func.isRequired,
      focused: _reactPropTypes.default.bool.isRequired,
      hasMatchingGeneratedSource: _reactPropTypes.default.bool.isRequired,
      item: _reactPropTypes.default.object.isRequired,
      selectSourceItem: _reactPropTypes.default.func.isRequired,
      setExpanded: _reactPropTypes.default.func.isRequired,
      showSourceTreeItemContextMenu: _reactPropTypes.default.func.isRequired,
      getParent: _reactPropTypes.default.func.isRequired,
      hideIgnoredSources: _reactPropTypes.default.bool,
      arrow: _reactPropTypes.default.object
    };
  }

  render() {
    return _react.default.createElement(SourceTreeItemInner, {
      autoExpand: this.props.autoExpand,
      depth: this.props.depth,
      expanded: this.props.expanded,
      focusItem: this.props.focusItem,
      focused: this.props.focused,
      hasMatchingGeneratedSource: this.props.hasMatchingGeneratedSource,
      item: this.props.item,
      selectSourceItem: this.props.selectSourceItem,
      setExpanded: this.props.setExpanded,
      showSourceTreeItemContextMenu: this.props.showSourceTreeItemContextMenu,
      getParent: this.props.getParent,
      hideIgnoredSources: this.props.hideIgnoredSources,
      arrow: this.props.arrow
    });
  }

}

const mapStateToProps = (state, props) => {
  const {
    item
  } = props;

  if (item.type == "source") {
    const {
      source
    } = item;
    return {
      hasMatchingGeneratedSource: getHasMatchingGeneratedSource(state, source),
      hideIgnoredSources: (0, _index.getHideIgnoredSources)(state)
    };
  }

  return {};
};

var _default = (0, _reactRedux.connect)(mapStateToProps, {
  showSourceTreeItemContextMenu: _index2.default.showSourceTreeItemContextMenu
})(SourcesTreeItem);

exports.default = _default;