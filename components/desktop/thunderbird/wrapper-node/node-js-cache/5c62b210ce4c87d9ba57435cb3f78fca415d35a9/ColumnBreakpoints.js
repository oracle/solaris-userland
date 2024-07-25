"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _reactDomFactories = require("devtools/client/shared/vendor/react-dom-factories");

var _reactPropTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

loader.lazyRequireGetter(this, "_prefs", "devtools/client/debugger/src/utils/prefs");

var _ColumnBreakpoint = _interopRequireDefault(require("./ColumnBreakpoint"));

loader.lazyRequireGetter(this, "_index", "devtools/client/debugger/src/selectors/index");

var _index2 = _interopRequireDefault(require("../../actions/index"));

var _reactRedux = require("devtools/client/shared/vendor/react-redux");

loader.lazyRequireGetter(this, "_index3", "devtools/client/debugger/src/utils/breakpoint/index");
loader.lazyRequireGetter(this, "_index4", "devtools/client/debugger/src/utils/editor/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const classnames = require("resource://devtools/client/shared/classnames.js");

const breakpointButton = document.createElement("button");
const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
svg.setAttribute("viewBox", "0 0 11 13");
svg.setAttribute("width", 11);
svg.setAttribute("height", 13);
const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
path.setAttributeNS(null, "d", "M5.07.5H1.5c-.54 0-1 .46-1 1v10c0 .54.46 1 1 1h3.57c.58 0 1.15-.26 1.53-.7l3.7-5.3-3.7-5.3C6.22.76 5.65.5 5.07.5z");
svg.appendChild(path);
breakpointButton.appendChild(svg);
const COLUMN_BREAKPOINT_MARKER = "column-breakpoint-marker";

class ColumnBreakpoints extends _react.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "onClick", (event, columnBreakpoint) => {
      event.stopPropagation();
      event.preventDefault();
      const {
        toggleDisabledBreakpoint,
        removeBreakpoint,
        addBreakpoint
      } = this.props; // disable column breakpoint on shift-click.

      if (event.shiftKey) {
        toggleDisabledBreakpoint(columnBreakpoint.breakpoint);
        return;
      }

      if (columnBreakpoint.breakpoint) {
        removeBreakpoint(columnBreakpoint.breakpoint);
      } else {
        addBreakpoint(columnBreakpoint.location);
      }
    });

    _defineProperty(this, "onContextMenu", (event, columnBreakpoint) => {
      event.stopPropagation();
      event.preventDefault();

      if (columnBreakpoint.breakpoint) {
        this.props.showEditorEditBreakpointContextMenu(event, columnBreakpoint.breakpoint);
      } else {
        this.props.showEditorCreateBreakpointContextMenu(event, columnBreakpoint.location);
      }
    });
  }

  static get propTypes() {
    return {
      columnBreakpoints: _reactPropTypes.default.array.isRequired,
      editor: _reactPropTypes.default.object.isRequired,
      selectedSource: _reactPropTypes.default.object,
      addBreakpoint: _reactPropTypes.default.func,
      removeBreakpoint: _reactPropTypes.default.func,
      toggleDisabledBreakpoint: _reactPropTypes.default.func,
      showEditorCreateBreakpointContextMenu: _reactPropTypes.default.func,
      showEditorEditBreakpointContextMenu: _reactPropTypes.default.func
    };
  }

  componentDidUpdate() {
    const {
      selectedSource,
      columnBreakpoints,
      editor
    } = this.props; // Only for codemirror 6

    if (!_prefs.features.codemirrorNext) {
      return;
    }

    if (!selectedSource || !editor) {
      return;
    }

    if (!columnBreakpoints.length) {
      editor.removePositionContentMarker(COLUMN_BREAKPOINT_MARKER);
      return;
    }

    editor.setPositionContentMarker({
      id: COLUMN_BREAKPOINT_MARKER,
      positions: columnBreakpoints.map(bp => bp.location),
      createPositionElementNode: (line, column) => {
        const lineNumber = (0, _index4.fromEditorLine)(selectedSource.id, line);
        const columnBreakpoint = columnBreakpoints.find(bp => bp.location.line === lineNumber && bp.location.column === column);
        const breakpointNode = breakpointButton.cloneNode(true);
        breakpointNode.className = classnames("column-breakpoint", {
          "has-condition": columnBreakpoint.breakpoint?.options.condition,
          "has-log": columnBreakpoint.breakpoint?.options.logValue,
          active: columnBreakpoint.breakpoint && !columnBreakpoint.breakpoint.disabled,
          disabled: columnBreakpoint.breakpoint?.disabled
        });
        breakpointNode.addEventListener("click", event => this.onClick(event, columnBreakpoint));
        breakpointNode.addEventListener("contextmenu", event => this.onContextMenu(event, columnBreakpoint));
        return breakpointNode;
      }
    });
  }

  render() {
    const {
      editor,
      columnBreakpoints,
      selectedSource,
      showEditorCreateBreakpointContextMenu,
      showEditorEditBreakpointContextMenu,
      toggleDisabledBreakpoint,
      removeBreakpoint,
      addBreakpoint
    } = this.props;

    if (_prefs.features.codemirrorNext) {
      return null;
    }

    if (!selectedSource || columnBreakpoints.length === 0) {
      return null;
    }

    let breakpoints;
    editor.codeMirror.operation(() => {
      breakpoints = columnBreakpoints.map(columnBreakpoint => _react.default.createElement(_ColumnBreakpoint.default, {
        key: (0, _index3.makeBreakpointId)(columnBreakpoint.location),
        columnBreakpoint,
        editor,
        source: selectedSource,
        showEditorCreateBreakpointContextMenu,
        showEditorEditBreakpointContextMenu,
        toggleDisabledBreakpoint,
        removeBreakpoint,
        addBreakpoint
      }));
    });
    return (0, _reactDomFactories.div)(null, breakpoints);
  }

}

const mapStateToProps = state => {
  // Avoid rendering this component is there is no selected source,
  // or if the selected source is blackboxed.
  // Also avoid computing visible column breakpoint when this happens.
  const selectedSource = (0, _index.getSelectedSource)(state);

  if (!selectedSource || (0, _index.isSourceBlackBoxed)(state, selectedSource)) {
    return {};
  }

  return {
    selectedSource,
    columnBreakpoints: (0, _index.visibleColumnBreakpoints)(state)
  };
};

var _default = (0, _reactRedux.connect)(mapStateToProps, {
  showEditorCreateBreakpointContextMenu: _index2.default.showEditorCreateBreakpointContextMenu,
  showEditorEditBreakpointContextMenu: _index2.default.showEditorEditBreakpointContextMenu,
  toggleDisabledBreakpoint: _index2.default.toggleDisabledBreakpoint,
  removeBreakpoint: _index2.default.removeBreakpoint,
  addBreakpoint: _index2.default.addBreakpoint
})(ColumnBreakpoints);

exports.default = _default;