"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.HighlightCalls = void 0;

var _react = require("devtools/client/shared/vendor/react");

loader.lazyRequireGetter(this, "_connect", "devtools/client/debugger/src/utils/connect");
loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_editor", "devtools/client/debugger/src/utils/editor/index");

var _actions = _interopRequireDefault(require("../../actions/index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class HighlightCalls extends _react.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "previousCalls", null);

    _defineProperty(this, "markCall", call => {
      const {
        editor
      } = this.props;
      const startLine = call.location.start.line - 1;
      const endLine = call.location.end.line - 1;
      const startColumn = call.location.start.column;
      const endColumn = call.location.end.column;
      const markedCall = editor.codeMirror.markText({
        line: startLine,
        ch: startColumn
      }, {
        line: endLine,
        ch: endColumn
      }, {
        className: "highlight-function-calls"
      });
      return markedCall;
    });

    _defineProperty(this, "onClick", e => {
      const {
        editor,
        selectedSource,
        cx,
        continueToHere
      } = this.props;

      if (selectedSource) {
        const location = (0, _editor.getSourceLocationFromMouseEvent)(editor, selectedSource, e);
        continueToHere(cx, location);
        editor.codeMirror.execCommand("singleSelection");
        editor.codeMirror.execCommand("goGroupLeft");
      }
    });
  }

  componentDidUpdate() {
    this.unhighlightFunctionCalls();
    this.highlightFunctioCalls();
  }

  highlightFunctioCalls() {
    const {
      highlightedCalls
    } = this.props;

    if (!highlightedCalls) {
      return;
    }

    let markedCalls = [];
    markedCalls = highlightedCalls.map(this.markCall);
    const allMarkedElements = document.getElementsByClassName("highlight-function-calls");

    for (let i = 0; i < allMarkedElements.length; i++) {
      allMarkedElements[i].addEventListener("click", this.onClick);
    }

    this.previousCalls = markedCalls;
  }

  unhighlightFunctionCalls() {
    if (!this.previousCalls) {
      return;
    }

    this.previousCalls.forEach(call => call.clear());
    this.previousCalls = null;
  }

  render() {
    return null;
  }

}

exports.HighlightCalls = HighlightCalls;

const mapStateToProps = state => {
  const thread = (0, _selectors.getCurrentThread)(state);
  return {
    highlightedCalls: (0, _selectors.getHighlightedCalls)(state, thread),
    cx: (0, _selectors.getThreadContext)(state)
  };
};

const {
  continueToHere
} = _actions.default;
const mapDispatchToProps = {
  continueToHere
};

var _default = (0, _connect.connect)(mapStateToProps, mapDispatchToProps)(HighlightCalls);

exports.default = _default;