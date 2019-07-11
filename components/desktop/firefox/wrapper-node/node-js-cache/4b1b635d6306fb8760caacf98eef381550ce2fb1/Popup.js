"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Popup = undefined;

var _react = require("devtools/client/shared/vendor/react");

var _react2 = _interopRequireDefault(_react);

var _connect = require("../../../utils/connect");

var _devtoolsEnvironment = require("devtools/client/debugger/dist/vendors").vendored["devtools-environment"];

var _devtoolsReps = require("devtools/client/shared/components/reps/reps.js");

var _devtoolsReps2 = _interopRequireDefault(_devtoolsReps);

var _actions = require("../../../actions/index");

var _actions2 = _interopRequireDefault(_actions);

var _selectors = require("../../../selectors/index");

var _Popover = require("../../shared/Popover");

var _Popover2 = _interopRequireDefault(_Popover);

var _PreviewFunction = require("../../shared/PreviewFunction");

var _PreviewFunction2 = _interopRequireDefault(_PreviewFunction);

var _firefox = require("../../../client/firefox");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

const {
  REPS: { Rep },
  MODE,
  objectInspector
} = _devtoolsReps2.default;

const { ObjectInspector, utils } = objectInspector;

const {
  node: { nodeIsPrimitive, nodeIsFunction, nodeIsObject }
} = utils;

class Popup extends _react.Component {

  constructor(props) {
    super(props);

    this.onInterval = () => {
      const { preview, clearPreview, cx } = this.props;

      // Don't clear the current preview if mouse is hovered on
      // the current preview's element (target) or the popup element
      // Note, we disregard while testing because it is impossible to hover
      const currentTarget = preview.target;
      if ((0, _devtoolsEnvironment.isTesting)() || currentTarget.matches(":hover") || this.popup && this.popup.matches(":hover")) {
        return;
      }

      // Clear the interval and the preview if it is not hovered
      // on the current preview's element or the popup element
      clearInterval(this.timerId);
      return clearPreview(cx);
    };

    this.calculateMaxHeight = () => {
      const { editorRef } = this.props;
      if (!editorRef) {
        return "auto";
      }
      return editorRef.getBoundingClientRect().height - this.state.top;
    };

    this.onPopoverCoords = coords => {
      this.setState({ top: coords.top });
    };

    this.state = {
      top: 0
    };
  }

  componentDidMount() {
    this.startTimer();
  }

  componentWillUnmount() {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }

  startTimer() {
    this.timerId = setInterval(this.onInterval, 300);
  }

  renderFunctionPreview() {
    const {
      cx,
      selectSourceURL,
      preview: { result }
    } = this.props;

    return _react2.default.createElement(
      "div",
      {
        className: "preview-popup",
        ref: a => this.popup = a,
        onClick: () => selectSourceURL(cx, result.location.url, {
          line: result.location.line
        })
      },
      _react2.default.createElement(_PreviewFunction2.default, { func: result })
    );
  }

  renderObjectPreview() {
    const {
      preview: { properties },
      openLink,
      openElementInInspector,
      highlightDomElement,
      unHighlightDomElement
    } = this.props;

    return _react2.default.createElement(
      "div",
      {
        className: "preview-popup",
        style: { maxHeight: this.calculateMaxHeight() },
        ref: a => this.popup = a
      },
      _react2.default.createElement(ObjectInspector, {
        roots: properties,
        autoExpandDepth: 0,
        disableWrap: true,
        focusable: false,
        openLink: openLink,
        createObjectClient: grip => (0, _firefox.createObjectClient)(grip),
        onDOMNodeClick: grip => openElementInInspector(grip),
        onInspectIconClick: grip => openElementInInspector(grip),
        onDOMNodeMouseOver: grip => highlightDomElement(grip),
        onDOMNodeMouseOut: grip => unHighlightDomElement(grip)
      })
    );
  }

  renderSimplePreview() {
    const {
      openLink,
      preview: { result }
    } = this.props;
    return _react2.default.createElement(
      "div",
      { className: "preview-popup", ref: a => this.popup = a },
      Rep({
        object: result,
        mode: MODE.LONG,
        openLink
      })
    );
  }

  renderPreview() {
    // We don't have to check and
    // return on `false`, `""`, `0`, `undefined` etc,
    // these falsy simple typed value because we want to
    // do `renderSimplePreview` on these values below.
    const {
      preview: { root }
    } = this.props;

    if (nodeIsFunction(root)) {
      return this.renderFunctionPreview();
    }

    if (nodeIsObject(root)) {
      return _react2.default.createElement(
        "div",
        null,
        this.renderObjectPreview()
      );
    }

    return this.renderSimplePreview();
  }

  getPreviewType() {
    const {
      preview: { root }
    } = this.props;
    if (nodeIsPrimitive(root) || nodeIsFunction(root)) {
      return "tooltip";
    }

    return "popover";
  }

  render() {
    const {
      preview: { cursorPos, result },
      editorRef
    } = this.props;
    const type = this.getPreviewType();

    if (typeof result == "undefined" || result.optimizedOut) {
      return null;
    }

    return _react2.default.createElement(
      _Popover2.default,
      {
        targetPosition: cursorPos,
        type: type,
        onPopoverCoords: this.onPopoverCoords,
        editorRef: editorRef
      },
      this.renderPreview()
    );
  }
}

exports.Popup = Popup;
const mapStateToProps = state => ({
  cx: (0, _selectors.getThreadContext)(state),
  preview: (0, _selectors.getPreview)(state)
});

const {
  addExpression,
  selectSourceURL,
  openLink,
  openElementInInspectorCommand,
  highlightDomElement,
  unHighlightDomElement,
  clearPreview
} = _actions2.default;

const mapDispatchToProps = {
  addExpression,
  selectSourceURL,
  openLink,
  openElementInInspector: openElementInInspectorCommand,
  highlightDomElement,
  unHighlightDomElement,
  clearPreview
};

exports.default = (0, _connect.connect)(mapStateToProps, mapDispatchToProps)(Popup);