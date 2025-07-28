"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.DebugLine = void 0;

var _react = require("devtools/client/shared/vendor/react");

var _reactPropTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

loader.lazyRequireGetter(this, "_index", "devtools/client/debugger/src/utils/editor/index");
loader.lazyRequireGetter(this, "_index2", "devtools/client/debugger/src/utils/pause/index");

var _reactRedux = require("devtools/client/shared/vendor/react-redux");

loader.lazyRequireGetter(this, "_constants", "devtools/client/debugger/src/constants");
loader.lazyRequireGetter(this, "_index3", "devtools/client/debugger/src/selectors/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class DebugLine extends _react.PureComponent {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "debugExpression", void 0);
  }

  static get propTypes() {
    return {
      editor: _reactPropTypes.default.object,
      selectedSource: _reactPropTypes.default.object,
      location: _reactPropTypes.default.object,
      why: _reactPropTypes.default.object,
      sourceTextContent: _reactPropTypes.default.object
    };
  }

  componentDidMount() {
    this.setDebugLine();
  }

  componentWillUnmount() {
    this.clearDebugLine(this.props);
  }

  componentDidUpdate(prevProps) {
    this.clearDebugLine(prevProps);
    this.setDebugLine();
  }

  setDebugLine() {
    const {
      why,
      location,
      editor,
      selectedSource
    } = this.props;

    if (!location) {
      return;
    }

    if (!selectedSource || location.source.id !== selectedSource.id) {
      return;
    }

    const {
      lineClass,
      markTextClass
    } = this.getTextClasses(why);
    const editorLocation = (0, _index.toEditorPosition)(location); // Show the paused "caret", to highlight on which particular line **and column** we are paused.
    //
    // Using only a `positionClassName` wouldn't only be applied to the immediate
    // token after the position and force to use ::before to show the paused location.
    // Using ::before prevents using :hover to be able to hide the icon on mouse hovering.
    //
    // So we have to use `createPositionElementNode`, similarly to column breakpoints
    // to have a new dedicated DOM element for the paused location.

    editor.setPositionContentMarker({
      id: _constants.markerTypes.PAUSED_LOCATION_MARKER,
      // Ensure displaying the marker after all the other markers and especially the column breakpoint markers
      displayLast: true,
      positions: [editorLocation],

      createPositionElementNode(_line, _column, isFirstNonSpaceColumn) {
        const pausedLocation = document.createElement("span");
        pausedLocation.className = `paused-location${isFirstNonSpaceColumn ? " first-column" : ""}`;
        const bar = document.createElement("span");
        bar.className = `vertical-bar`;
        pausedLocation.appendChild(bar);
        return pausedLocation;
      }

    });
    editor.setLineContentMarker({
      id: _constants.markerTypes.DEBUG_LINE_MARKER,
      lineClassName: lineClass,
      lines: [{
        line: editorLocation.line
      }]
    });
    editor.setPositionContentMarker({
      id: _constants.markerTypes.DEBUG_POSITION_MARKER,
      positionClassName: markTextClass,
      positions: [editorLocation]
    });
  }

  clearDebugLine(otherProps = {}) {
    const {
      location,
      editor,
      selectedSource
    } = this.props; // Remove the debug line marker when no longer paused, or the selected source
    // is no longer the source where the pause occured.

    if (!location || location.source.id !== selectedSource.id || otherProps?.location !== location || otherProps?.selectedSource?.id !== selectedSource.id) {
      editor.removeLineContentMarker(_constants.markerTypes.DEBUG_LINE_MARKER);
      editor.removePositionContentMarker(_constants.markerTypes.DEBUG_POSITION_MARKER);
      editor.removePositionContentMarker(_constants.markerTypes.PAUSED_LOCATION_MARKER);
    }
  }

  getTextClasses(why) {
    if (why && (0, _index2.isException)(why)) {
      return {
        markTextClass: "debug-expression-error",
        lineClass: "new-debug-line-error"
      };
    } // We no longer highlight the next token via debug-expression
    // and only highlight the line via paused-line.


    return {
      markTextClass: null,
      lineClass: why == "tracer" ? "traced-line" : "paused-line"
    };
  }

  render() {
    return null;
  }

}

exports.DebugLine = DebugLine;

function isDocumentReady(location, sourceTextContent) {
  return location && sourceTextContent;
}

const mapStateToProps = state => {
  // If we aren't paused, fallback on showing the JS tracer
  // currently selected trace location.
  // If any trace is selected in the JS Tracer, this takes the lead over
  // any paused location. (the same choice is made when showing inline previews)
  let why;
  let location = (0, _index3.getSelectedTraceLocation)(state);

  if (location) {
    why = "tracer";
  } else {
    // Avoid unecessary intermediate updates when there is no location
    // or the source text content isn't yet fully loaded
    const frame = (0, _index3.getVisibleSelectedFrame)(state);
    location = frame?.location; // We are not tracing, nor pausing

    if (!location) {
      return {};
    }

    why = (0, _index3.getPauseReason)(state, (0, _index3.getCurrentThread)(state));
  } // if we have a valid viewport.
  // This is a way to know if the actual source is displayed
  // and we are no longer on the "loading..." message


  if (!(0, _index3.getViewport)(state)) {
    return {};
  }

  const sourceTextContent = (0, _index3.getSourceTextContent)(state, location);

  if (!isDocumentReady(location, sourceTextContent)) {
    return {};
  }

  return {
    location,
    why,
    sourceTextContent
  };
};

var _default = (0, _reactRedux.connect)(mapStateToProps)(DebugLine);

exports.default = _default;