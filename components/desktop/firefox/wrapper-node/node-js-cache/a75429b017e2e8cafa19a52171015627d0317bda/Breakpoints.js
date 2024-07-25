"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactPropTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _reactDomFactories = require("devtools/client/shared/vendor/react-dom-factories");

var _Breakpoint = _interopRequireDefault(require("./Breakpoint"));

loader.lazyRequireGetter(this, "_index", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_selectedLocation", "devtools/client/debugger/src/utils/selected-location");
loader.lazyRequireGetter(this, "_index2", "devtools/client/debugger/src/utils/breakpoint/index");

var _reactRedux = require("devtools/client/shared/vendor/react-redux");

loader.lazyRequireGetter(this, "_index3", "devtools/client/debugger/src/utils/editor/index");

var _index4 = _interopRequireDefault(require("../../actions/index"));

loader.lazyRequireGetter(this, "_prefs", "devtools/client/debugger/src/utils/prefs");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const classnames = require("resource://devtools/client/shared/classnames.js");

const isMacOS = Services.appinfo.OS === "Darwin";
const breakpointSvg = document.createElement("div");
const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
svg.setAttribute("viewBox", "0 0 60 15");
svg.setAttribute("width", 60);
svg.setAttribute("height", 15);
const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
path.setAttributeNS(null, "d", "M53.07.5H1.5c-.54 0-1 .46-1 1v12c0 .54.46 1 1 1h51.57c.58 0 1.15-.26 1.53-.7l4.7-6.3-4.7-6.3c-.38-.44-.95-.7-1.53-.7z");
svg.appendChild(path);
breakpointSvg.appendChild(svg);

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

  componentDidUpdate() {
    const {
      selectedSource,
      breakpoints,
      editor
    } = this.props; // Only for codemirror 6

    if (!_prefs.features.codemirrorNext) {
      return;
    }

    if (!selectedSource || !breakpoints || !editor) {
      return;
    }

    const markers = [{
      id: "gutter-breakpoint-marker",
      lineClassName: "cm6-gutter-breakpoint",
      condition: line => {
        const lineNumber = (0, _index3.fromEditorLine)(selectedSource.id, line);
        return breakpoints.some(bp => bp.location.line === lineNumber);
      },
      createLineElementNode: line => {
        const lineNumber = (0, _index3.fromEditorLine)(selectedSource.id, line);
        const breakpoint = breakpoints.find(bp => bp.location.line === lineNumber);
        const breakpointNode = breakpointSvg.cloneNode(true);
        breakpointNode.appendChild(document.createTextNode(lineNumber));
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
    const {
      breakpoints,
      selectedSource,
      editor,
      showEditorEditBreakpointContextMenu,
      continueToHere,
      toggleBreakpointsAtLine,
      removeBreakpointsAtLine
    } = this.props;

    if (!selectedSource || !breakpoints) {
      return null;
    }

    if (_prefs.features.codemirrorNext) {
      return null;
    }

    return (0, _reactDomFactories.div)(null, breakpoints.map(breakpoint => {
      return _react.default.createElement(_Breakpoint.default, {
        key: (0, _index2.makeBreakpointId)(breakpoint.location),
        breakpoint,
        selectedSource,
        showEditorEditBreakpointContextMenu,
        continueToHere,
        toggleBreakpointsAtLine,
        removeBreakpointsAtLine,
        editor
      });
    }));
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
  showEditorEditBreakpointContextMenu: _index4.default.showEditorEditBreakpointContextMenu,
  continueToHere: _index4.default.continueToHere,
  toggleBreakpointsAtLine: _index4.default.toggleBreakpointsAtLine,
  removeBreakpointsAtLine: _index4.default.removeBreakpointsAtLine
})(Breakpoints);

exports.default = _default;