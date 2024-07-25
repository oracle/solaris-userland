"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.HighlightLine = void 0;

var _react = require("devtools/client/shared/vendor/react");

var _reactPropTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

loader.lazyRequireGetter(this, "_index", "devtools/client/debugger/src/utils/editor/index");
loader.lazyRequireGetter(this, "_sourceDocuments", "devtools/client/debugger/src/utils/editor/source-documents");

var _reactRedux = require("devtools/client/shared/vendor/react-redux");

loader.lazyRequireGetter(this, "_index2", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_prefs", "devtools/client/debugger/src/utils/prefs");

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
      shouldHighlightSelectedLocation: _reactPropTypes.default.func.isRequired,
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
    const editorLine = (0, _index.toEditorLine)(selectedLocation.source.id, selectedLocation.line);

    if (!selectedLocation || !selectedSourceTextContent || !_prefs.features.codemirrorNext && !(0, _sourceDocuments.hasDocument)(selectedLocation.source.id)) {
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

    if (!_prefs.features.codemirrorNext) {
      (0, _index.startOperation)();
    }

    if (prevProps) {
      this.clearHighlightLine(prevProps);
    }

    if (shouldHighlightSelectedLocation) {
      this.setHighlightLine();
    }

    if (!_prefs.features.codemirrorNext) {
      (0, _index.endOperation)();
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
    const sourceId = selectedLocation.source.id;
    const editorLine = (0, _index.toEditorLine)(sourceId, selectedLocation.line);
    this.previousEditorLine = editorLine;

    if (!selectedLocation.line || isDebugLine(selectedFrame, selectedLocation)) {
      return;
    }

    if (_prefs.features.codemirrorNext) {
      editor.setLineContentMarker({
        id: "highlight-line-marker",
        lineClassName: "highlight-line",

        condition(line) {
          const lineNumber = (0, _index.fromEditorLine)(sourceId, line);
          return selectedLocation.line == lineNumber;
        }

      });
    } else {
      const doc = (0, _sourceDocuments.getDocument)(sourceId);
      doc.addLineClass(editorLine, "wrap", "highlight-line");
    }

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

    if (_prefs.features.codemirrorNext) {
      const {
        editor
      } = this.props;

      if (editor) {
        editor.removeLineContentMarker("highlight-line-marker");
      }

      return;
    }

    if (!(0, _sourceDocuments.hasDocument)(selectedLocation.source.id)) {
      return;
    }

    const sourceId = selectedLocation.source.id;
    const editorLine = (0, _index.toEditorLine)(sourceId, selectedLocation.line);
    const doc = (0, _sourceDocuments.getDocument)(sourceId);
    doc.removeLineClass(editorLine, "wrap", "highlight-line");
  }

  render() {
    return null;
  }

}

exports.HighlightLine = HighlightLine;

var _default = (0, _reactRedux.connect)(state => {
  const selectedLocation = (0, _index2.getSelectedLocation)(state);

  if (!selectedLocation) {
    throw new Error("must have selected location");
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