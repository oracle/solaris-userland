"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("devtools/client/shared/vendor/react");

var _reactPropTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

loader.lazyRequireGetter(this, "_index", "devtools/client/debugger/src/utils/editor/index");
loader.lazyRequireGetter(this, "_prefs", "devtools/client/debugger/src/utils/prefs");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class HighlightLines extends _react.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "highlightLineRange", () => {
      const {
        range,
        editor
      } = this.props;

      if (!range) {
        return;
      }

      if (_prefs.features.codemirrorNext) {
        if (editor) {
          editor.scrollTo(range.start, 0);
          editor.setLineContentMarker({
            id: "multi-highlight-line-marker",
            lineClassName: "highlight-lines",

            condition(line) {
              const lineNumber = (0, _index.fromEditorLine)(null, line);
              return lineNumber >= range.start && lineNumber <= range.end;
            }

          });
        }

        return;
      }

      const {
        codeMirror
      } = editor;

      if (!codeMirror) {
        return;
      }

      const {
        start,
        end
      } = range;
      codeMirror.operation(() => {
        editor.alignLine(start);

        for (let line = start - 1; line < end; line++) {
          codeMirror.addLineClass(line, "wrap", "highlight-lines");
        }
      });
    });
  }

  static get propTypes() {
    return {
      editor: _reactPropTypes.default.object.isRequired,
      range: _reactPropTypes.default.object.isRequired
    };
  }

  componentDidMount() {
    this.highlightLineRange();
  } // FIXME: https://bugzilla.mozilla.org/show_bug.cgi?id=1774507


  UNSAFE_componentWillUpdate() {
    this.clearHighlightRange();
  }

  componentDidUpdate() {
    this.highlightLineRange();
  }

  componentWillUnmount() {
    this.clearHighlightRange();
  }

  clearHighlightRange() {
    const {
      range,
      editor
    } = this.props;

    if (!range) {
      return;
    }

    if (_prefs.features.codemirrorNext) {
      if (editor) {
        editor.removeLineContentMarker("multi-highlight-line-marker");
      }

      return;
    }

    const {
      codeMirror
    } = editor;

    if (!codeMirror) {
      return;
    }

    const {
      start,
      end
    } = range;
    codeMirror.operation(() => {
      for (let line = start - 1; line < end; line++) {
        codeMirror.removeLineClass(line, "wrap", "highlight-lines");
      }
    });
  }

  render() {
    return null;
  }

}

var _default = HighlightLines;
exports.default = _default;