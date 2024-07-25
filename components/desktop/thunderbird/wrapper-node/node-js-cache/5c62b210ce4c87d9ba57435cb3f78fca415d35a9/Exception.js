"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("devtools/client/shared/vendor/react");

var _reactPropTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

loader.lazyRequireGetter(this, "_index", "devtools/client/debugger/src/utils/editor/index");
loader.lazyRequireGetter(this, "_indentation", "devtools/client/debugger/src/utils/indentation");
loader.lazyRequireGetter(this, "_location", "devtools/client/debugger/src/utils/location");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Exception extends _react.PureComponent {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "exceptionLine", void 0);

    _defineProperty(this, "markText", void 0);
  }

  static get propTypes() {
    return {
      exception: _reactPropTypes.default.object.isRequired,
      doc: _reactPropTypes.default.object.isRequired,
      selectedSource: _reactPropTypes.default.string.isRequired
    };
  }

  componentDidMount() {
    this.addEditorExceptionLine();
  }

  componentDidUpdate() {
    this.clearEditorExceptionLine();
    this.addEditorExceptionLine();
  }

  componentWillUnmount() {
    this.clearEditorExceptionLine();
  }

  setEditorExceptionLine(doc, line, column, lineText) {
    doc.addLineClass(line, "wrap", "line-exception");
    column = Math.max(column, (0, _indentation.getIndentation)(lineText));
    const columnEnd = doc.cm ? (0, _index.getTokenEnd)(doc.cm, line, column) : null;
    const markText = doc.markText({
      ch: column,
      line
    }, {
      ch: columnEnd,
      line
    }, {
      className: "mark-text-exception"
    });
    this.exceptionLine = line;
    this.markText = markText;
  }

  addEditorExceptionLine() {
    const {
      exception,
      doc,
      selectedSource
    } = this.props;
    const {
      columnNumber,
      lineNumber
    } = exception;

    if (!(0, _index.hasDocument)(selectedSource.id)) {
      return;
    }

    const location = (0, _location.createLocation)({
      source: selectedSource,
      line: lineNumber,
      // Exceptions are reported with column being 1-based
      // while the frontend uses 0-based column.
      column: columnNumber - 1
    });
    const {
      line,
      column
    } = (0, _index.toEditorPosition)(location);
    const lineText = doc.getLine(line);
    this.setEditorExceptionLine(doc, line, column, lineText);
  }

  clearEditorExceptionLine() {
    if (this.markText) {
      const {
        selectedSource
      } = this.props;
      this.markText.clear();

      if ((0, _index.hasDocument)(selectedSource.id)) {
        this.props.doc.removeLineClass(this.exceptionLine, "wrap", "line-exception");
      }

      this.exceptionLine = null;
      this.markText = null;
    }
  } // This component is only used as a "proxy" to manipulate the editor.


  render() {
    return null;
  }

}

exports.default = Exception;