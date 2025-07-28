"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("devtools/client/shared/vendor/react");

var _reactPropTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

loader.lazyRequireGetter(this, "_index", "devtools/client/debugger/src/selectors/index");

var _index2 = _interopRequireDefault(require("../../actions/index"));

loader.lazyRequireGetter(this, "_constants", "devtools/client/debugger/src/constants");

var _reactRedux = require("devtools/client/shared/vendor/react-redux");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

class ColumnBreakpoints extends _react.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "onClick", (event, columnBreakpoint) => {
      event.stopPropagation();
      event.preventDefault();
      const {
        toggleDisabledBreakpoint,
        removeBreakpoint,
        addBreakpoint,
        setSkipPausing
      } = this.props; // disable column breakpoint on shift-click.

      if (event.shiftKey) {
        toggleDisabledBreakpoint(columnBreakpoint.breakpoint);
        return;
      }

      if (columnBreakpoint.breakpoint) {
        removeBreakpoint(columnBreakpoint.breakpoint);
      } else {
        setSkipPausing(false);
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
      columnBreakpoints: _reactPropTypes.default.array,
      editor: _reactPropTypes.default.object.isRequired,
      selectedSource: _reactPropTypes.default.object,
      addBreakpoint: _reactPropTypes.default.func,
      removeBreakpoint: _reactPropTypes.default.func,
      setSkipPausing: _reactPropTypes.default.func,
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
    } = this.props;

    if (!selectedSource || !editor) {
      return;
    }

    if (!columnBreakpoints.length) {
      editor.removePositionContentMarker(_constants.markerTypes.COLUMN_BREAKPOINT_MARKER);
      return;
    }

    editor.setPositionContentMarker({
      id: _constants.markerTypes.COLUMN_BREAKPOINT_MARKER,
      positions: columnBreakpoints.map(cbp => {
        return {
          line: cbp.location.line,
          column: cbp.location.column,
          positionData: cbp
        };
      }),
      createPositionElementNode: (line, column, isFirstNonSpaceColumn, positionData) => {
        const breakpointNode = breakpointButton.cloneNode(true);
        breakpointNode.className = classnames("column-breakpoint", {
          "has-condition": positionData.breakpoint?.options.condition,
          "has-log": positionData.breakpoint?.options.logValue,
          active: positionData.breakpoint && !positionData.breakpoint.disabled,
          disabled: positionData.breakpoint?.disabled
        });
        breakpointNode.addEventListener("click", event => this.onClick(event, positionData));
        breakpointNode.addEventListener("contextmenu", event => this.onContextMenu(event, positionData));
        return breakpointNode;
      },
      customEq: (positionData, prevPositionData) => {
        return positionData?.breakpoint?.id == prevPositionData?.breakpoint?.id && positionData?.breakpoint?.options.condition == prevPositionData?.breakpoint?.options.condition && positionData?.breakpoint?.options.logValue == prevPositionData?.breakpoint?.options.logValue && positionData?.breakpoint?.disabled == prevPositionData?.breakpoint?.disabled;
      }
    });
  }

  render() {
    return null;
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
  addBreakpoint: _index2.default.addBreakpoint,
  setSkipPausing: _index2.default.setSkipPausing
})(ColumnBreakpoints);

exports.default = _default;