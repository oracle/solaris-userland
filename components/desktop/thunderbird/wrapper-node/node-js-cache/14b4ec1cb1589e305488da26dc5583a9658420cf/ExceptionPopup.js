"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

loader.lazyRequireGetter(this, "_connect", "devtools/client/debugger/src/utils/connect");

var _classnames = _interopRequireDefault(require("devtools/client/debugger/dist/vendors").vendored["classnames"]);

var _index = _interopRequireDefault(require("devtools/client/shared/components/reps/index"));

var _actions = _interopRequireDefault(require("../../../actions/index"));

loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");

var _AccessibleImage = _interopRequireDefault(require("../../shared/AccessibleImage"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const {
  REPS: {
    StringRep
  }
} = _index.default;

const DevToolsUtils = require("devtools/shared/DevToolsUtils");

const POPUP_SELECTOR = ".preview-popup.exception-popup";
const ANONYMOUS_FN_NAME = "<anonymous>"; // The exception popup works in two modes:
// a. when the stacktrace is closed the exception popup
// gets closed when the mouse leaves the popup.
// b. when the stacktrace is opened the exception popup
// gets closed only by clicking outside the popup.

class ExceptionPopup extends _react.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "onTopWindowClick", e => {
      const {
        cx,
        clearPreview
      } = this.props; // When the stactrace is expaned the exception popup gets closed
      // only by clicking ouside the popup.

      if (!e.target.closest(POPUP_SELECTOR)) {
        clearPreview(cx);
      }
    });

    this.state = {
      isStacktraceExpanded: false
    };
  }

  updateTopWindow() {
    // The ChromeWindow is used when the stacktrace is expanded to capture all clicks
    // outside the popup so the popup can be closed only by clicking outside of it.
    if (this.topWindow) {
      this.topWindow.removeEventListener("mousedown", this.onTopWindowClick, true);
      this.topWindow = null;
    }

    this.topWindow = DevToolsUtils.getTopWindow(window.parent);
    this.topWindow.addEventListener("mousedown", this.onTopWindowClick, true);
  }

  onExceptionMessageClick() {
    const isStacktraceExpanded = this.state.isStacktraceExpanded;
    this.updateTopWindow();
    this.setState({
      isStacktraceExpanded: !isStacktraceExpanded
    });
  }

  buildStackFrame(frame) {
    const {
      cx,
      selectSourceURL
    } = this.props;
    const {
      filename,
      lineNumber
    } = frame;
    const functionName = frame.functionName || ANONYMOUS_FN_NAME;
    return _react.default.createElement("div", {
      className: "frame",
      onClick: () => selectSourceURL(cx, filename, {
        line: lineNumber
      })
    }, _react.default.createElement("span", {
      className: "title"
    }, functionName), _react.default.createElement("span", {
      className: "location"
    }, _react.default.createElement("span", {
      className: "filename"
    }, filename), ":", _react.default.createElement("span", {
      className: "line"
    }, lineNumber)));
  }

  renderStacktrace(stacktrace) {
    const isStacktraceExpanded = this.state.isStacktraceExpanded;

    if (stacktrace.length && isStacktraceExpanded) {
      return _react.default.createElement("div", {
        className: "exception-stacktrace"
      }, stacktrace.map(frame => this.buildStackFrame(frame)));
    }

    return null;
  }

  renderArrowIcon(stacktrace) {
    if (stacktrace.length) {
      return _react.default.createElement(_AccessibleImage.default, {
        className: (0, _classnames.default)("arrow", {
          expanded: this.state.isStacktraceExpanded
        })
      });
    }

    return null;
  }

  render() {
    const {
      exception: {
        stacktrace,
        errorMessage
      },
      mouseout
    } = this.props;
    return _react.default.createElement("div", {
      className: "preview-popup exception-popup",
      dir: "ltr",
      onMouseLeave: () => mouseout(true, this.state.isStacktraceExpanded)
    }, _react.default.createElement("div", {
      className: "exception-message",
      onClick: () => this.onExceptionMessageClick()
    }, this.renderArrowIcon(stacktrace), StringRep.rep({
      object: errorMessage,
      useQuotes: false,
      className: "exception-text"
    })), this.renderStacktrace(stacktrace));
  }

}

const mapStateToProps = state => ({
  cx: (0, _selectors.getThreadContext)(state)
});

const mapDispatchToProps = {
  selectSourceURL: _actions.default.selectSourceURL,
  clearPreview: _actions.default.clearPreview
};

var _default = (0, _connect.connect)(mapStateToProps, mapDispatchToProps)(ExceptionPopup);

exports.default = _default;