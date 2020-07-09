"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("devtools/client/shared/vendor/react");

var _classnames = _interopRequireDefault(require("devtools/client/debugger/dist/vendors").vendored["classnames"]);

var _devtoolsContextmenu = require("devtools/client/debugger/dist/vendors").vendored["devtools-contextmenu"];

loader.lazyRequireGetter(this, "_editor", "devtools/client/debugger/src/utils/editor/index");
loader.lazyRequireGetter(this, "_breakpoints", "devtools/client/debugger/src/components/Editor/menus/breakpoints");
loader.lazyRequireGetter(this, "_selectedLocation", "devtools/client/debugger/src/utils/selected-location");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const breakpointButton = document.createElement("button");
breakpointButton.innerHTML = '<svg viewBox="0 0 11 13" width="11" height="13"><path d="M5.07.5H1.5c-.54 0-1 .46-1 1v10c0 .54.46 1 1 1h3.57c.58 0 1.15-.26 1.53-.7l3.7-5.3-3.7-5.3C6.22.76 5.65.5 5.07.5z"/></svg>';

function makeBookmark({
  breakpoint
}, {
  onClick,
  onContextMenu
}) {
  const bp = breakpointButton.cloneNode(true);
  const isActive = breakpoint && !breakpoint.disabled;
  const isDisabled = breakpoint === null || breakpoint === void 0 ? void 0 : breakpoint.disabled;
  const condition = breakpoint === null || breakpoint === void 0 ? void 0 : breakpoint.options.condition;
  const logValue = breakpoint === null || breakpoint === void 0 ? void 0 : breakpoint.options.logValue;
  bp.className = (0, _classnames.default)("column-breakpoint", {
    "has-condition": condition,
    "has-log": logValue,
    active: isActive,
    disabled: isDisabled
  });
  bp.setAttribute("title", logValue || condition || "");
  bp.onclick = onClick;
  bp.oncontextmenu = onContextMenu;
  return bp;
}

class ColumnBreakpoint extends _react.PureComponent {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "addColumnBreakpoint", nextProps => {
      const {
        columnBreakpoint,
        source
      } = nextProps || this.props;
      const sourceId = source.id;
      const doc = (0, _editor.getDocument)(sourceId);

      if (!doc) {
        return;
      }

      const {
        line,
        column
      } = columnBreakpoint.location;
      const widget = makeBookmark(columnBreakpoint, {
        onClick: this.onClick,
        onContextMenu: this.onContextMenu
      });
      this.bookmark = doc.setBookmark({
        line: line - 1,
        ch: column
      }, {
        widget
      });
    });

    _defineProperty(this, "clearColumnBreakpoint", () => {
      if (this.bookmark) {
        this.bookmark.clear();
        this.bookmark = null;
      }
    });

    _defineProperty(this, "onClick", event => {
      event.stopPropagation();
      event.preventDefault();
      const {
        cx,
        columnBreakpoint,
        breakpointActions
      } = this.props; // disable column breakpoint on shift-click.

      if (event.shiftKey) {
        const breakpoint = columnBreakpoint.breakpoint;
        return breakpointActions.toggleDisabledBreakpoint(cx, breakpoint);
      }

      if (columnBreakpoint.breakpoint) {
        breakpointActions.removeBreakpoint(cx, columnBreakpoint.breakpoint);
      } else {
        breakpointActions.addBreakpoint(cx, columnBreakpoint.location);
      }
    });

    _defineProperty(this, "onContextMenu", event => {
      event.stopPropagation();
      event.preventDefault();
      const {
        cx,
        columnBreakpoint: {
          breakpoint,
          location
        },
        source,
        breakpointActions
      } = this.props;
      let items = (0, _breakpoints.createBreakpointItems)(cx, location, breakpointActions);

      if (breakpoint) {
        const selectedLocation = (0, _selectedLocation.getSelectedLocation)(breakpoint, source);
        items = (0, _breakpoints.breakpointItems)(cx, breakpoint, selectedLocation, breakpointActions);
      }

      (0, _devtoolsContextmenu.showMenu)(event, items);
    });
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