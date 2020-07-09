"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

loader.lazyRequireGetter(this, "_connect", "devtools/client/debugger/src/utils/connect");

var _AccessibleImage = _interopRequireDefault(require("../shared/AccessibleImage"));

var _actions = _interopRequireDefault(require("../../actions/index"));

var _devtoolsReps = _interopRequireDefault(require("devtools/client/shared/components/reps/reps.js"));

loader.lazyRequireGetter(this, "_pause", "devtools/client/debugger/src/utils/pause/index");
loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
const {
  REPS: {
    Rep
  },
  MODE
} = _devtoolsReps.default;

class WhyPaused extends _react.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hideWhyPaused: ""
    };
  }

  componentDidUpdate() {
    const {
      delay
    } = this.props;

    if (delay) {
      setTimeout(() => {
        this.setState({
          hideWhyPaused: ""
        });
      }, delay);
    } else {
      this.setState({
        hideWhyPaused: "pane why-paused"
      });
    }
  }

  renderExceptionSummary(exception) {
    if (typeof exception === "string") {
      return exception;
    }

    const {
      preview
    } = exception;

    if (!preview || !preview.name || !preview.message) {
      return;
    }

    return `${preview.name}: ${preview.message}`;
  }

  renderMessage(why) {
    const {
      type,
      exception,
      message
    } = why;

    if (type == "exception" && exception) {
      // Our types for 'Why' are too general because 'type' can be 'string'.
      // $FlowFixMe - We should have a proper discriminating union of reasons.
      const summary = this.renderExceptionSummary(exception);
      return _react.default.createElement("div", {
        className: "message warning"
      }, summary);
    }

    if (type === "mutationBreakpoint" && why.nodeGrip) {
      const {
        nodeGrip,
        ancestorGrip,
        action
      } = why;
      const {
        openElementInInspector,
        highlightDomElement,
        unHighlightDomElement
      } = this.props;
      const targetRep = Rep({
        object: nodeGrip,
        mode: MODE.TINY,
        onDOMNodeClick: () => openElementInInspector(nodeGrip),
        onInspectIconClick: () => openElementInInspector(nodeGrip),
        onDOMNodeMouseOver: () => highlightDomElement(nodeGrip),
        onDOMNodeMouseOut: () => unHighlightDomElement()
      });
      const ancestorRep = ancestorGrip ? Rep({
        object: ancestorGrip,
        mode: MODE.TINY,
        onDOMNodeClick: () => openElementInInspector(ancestorGrip),
        onInspectIconClick: () => openElementInInspector(ancestorGrip),
        onDOMNodeMouseOver: () => highlightDomElement(ancestorGrip),
        onDOMNodeMouseOut: () => unHighlightDomElement()
      }) : null;
      return _react.default.createElement("div", null, _react.default.createElement("div", {
        className: "message"
      }, why.message), _react.default.createElement("div", {
        className: "mutationNode"
      }, ancestorRep, ancestorGrip ? _react.default.createElement("span", {
        className: "why-paused-ancestor"
      }, action === "remove" ? L10N.getStr("whyPaused.mutationBreakpointRemoved") : L10N.getStr("whyPaused.mutationBreakpointAdded"), targetRep) : targetRep));
    }

    if (typeof message == "string") {
      return _react.default.createElement("div", {
        className: "message"
      }, message);
    }

    return null;
  }

  render() {
    const {
      endPanelCollapsed,
      why
    } = this.props;
    const reason = (0, _pause.getPauseReason)(why);

    if (!why || !reason || endPanelCollapsed) {
      return _react.default.createElement("div", {
        className: this.state.hideWhyPaused
      });
    }

    return _react.default.createElement("div", {
      className: "pane why-paused"
    }, _react.default.createElement("div", null, _react.default.createElement("div", {
      className: "pause reason"
    }, L10N.getStr(reason), this.renderMessage(why)), _react.default.createElement("div", {
      className: "info icon"
    }, _react.default.createElement(_AccessibleImage.default, {
      className: "info"
    }))));
  }

}

const mapStateToProps = state => ({
  endPanelCollapsed: (0, _selectors.getPaneCollapse)(state, "end"),
  why: (0, _selectors.getPauseReason)(state, (0, _selectors.getCurrentThread)(state))
});

var _default = (0, _connect.connect)(mapStateToProps, {
  openElementInInspector: _actions.default.openElementInInspectorCommand,
  highlightDomElement: _actions.default.highlightDomElement,
  unHighlightDomElement: _actions.default.unHighlightDomElement
})(WhyPaused);

exports.default = _default;