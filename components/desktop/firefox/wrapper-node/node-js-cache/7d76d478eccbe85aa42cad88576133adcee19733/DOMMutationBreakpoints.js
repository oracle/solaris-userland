"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _devtoolsReps = _interopRequireDefault(require("devtools/client/shared/components/reps/reps.js"));

var _inspectorSharedUtils = require("devtools/client/inspector/shared/utils");

var _frameworkActions = require("devtools/client/framework/actions/index");

var _actions = _interopRequireDefault(require("../../actions/index"));

loader.lazyRequireGetter(this, "_connect", "devtools/client/debugger/src/utils/connect");
loader.lazyRequireGetter(this, "_Button", "devtools/client/debugger/src/components/shared/Button/index");

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
const localizationTerms = {
  subtree: L10N.getStr("domMutationTypes.subtree"),
  attribute: L10N.getStr("domMutationTypes.attribute"),
  removal: L10N.getStr("domMutationTypes.removal")
};

class DOMMutationBreakpointsContents extends _react.Component {
  handleBreakpoint(breakpointId, shouldEnable) {
    const {
      toggleBreakpoint,
      setSkipPausing
    } = this.props; // The user has enabled a mutation breakpoint so we should no
    // longer skip pausing

    if (shouldEnable) {
      setSkipPausing(false);
    }

    toggleBreakpoint(breakpointId, shouldEnable);
  }

  renderItem(breakpoint) {
    const {
      openElementInInspector,
      highlightDomElement,
      unHighlightDomElement,
      deleteBreakpoint
    } = this.props;
    const {
      enabled,
      id: breakpointId,
      nodeFront,
      mutationType
    } = breakpoint;
    return _react.default.createElement("li", {
      key: breakpoint.id
    }, _react.default.createElement("input", {
      type: "checkbox",
      checked: enabled,
      onChange: () => this.handleBreakpoint(breakpointId, !enabled)
    }), _react.default.createElement("div", {
      className: "dom-mutation-info"
    }, _react.default.createElement("div", {
      className: "dom-mutation-label"
    }, Rep({
      object: (0, _inspectorSharedUtils.translateNodeFrontToGrip)(nodeFront),
      mode: MODE.TINY,
      onDOMNodeClick: () => openElementInInspector(nodeFront),
      onInspectIconClick: () => openElementInInspector(nodeFront),
      onDOMNodeMouseOver: () => highlightDomElement(nodeFront),
      onDOMNodeMouseOut: () => unHighlightDomElement()
    })), _react.default.createElement("div", {
      className: "dom-mutation-type"
    }, localizationTerms[mutationType] || mutationType)), _react.default.createElement(_Button.CloseButton, {
      handleClick: () => deleteBreakpoint(nodeFront, mutationType)
    }));
  }
  /* eslint-disable react/no-danger */


  renderEmpty() {
    const {
      openInspector
    } = this.props;
    const text = L10N.getFormatStr("noDomMutationBreakpoints", `<a>${L10N.getStr("inspectorTool")}</a>`);
    return _react.default.createElement("div", {
      className: "dom-mutation-empty"
    }, _react.default.createElement("div", {
      onClick: () => openInspector(),
      dangerouslySetInnerHTML: {
        __html: text
      }
    }));
  }

  render() {
    const {
      breakpoints
    } = this.props;

    if (breakpoints.length === 0) {
      return this.renderEmpty();
    }

    return _react.default.createElement("ul", {
      className: "dom-mutation-list"
    }, breakpoints.map(breakpoint => this.renderItem(breakpoint)));
  }

}

const mapStateToProps = state => ({
  breakpoints: state.domMutationBreakpoints.breakpoints
});

const DOMMutationBreakpointsPanel = (0, _connect.connect)(mapStateToProps, {
  deleteBreakpoint: _frameworkActions.deleteDOMMutationBreakpoint,
  toggleBreakpoint: _frameworkActions.toggleDOMMutationBreakpointState
}, undefined, {
  storeKey: "toolbox-store"
})(DOMMutationBreakpointsContents);

class DomMutationBreakpoints extends _react.Component {
  render() {
    return _react.default.createElement(DOMMutationBreakpointsPanel, {
      openElementInInspector: this.props.openElementInInspector,
      highlightDomElement: this.props.highlightDomElement,
      unHighlightDomElement: this.props.unHighlightDomElement,
      setSkipPausing: this.props.setSkipPausing,
      openInspector: this.props.openInspector
    });
  }

}

var _default = (0, _connect.connect)(undefined, {
  // the debugger-specific action bound to the debugger store
  // since there is no `storeKey`
  openElementInInspector: _actions.default.openElementInInspectorCommand,
  highlightDomElement: _actions.default.highlightDomElement,
  unHighlightDomElement: _actions.default.unHighlightDomElement,
  setSkipPausing: _actions.default.setSkipPausing,
  openInspector: _actions.default.openInspector
})(DomMutationBreakpoints);

exports.default = _default;