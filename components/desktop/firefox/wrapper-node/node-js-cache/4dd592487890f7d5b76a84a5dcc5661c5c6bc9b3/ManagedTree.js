"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const {
  Tree
} = require("devtools/client/debugger/dist/vendors").vendored["devtools-components"];

class ManagedTree extends _react.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "setExpanded", (item, isExpanded, shouldIncludeChildren) => {
      const expandItem = i => {
        const path = this.props.getPath(i);

        if (isExpanded) {
          expanded.add(path);
        } else {
          expanded.delete(path);
        }
      };

      const {
        expanded
      } = this.state;
      expandItem(item);

      if (shouldIncludeChildren) {
        let parents = [item];

        while (parents.length) {
          const children = [];

          for (const parent of parents) {
            var _parent$contents;

            if ((_parent$contents = parent.contents) === null || _parent$contents === void 0 ? void 0 : _parent$contents.length) {
              for (const child of parent.contents) {
                expandItem(child);
                children.push(child);
              }
            }
          }

          parents = children;
        }
      }

      this.setState({
        expanded
      });

      if (isExpanded && this.props.onExpand) {
        this.props.onExpand(item, expanded);
      } else if (!isExpanded && this.props.onCollapse) {
        this.props.onCollapse(item, expanded);
      }
    });

    this.state = {
      expanded: props.expanded || new Set()
    };
  }

  componentWillReceiveProps(nextProps) {
    const {
      listItems,
      highlightItems
    } = this.props;

    if (nextProps.listItems && nextProps.listItems != listItems) {
      this.expandListItems(nextProps.listItems);
    }

    if (nextProps.highlightItems && nextProps.highlightItems != highlightItems && nextProps.highlightItems.length) {
      this.highlightItem(nextProps.highlightItems);
    }
  }

  expandListItems(listItems) {
    const {
      expanded
    } = this.state;
    listItems.forEach(item => expanded.add(this.props.getPath(item)));
    this.props.onFocus(listItems[0]);
    this.setState({
      expanded
    });
  }

  highlightItem(highlightItems) {
    const {
      expanded
    } = this.state; // This file is visible, so we highlight it.

    if (expanded.has(this.props.getPath(highlightItems[0]))) {
      this.props.onFocus(highlightItems[0]);
    } else {
      // Look at folders starting from the top-level until finds a
      // closed folder and highlights this folder
      const index = highlightItems.reverse().findIndex(item => !expanded.has(this.props.getPath(item)) && item.name !== "root");

      if (highlightItems[index]) {
        this.props.onFocus(highlightItems[index]);
      }
    }
  }

  render() {
    const {
      expanded
    } = this.state;
    return _react.default.createElement("div", {
      className: "managed-tree"
    }, _react.default.createElement(Tree, _extends({}, this.props, {
      isExpanded: item => expanded.has(this.props.getPath(item)),
      focused: this.props.focused,
      getKey: this.props.getPath,
      onExpand: (item, shouldIncludeChildren) => this.setExpanded(item, true, shouldIncludeChildren),
      onCollapse: (item, shouldIncludeChildren) => this.setExpanded(item, false, shouldIncludeChildren),
      onFocus: this.props.onFocus,
      renderItem: (...args) => this.props.renderItem(...args, {
        setExpanded: this.setExpanded
      })
    })));
  }

}

_defineProperty(ManagedTree, "defaultProps", {
  onFocus: () => {}
});

var _default = ManagedTree;
exports.default = _default;