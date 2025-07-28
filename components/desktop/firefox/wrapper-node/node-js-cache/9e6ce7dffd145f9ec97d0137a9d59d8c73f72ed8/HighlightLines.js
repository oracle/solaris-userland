"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("devtools/client/shared/vendor/react");

var _reactPropTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

loader.lazyRequireGetter(this, "_constants", "devtools/client/debugger/src/constants");

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

      if (!range || !editor) {
        return;
      }

      editor.scrollTo(range.start, 0);
      const lines = [];

      for (let line = range.start; line <= range.end; line++) {
        lines.push({
          line
        });
      }

      editor.setLineContentMarker({
        id: _constants.markerTypes.MULTI_HIGHLIGHT_LINE_MARKER,
        lineClassName: "highlight-lines",
        lines
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

    if (!range || !editor) {
      return;
    }

    editor.removeLineContentMarker("multi-highlight-line-marker");
  }

  render() {
    return null;
  }

}

var _default = HighlightLines;
exports.default = _default;