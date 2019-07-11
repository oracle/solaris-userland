"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /* This Source Code Form is subject to the terms of the Mozilla Public
                                                                                                                                                                                                                                                                   * License, v. 2.0. If a copy of the MPL was not distributed with this
                                                                                                                                                                                                                                                                   * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

var _react = require("devtools/client/shared/vendor/react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const { Tree } = require("devtools/client/debugger/dist/vendors").vendored["devtools-components"];

class ManagedTree extends _react.Component {
  constructor(props) {
    super(props);

    this.setExpanded = (item, isExpanded, shouldIncludeChildren) => {
      const expandItem = i => {
        const path = this.props.getPath(i);
        if (isExpanded) {
          expanded.add(path);
        } else {
          expanded.delete(path);
        }
      };
      const { expanded } = this.state;
      expandItem(item);

      if (shouldIncludeChildren) {
        let parents = [item];
        while (parents.length) {
          const children = [];
          for (const parent of parents) {
            if (parent.contents && parent.contents.length) {
              for (const child of parent.contents) {
                expandItem(child);
                children.push(child);
              }
            }
          }
          parents = children;
        }
      }
      this.setState({ expanded });

      if (isExpanded && this.props.onExpand) {
        this.props.onExpand(item, expanded);
      } else if (!isExpanded && this.props.onCollapse) {
        this.props.onCollapse(item, expanded);
      }
    };

    this.state = {
      expanded: props.expanded || new Set()
    };
  }

  componentWillReceiveProps(nextProps) {
    const { listItems, highlightItems } = this.props;
    if (nextProps.listItems && nextProps.listItems != listItems) {
      this.expandListItems(nextProps.listItems);
    }

    if (nextProps.highlightItems && nextProps.highlightItems != highlightItems && nextProps.highlightItems.length) {
      this.highlightItem(nextProps.highlightItems);
    }
  }

  expandListItems(listItems) {
    const { expanded } = this.state;
    listItems.forEach(item => expanded.add(this.props.getPath(item)));
    this.props.onFocus(listItems[0]);
    this.setState({ expanded });
  }

  highlightItem(highlightItems) {
    const { expanded } = this.state;
    // This file is visible, so we highlight it.
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
    const { expanded } = this.state;
    return _react2.default.createElement(
      "div",
      { className: "managed-tree" },
      _react2.default.createElement(Tree, _extends({}, this.props, {
        isExpanded: item => expanded.has(this.props.getPath(item)),
        focused: this.props.focused,
        getKey: this.props.getPath,
        onExpand: (item, shouldIncludeChildren) => this.setExpanded(item, true, shouldIncludeChildren),
        onCollapse: (item, shouldIncludeChildren) => this.setExpanded(item, false, shouldIncludeChildren),
        onFocus: this.props.onFocus,
        renderItem: (...args) => this.props.renderItem(...args, {
          setExpanded: this.setExpanded
        })
      }))
    );
  }
}

ManagedTree.defaultProps = {
  onFocus: () => {}
};
exports.default = ManagedTree;