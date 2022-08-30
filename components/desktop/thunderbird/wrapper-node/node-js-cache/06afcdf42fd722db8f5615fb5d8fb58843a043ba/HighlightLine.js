"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.HighlightLine = void 0;

var _react = require("devtools/client/shared/vendor/react");

var _propTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

loader.lazyRequireGetter(this, "_editor", "devtools/client/debugger/src/utils/editor/index");
loader.lazyRequireGetter(this, "_sourceDocuments", "devtools/client/debugger/src/utils/editor/source-documents");
loader.lazyRequireGetter(this, "_connect", "devtools/client/debugger/src/utils/connect");
loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function isDebugLine(selectedFrame, selectedLocation) {
  if (!selectedFrame) {
    return;
  }

  return selectedFrame.location.sourceId == selectedLocation.sourceId && selectedFrame.location.line == selectedLocation.line;
}

function isDocumentReady(selectedLocation, selectedSourceTextContent) {
  return selectedLocation && selectedSourceTextContent && (0, _sourceDocuments.hasDocument)(selectedLocation.sourceId);
}

class HighlightLine extends _react.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "isStepping", false);

    _defineProperty(this, "previousEditorLine", null);
  }

  static get propTypes() {
    return {
      pauseCommand: _propTypes.default.oneOf(["expression", "resume", "stepOver", "stepIn", "stepOut"]),
      selectedFrame: _propTypes.default.object,
      selectedLocation: _propTypes.default.object.isRequired,
      selectedSourceTextContent: _propTypes.default.object.isRequired
    };
  }

  shouldComponentUpdate(nextProps) {
    const {
      selectedLocation,
      selectedSourceTextContent
    } = nextProps;
    return this.shouldSetHighlightLine(selectedLocation, selectedSourceTextContent);
  }

  componentDidUpdate(prevProps) {
    this.completeHighlightLine(prevProps);
  }

  componentDidMount() {
    this.completeHighlightLine(null);
  }

  shouldSetHighlightLine(selectedLocation, selectedSourceTextContent) {
    const {
      sourceId,
      line
    } = selectedLocation;
    const editorLine = (0, _editor.toEditorLine)(sourceId, line);

    if (!isDocumentReady(selectedLocation, selectedSourceTextContent)) {
      return false;
    }

    if (this.isStepping && editorLine === this.previousEditorLine) {
      return false;
    }

    return true;
  }

  completeHighlightLine(prevProps) {
    const {
      pauseCommand,
      selectedLocation,
      selectedFrame,
      selectedSourceTextContent
    } = this.props;

    if (pauseCommand) {
      this.isStepping = true;
    }

    (0, _editor.startOperation)();

    if (prevProps) {
      this.clearHighlightLine(prevProps.selectedLocation, prevProps.selectedSourceTextContent);
    }

    this.setHighlightLine(selectedLocation, selectedFrame, selectedSourceTextContent);
    (0, _editor.endOperation)();
  }

  setHighlightLine(selectedLocation, selectedFrame, selectedSourceTextContent) {
    const {
      sourceId,
      line
    } = selectedLocation;

    if (!this.shouldSetHighlightLine(selectedLocation, selectedSourceTextContent)) {
      return;
    }

    this.isStepping = false;
    const editorLine = (0, _editor.toEditorLine)(sourceId, line);
    this.previousEditorLine = editorLine;

    if (!line || isDebugLine(selectedFrame, selectedLocation)) {
      return;
    }

    const doc = (0, _sourceDocuments.getDocument)(sourceId);
    doc.addLineClass(editorLine, "wrapClass", "highlight-line");
    this.resetHighlightLine(doc, editorLine);
  }

  resetHighlightLine(doc, editorLine) {
    const editorWrapper = document.querySelector(".editor-wrapper");

    if (editorWrapper === null) {
      return;
    }

    const duration = parseInt(getComputedStyle(editorWrapper).getPropertyValue("--highlight-line-duration"), 10);
    setTimeout(() => doc && doc.removeLineClass(editorLine, "wrapClass", "highlight-line"), duration);
  }

  clearHighlightLine(selectedLocation, selectedSourceTextContent) {
    if (!isDocumentReady(selectedLocation, selectedSourceTextContent)) {
      return;
    }

    const {
      line,
      sourceId
    } = selectedLocation;
    const editorLine = (0, _editor.toEditorLine)(sourceId, line);
    const doc = (0, _sourceDocuments.getDocument)(sourceId);
    doc.removeLineClass(editorLine, "wrapClass", "highlight-line");
  }

  render() {
    return null;
  }

}

exports.HighlightLine = HighlightLine;

var _default = (0, _connect.connect)(state => {
  const selectedLocation = (0, _selectors.getSelectedLocation)(state);

  if (!selectedLocation) {
    throw new Error("must have selected location");
  }

  return {
    pauseCommand: (0, _selectors.getPauseCommand)(state, (0, _selectors.getCurrentThread)(state)),
    selectedFrame: (0, _selectors.getVisibleSelectedFrame)(state),
    selectedLocation,
    selectedSourceTextContent: (0, _selectors.getSelectedSourceTextContent)(state)
  };
})(HighlightLine);

exports.default = _default;