"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("devtools/client/shared/vendor/react");

var _lodash = require("devtools/client/shared/vendor/lodash");

loader.lazyRequireGetter(this, "_connect", "devtools/client/debugger/src/utils/connect");
loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class HighlightLines extends _react.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "highlightLineRange", () => {
      const {
        highlightedLineRange,
        editor
      } = this.props;
      const {
        codeMirror
      } = editor;

      if ((0, _lodash.isEmpty)(highlightedLineRange) || !codeMirror) {
        return;
      }

      const {
        start,
        end
      } = highlightedLineRange;
      codeMirror.operation(() => {
        editor.alignLine(start);
        (0, _lodash.range)(start - 1, end).forEach(line => {
          codeMirror.addLineClass(line, "wrapClass", "highlight-lines");
        });
      });
    });
  }

  componentDidMount() {
    this.highlightLineRange();
  }

  componentWillUpdate() {
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
      highlightedLineRange,
      editor
    } = this.props;
    const {
      codeMirror
    } = editor;

    if ((0, _lodash.isEmpty)(highlightedLineRange) || !codeMirror) {
      return;
    }

    const {
      start,
      end
    } = highlightedLineRange;
    codeMirror.operation(() => {
      (0, _lodash.range)(start - 1, end).forEach(line => {
        codeMirror.removeLineClass(line, "wrapClass", "highlight-lines");
      });
    });
  }

  render() {
    return null;
  }

}

var _default = (0, _connect.connect)(state => ({
  highlightedLineRange: (0, _selectors.getHighlightedLineRange)(state)
}))(HighlightLines);

exports.default = _default;