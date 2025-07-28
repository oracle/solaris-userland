"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactPropTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

var _react = require("devtools/client/shared/vendor/react");

loader.lazyRequireGetter(this, "_index", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_selectedLocation", "devtools/client/debugger/src/utils/selected-location");

var _reactRedux = require("devtools/client/shared/vendor/react-redux");

loader.lazyRequireGetter(this, "_index2", "devtools/client/debugger/src/utils/editor/index");

var _index3 = _interopRequireDefault(require("../../actions/index"));

loader.lazyRequireGetter(this, "_constants", "devtools/client/debugger/src/constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const classnames = require("resource://devtools/client/shared/classnames.js");

const isMacOS = Services.appinfo.OS === "Darwin";

class Breakpoints extends _react.Component {
  static get propTypes() {
    return {
      breakpoints: _reactPropTypes.default.array,
      editor: _reactPropTypes.default.object,
      selectedSource: _reactPropTypes.default.object,
      removeBreakpointsAtLine: _reactPropTypes.default.func,
      toggleBreakpointsAtLine: _reactPropTypes.default.func,
      continueToHere: _reactPropTypes.default.func,
      showEditorEditBreakpointContextMenu: _reactPropTypes.default.func
    };
  }

  constructor(props) {
    super(props);

    _defineProperty(this, "onClick", (event, breakpoint) => {
      const {
        continueToHere,
        toggleBreakpointsAtLine,
        removeBreakpointsAtLine,
        selectedSource
      } = this.props;
      event.stopPropagation();
      event.preventDefault(); // ignore right clicks when clicking on the breakpoint

      if (event.button === 2) {
        return;
      }

      const selectedLocation = (0, _selectedLocation.getSelectedLocation)(breakpoint, selectedSource);
      const ctrlOrCmd = isMacOS ? event.metaKey : event.ctrlKey;

      if (ctrlOrCmd) {
        continueToHere(selectedLocation);
        return;
      }

      if (event.shiftKey) {
        toggleBreakpointsAtLine(!breakpoint.disabled, selectedLocation.line);
        return;
      }

      removeBreakpointsAtLine(selectedLocation.source, selectedLocation.line);
    });

    _defineProperty(this, "onContextMenu", (event, breakpoint) => {
      event.stopPropagation();
      event.preventDefault();
      this.props.showEditorEditBreakpointContextMenu(event, breakpoint);
    });
  }

  componentDidMount() {
    this.setMarkers();
  }

  componentDidUpdate() {
    this.setMarkers();
  }

  setMarkers() {
    const {
      selectedSource,
      editor,
      breakpoints
    } = this.props;

    if (!selectedSource || !breakpoints || !editor) {
      return;
    }

    const isSourceWasm = editor.isWasm;
    const wasmLineFormatter = editor.getWasmLineNumberFormatter();
    const markers = [{
      id: _constants.markerTypes.GUTTER_BREAKPOINT_MARKER,
      lineClassName: "cm6-gutter-breakpoint",
      condition: line => {
        const lineNumber = (0, _index2.fromEditorLine)(selectedSource, line);
        const breakpoint = breakpoints.find(bp => (0, _selectedLocation.getSelectedLocation)(bp, selectedSource).line === lineNumber);

        if (!breakpoint) {
          return false;
        }

        return breakpoint;
      },
      createLineElementNode: (line, breakpoint) => {
        const lineNumber = (0, _index2.fromEditorLine)(selectedSource, line);
        const displayLineNumber = isSourceWasm && !selectedSource.isOriginal ? wasmLineFormatter(line) : lineNumber;
        const breakpointNode = document.createElement("div");
        breakpointNode.appendChild(document.createTextNode(displayLineNumber));
        breakpointNode.className = classnames("breakpoint-marker", {
          "breakpoint-disabled": breakpoint.disabled,
          "has-condition": breakpoint?.options.condition,
          "has-log": breakpoint?.options.logValue
        });

        breakpointNode.onclick = event => this.onClick(event, breakpoint);

        breakpointNode.oncontextmenu = event => this.onContextMenu(event, breakpoint);

        return breakpointNode;
      }
    }];
    editor.setLineGutterMarkers(markers);
  }

  render() {
    return null;
  }

}

const mapStateToProps = state => {
  const selectedSource = (0, _index.getSelectedSource)(state);
  return {
    // Retrieves only the first breakpoint per line so that the
    // breakpoint marker represents only the first breakpoint
    breakpoints: (0, _index.getFirstVisibleBreakpoints)(state),
    selectedSource
  };
};

var _default = (0, _reactRedux.connect)(mapStateToProps, {
  showEditorEditBreakpointContextMenu: _index3.default.showEditorEditBreakpointContextMenu,
  continueToHere: _index3.default.continueToHere,
  toggleBreakpointsAtLine: _index3.default.toggleBreakpointsAtLine,
  removeBreakpointsAtLine: _index3.default.removeBreakpointsAtLine
})(Breakpoints);

exports.default = _default;