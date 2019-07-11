"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("devtools/client/shared/vendor/react");

var _classnames = require("devtools/client/debugger/dist/vendors").vendored["classnames"];

var _classnames2 = _interopRequireDefault(_classnames);

var _devtoolsContextmenu = require("devtools/client/debugger/dist/vendors").vendored["devtools-contextmenu"];

var _editor = require("../../utils/editor/index");

var _breakpoints = require("./menus/breakpoints");

var _selectedLocation = require("../../utils/selected-location");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-next-line max-len
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

const breakpointButton = document.createElement("button");
breakpointButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 13" width="11" height="13"><path d="M5.07.5H1.5c-.54 0-1 .46-1 1v10c0 .54.46 1 1 1h3.57c.58 0 1.15-.26 1.53-.7l3.7-5.3-3.7-5.3C6.22.76 5.65.5 5.07.5z"/></svg>';

function makeBookmark({ breakpoint }, { onClick, onContextMenu }) {
  const bp = breakpointButton.cloneNode(true);

  const isActive = breakpoint && !breakpoint.disabled;
  const isDisabled = breakpoint && breakpoint.disabled;
  const condition = breakpoint && breakpoint.options.condition;
  const logValue = breakpoint && breakpoint.options.logValue;

  bp.className = (0, _classnames2.default)("column-breakpoint", {
    "has-condition": condition,
    "has-log": logValue,
    active: isActive,
    disabled: isDisabled
  });

  bp.setAttribute("title", logValue || condition || "");
  bp.onclick = onClick;

  // NOTE: flow does not know about oncontextmenu
  bp.oncontextmenu = onContextMenu;

  return bp;
}

class ColumnBreakpoint extends _react.PureComponent {
  constructor(...args) {
    var _temp;

    return _temp = super(...args), this.addColumnBreakpoint = nextProps => {
      const { columnBreakpoint, source } = nextProps || this.props;

      const sourceId = source.id;
      const doc = (0, _editor.getDocument)(sourceId);
      if (!doc) {
        return;
      }

      const { line, column } = columnBreakpoint.location;
      const widget = makeBookmark(columnBreakpoint, {
        onClick: this.onClick,
        onContextMenu: this.onContextMenu
      });

      this.bookmark = doc.setBookmark({ line: line - 1, ch: column }, { widget });
    }, this.clearColumnBreakpoint = () => {
      if (this.bookmark) {
        this.bookmark.clear();
        this.bookmark = null;
      }
    }, this.onClick = event => {
      event.stopPropagation();
      event.preventDefault();
      const { cx, columnBreakpoint, breakpointActions } = this.props;
      if (columnBreakpoint.breakpoint) {
        breakpointActions.removeBreakpoint(cx, columnBreakpoint.breakpoint);
      } else {
        breakpointActions.addBreakpoint(cx, columnBreakpoint.location);
      }
    }, this.onContextMenu = event => {
      event.stopPropagation();
      event.preventDefault();
      const {
        cx,
        columnBreakpoint: { breakpoint, location },
        source,
        breakpointActions
      } = this.props;

      let items = (0, _breakpoints.createBreakpointItems)(cx, location, breakpointActions);

      if (breakpoint) {
        const selectedLocation = (0, _selectedLocation.getSelectedLocation)(breakpoint, source);

        items = (0, _breakpoints.breakpointItems)(cx, breakpoint, selectedLocation, breakpointActions);
      }

      (0, _devtoolsContextmenu.showMenu)(event, items);
    }, _temp;
  }

  componentDidMount() {
    this.addColumnBreakpoint();
  }

  componentWillUnmount() {
    this.clearColumnBreakpoint();
  }

  componentDidUpdate() {
    this.clearColumnBreakpoint();
    this.addColumnBreakpoint();
  }

  render() {
    return null;
  }
}
exports.default = ColumnBreakpoint;