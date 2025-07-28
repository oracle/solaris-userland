"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.HighlightLine = void 0;

var _react = require("devtools/client/shared/vendor/react");

var _reactPropTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

loader.lazyRequireGetter(this, "_index", "devtools/client/debugger/src/utils/editor/index");

var _reactRedux = require("devtools/client/shared/vendor/react-redux");

loader.lazyRequireGetter(this, "_index2", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_constants", "devtools/client/debugger/src/constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function isDebugLine(selectedFrame, selectedLocation) {
  if (!selectedFrame) {
    return false;
  }

  return selectedFrame.location.source.id == selectedLocation.source.id && selectedFrame.location.line == selectedLocation.line;
}

class HighlightLine extends _react.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "isStepping", false);

    _defineProperty(this, "previousEditorLine", null);
  }

  static get propTypes() {
    return {
      pauseCommand: _reactPropTypes.default.oneOf(["expression", "resume", "stepOver", "stepIn", "stepOut"]),
      selectedFrame: _reactPropTypes.default.object,
      selectedLocation: _reactPropTypes.default.object.isRequired,
      selectedSourceTextContent: _reactPropTypes.default.object.isRequired,
      shouldHighlightSelectedLocation: _reactPropTypes.default.bool.isRequired,
      editor: _reactPropTypes.default.object
    };
  }

  shouldComponentUpdate(nextProps) {
    return this.shouldSetHighlightLine(nextProps);
  }

  componentDidUpdate(prevProps) {
    this.highlightLine(prevProps);
  }

  componentDidMount() {
    this.highlightLine(null);
  }

  shouldSetHighlightLine({
    selectedLocation,
    selectedSourceTextContent
  }) {
    const editorLine = (0, _index.toEditorLine)(selectedLocation.source, selectedLocation.line);

    if (!selectedLocation || !selectedSourceTextContent) {
      return false;
    }

    if (this.isStepping && editorLine === this.previousEditorLine) {
      return false;
    }

    return true;
  }

  highlightLine(prevProps) {
    const {
      pauseCommand,
      shouldHighlightSelectedLocation
    } = this.props;

    if (pauseCommand) {
      this.isStepping = true;
    }

    if (prevProps) {
      this.clearHighlightLine(prevProps);
    }

    if (shouldHighlightSelectedLocation) {
      this.setHighlightLine();
    }
  }

  setHighlightLine() {
    const {
      selectedLocation,
      selectedFrame,
      editor
    } = this.props;

    if (!this.shouldSetHighlightLine(this.props)) {
      return;
    }

    this.isStepping = false;
    const editorLine = (0, _index.toEditorLine)(selectedLocation.source, selectedLocation.line);
    this.previousEditorLine = editorLine;

    if (!selectedLocation.line || isDebugLine(selectedFrame, selectedLocation)) {
      return;
    }

    editor.setLineContentMarker({
      id: _constants.markerTypes.HIGHLIGHT_LINE_MARKER,
      lineClassName: "highlight-line",
      lines: [{
        line: editorLine
      }]
    });
    this.clearHighlightLineAfterDuration();
  }

  clearHighlightLineAfterDuration() {
    const editorWrapper = document.querySelector(".editor-wrapper");

    if (editorWrapper === null) {
      return;
    }

    const duration = parseInt(getComputedStyle(editorWrapper).getPropertyValue("--highlight-line-duration"), 10);
    setTimeout(() => this.clearHighlightLine(this.props), duration);
  }

  clearHighlightLine({
    selectedLocation,
    selectedSourceTextContent
  }) {
    if (!selectedLocation || !selectedSourceTextContent) {
      return;
    }

    const {
      editor
    } = this.props;

    if (!editor) {
      return;
    }

    editor.removeLineContentMarker("highlight-line-marker");
  }

  render() {
    return null;
  }

}

exports.HighlightLine = HighlightLine;

var _default = (0, _reactRedux.connect)(state => {
  const selectedLocation = (0, _index2.getSelectedLocation)(state);

  if (!selectedLocation) {
    return {};
  }

  return {
    pauseCommand: (0, _index2.getPauseCommand)(state, (0, _index2.getCurrentThread)(state)),
    shouldHighlightSelectedLocation: (0, _index2.getShouldHighlightSelectedLocation)(state),
    selectedFrame: (0, _index2.getVisibleSelectedFrame)(state),
    selectedLocation,
    selectedSourceTextContent: (0, _index2.getSelectedSourceTextContent)(state)
  };
})(HighlightLine);

exports.default = _default;