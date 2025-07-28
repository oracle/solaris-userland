"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _reactDomFactories = require("devtools/client/shared/vendor/react-dom-factories");

var _reactPropTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

var _reactRedux = require("devtools/client/shared/vendor/react-redux");

var _index = _interopRequireDefault(require("../../../actions/index"));

var _AccessibleImage = _interopRequireDefault(require("../../shared/AccessibleImage"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
const Reps = ChromeUtils.importESModule("resource://devtools/client/shared/components/reps/index.mjs");
const {
  REPS: {
    StringRep
  }
} = Reps;

const classnames = require("resource://devtools/client/shared/classnames.js");

const ANONYMOUS_FN_NAME = "<anonymous>"; // The exception popup works in two modes:
// a. when the stacktrace is closed the exception popup
// gets closed when the mouse leaves the popup.
// b. when the stacktrace is opened the exception popup
// gets closed only by clicking outside the popup.

class ExceptionPopup extends _react.Component {
  constructor(props) {
    super(props);
    this.state = {
      isStacktraceExpanded: true
    };
  }

  static get propTypes() {
    return {
      mouseout: _reactPropTypes.default.func.isRequired,
      selectSourceURL: _reactPropTypes.default.func.isRequired,
      exception: _reactPropTypes.default.object.isRequired
    };
  }

  onExceptionMessageClick() {
    const isStacktraceExpanded = this.state.isStacktraceExpanded;
    this.setState({
      isStacktraceExpanded: !isStacktraceExpanded
    });
  }

  buildStackFrame(frame) {
    const {
      filename,
      lineNumber
    } = frame;
    const functionName = frame.functionName || ANONYMOUS_FN_NAME;
    return (0, _reactDomFactories.div)({
      className: "frame",
      onClick: () => this.props.selectSourceURL(filename, {
        line: lineNumber
      })
    }, (0, _reactDomFactories.span)({
      className: "title"
    }, functionName), (0, _reactDomFactories.span)({
      className: "location"
    }, (0, _reactDomFactories.span)({
      className: "filename"
    }, filename), ":", (0, _reactDomFactories.span)({
      className: "line"
    }, lineNumber)));
  }

  renderStacktrace(stacktrace) {
    const isStacktraceExpanded = this.state.isStacktraceExpanded;

    if (stacktrace.length && isStacktraceExpanded) {
      return (0, _reactDomFactories.div)({
        className: "exception-stacktrace"
      }, stacktrace.map(frame => this.buildStackFrame(frame)));
    }

    return null;
  }

  renderArrowIcon(stacktrace) {
    if (stacktrace.length) {
      return _react.default.createElement(_AccessibleImage.default, {
        className: classnames("arrow", {
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
    return (0, _reactDomFactories.div)({
      className: "preview-popup exception-popup",
      dir: "ltr",
      onMouseLeave: () => mouseout(true, this.state.isStacktraceExpanded)
    }, (0, _reactDomFactories.div)({
      className: "exception-message",
      onClick: () => this.onExceptionMessageClick()
    }, this.renderArrowIcon(stacktrace), StringRep.rep({
      object: errorMessage,
      useQuotes: false,
      className: "exception-text"
    })), this.renderStacktrace(stacktrace));
  }

}

const mapDispatchToProps = {
  selectSourceURL: _index.default.selectSourceURL
};

var _default = (0, _reactRedux.connect)(null, mapDispatchToProps)(ExceptionPopup);

exports.default = _default;