"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _devtoolsReps = _interopRequireDefault(require("devtools/client/shared/components/reps/reps.js"));

var _actions = _interopRequireDefault(require("../../actions/index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
const {
  REPS: {
    Rep,
    ElementNode: {
      supportsObject: isElement
    }
  },
  MODE
} = _devtoolsReps.default;

// Renders single variable preview inside a codemirror line widget
class InlinePreview extends _react.PureComponent {
  showInScopes(variable) {// TODO: focus on variable value in the scopes sidepanel
    // we will need more info from parent comp
  }

  render() {
    const {
      value,
      variable,
      openElementInInspector,
      highlightDomElement,
      unHighlightDomElement
    } = this.props;
    const mode = isElement(value) ? MODE.TINY : MODE.SHORT;
    return _react.default.createElement("span", {
      className: "inline-preview-outer",
      onClick: () => this.showInScopes(variable)
    }, _react.default.createElement("span", {
      className: "inline-preview-label"
    }, variable, ":"), _react.default.createElement("span", {
      className: "inline-preview-value"
    }, _react.default.createElement(Rep, {
      object: value,
      mode: mode,
      onDOMNodeClick: grip => openElementInInspector(grip),
      onInspectIconClick: grip => openElementInInspector(grip),
      onDOMNodeMouseOver: grip => highlightDomElement(grip),
      onDOMNodeMouseOut: grip => unHighlightDomElement(grip)
    })));
  }

}

var _default = InlinePreview;
exports.default = _default;