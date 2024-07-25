"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.DebugLine = void 0;

var _react = require("devtools/client/shared/vendor/react");

var _reactPropTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

loader.lazyRequireGetter(this, "_index", "devtools/client/debugger/src/utils/editor/index");
loader.lazyRequireGetter(this, "_index2", "devtools/client/debugger/src/utils/pause/index");
loader.lazyRequireGetter(this, "_indentation", "devtools/client/debugger/src/utils/indentation");

var _reactRedux = require("devtools/client/shared/vendor/react-redux");

loader.lazyRequireGetter(this, "_index3", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_wasm", "devtools/client/debugger/src/utils/wasm");
loader.lazyRequireGetter(this, "_prefs", "devtools/client/debugger/src/utils/prefs");

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
      why: _reactPropTypes.default.object
    };
  }

  componentDidMount() {
    const {
      why,
      location
    } = this.props;

    if (_prefs.features.codemirrorNext) {
      return;
    }

    this.setDebugLine(why, location);
  }

  componentWillUnmount() {
    const {
      why,
      location
    } = this.props;

    if (_prefs.features.codemirrorNext) {
      return;
    }

    this.clearDebugLine(why, location);
  }

  componentDidUpdate(prevProps) {
    const {
      why,
      location,
      editor,
      selectedSource
    } = this.props;

    if (_prefs.features.codemirrorNext) {
      if (!selectedSource) {
        return;
      }

      if (prevProps.location == this.props.location && prevProps.selectedSource?.id == selectedSource?.id) {
        return;
      }

      const {
        lineClass,
        markTextClass
      } = this.getTextClasses(why); // Remove the debug line marker when no longer paused, or the selected source
      // is no longer the source where the pause occured.

      if (!location || location.source.id !== selectedSource.id) {
        editor.removeLineContentMarker("debug-line-marker");
        editor.removePositionContentMarker("debug-position-marker");
      } else {
        const isSourceWasm = (0, _wasm.isWasm)(selectedSource.id);
        editor.setLineContentMarker({
          id: "debug-line-marker",
          lineClassName: lineClass,

          condition(line) {
            const lineNumber = (0, _index.fromEditorLine)(selectedSource.id, line, isSourceWasm);
            const editorLocation = (0, _index.toEditorPosition)(location);
            return editorLocation.line == lineNumber;
          }

        });
        const editorLocation = (0, _index.toEditorPosition)(location);
        editor.setPositionContentMarker({
          id: "debug-position-marker",
          positionClassName: markTextClass,
          positions: [editorLocation]
        });
      }
    } else {
      (0, _index.startOperation)();
      this.clearDebugLine(prevProps.why, prevProps.location);
      this.setDebugLine(why, location);
      (0, _index.endOperation)();
    }
  }

  setDebugLine(why, location) {
    if (!location) {
      return;
    }

    const doc = (0, _index.getDocument)(location.source.id);
    let {
      line,
      column
    } = (0, _index.toEditorPosition)(location);
    let {
      markTextClass,
      lineClass
    } = this.getTextClasses(why);
    doc.addLineClass(line, "wrap", lineClass);
    const lineText = doc.getLine(line);
    column = Math.max(column, (0, _indentation.getIndentation)(lineText)); // If component updates because user clicks on
    // another source tab, codeMirror will be null.

    const columnEnd = doc.cm ? (0, _index.getTokenEnd)(doc.cm, line, column) : null;

    if (columnEnd === null) {
      markTextClass += " to-line-end";
    }

    this.debugExpression = doc.markText({
      ch: column,
      line
    }, {
      ch: columnEnd,
      line
    }, {
      className: markTextClass
    });
  }

  clearDebugLine(why, location) {
    // Avoid clearing the line if we didn't set a debug line before,
    // or, if the document is no longer available
    if (!location || !(0, _index.hasDocument)(location.source.id)) {
      return;
    }

    if (this.debugExpression) {
      this.debugExpression.clear();
    }

    const {
      line
    } = (0, _index.toEditorPosition)(location);
    const doc = (0, _index.getDocument)(location.source.id);
    const {
      lineClass
    } = this.getTextClasses(why);
    doc.removeLineClass(line, "wrap", lineClass);
  }

  getTextClasses(why) {
    if (why && (0, _index2.isException)(why)) {
      return {
        markTextClass: "debug-expression-error",
        lineClass: "new-debug-line-error"
      };
    }

    return {
      markTextClass: "debug-expression",
      lineClass: "new-debug-line"
    };
  }

  render() {
    return null;
  }

}

exports.DebugLine = DebugLine;

function isDocumentReady(location, sourceTextContent) {
  return location && sourceTextContent && (0, _index.hasDocument)(location.source.id);
}

const mapStateToProps = state => {
  // Avoid unecessary intermediate updates when there is no location
  // or the source text content isn't yet fully loaded
  const frame = (0, _index3.getVisibleSelectedFrame)(state);
  const location = frame?.location;

  if (!location) {
    return {};
  }

  const sourceTextContent = (0, _index3.getSourceTextContent)(state, location);

  if (!_prefs.features.codemirrorNext && !isDocumentReady(location, sourceTextContent)) {
    return {};
  }

  return {
    location,
    why: (0, _index3.getPauseReason)(state, (0, _index3.getCurrentThread)(state))
  };
};

var _default = (0, _reactRedux.connect)(mapStateToProps)(DebugLine);

exports.default = _default;