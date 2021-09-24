"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.HighlightLine = void 0;

var _react = require("devtools/client/shared/vendor/react");

loader.lazyRequireGetter(this, "_editor", "devtools/client/debugger/src/utils/editor/index");
loader.lazyRequireGetter(this, "_sourceDocuments", "devtools/client/debugger/src/utils/editor/source-documents");
loader.lazyRequireGetter(this, "_connect", "devtools/client/debugger/src/utils/connect");
loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function isDebugLine(selectedFrame, selectedLocation) {
  if (!selectedFrame) {
    return;
  }

  return selectedFrame.location.sourceId == selectedLocation.sourceId && selectedFrame.location.line == selectedLocation.line;
}

function isDocumentReady(selectedSource, selectedLocation) {
  return selectedLocation && selectedSource && selectedSource.content && (0, _sourceDocuments.hasDocument)(selectedLocation.sourceId);
}

class HighlightLine extends _react.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "isStepping", false);

    _defineProperty(this, "previousEditorLine", null);
  }

  shouldComponentUpdate(nextProps) {
    const {
      selectedLocation,
      selectedSource
    } = nextProps;
    return this.shouldSetHighlightLine(selectedLocation, selectedSource);
  }

  componentDidUpdate(prevProps) {
    this.completeHighlightLine(prevProps);
  }

  componentDidMount() {
    this.completeHighlightLine(null);
  }

  shouldSetHighlightLine(selectedLocation, selectedSource) {
    const {
      sourceId,
      line
    } = selectedLocation;
    const editorLine = (0, _editor.toEditorLine)(sourceId, line);

    if (!isDocumentReady(selectedSource, selectedLocation)) {
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
      selectedSource
    } = this.props;

    if (pauseCommand) {
      this.isStepping = true;
    }

    (0, _editor.startOperation)();

    if (prevProps) {
      this.clearHighlightLine(prevProps.selectedLocation, prevProps.selectedSource);
    }

    this.setHighlightLine(selectedLocation, selectedFrame, selectedSource);
    (0, _editor.endOperation)();
  }

  setHighlightLine(selectedLocation, selectedFrame, selectedSource) {
    const {
      sourceId,
      line
    } = selectedLocation;

    if (!this.shouldSetHighlightLine(selectedLocation, selectedSource)) {
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

  clearHighlightLine(selectedLocation, selectedSource) {
    if (!isDocumentReady(selectedSource, selectedLocation)) {
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
    selectedSource: (0, _selectors.getSelectedSourceWithContent)(state)
  };
})(HighlightLine);

exports.default = _default;