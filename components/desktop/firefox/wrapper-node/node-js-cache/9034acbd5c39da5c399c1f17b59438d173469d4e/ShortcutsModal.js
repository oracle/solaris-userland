"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ShortcutsModal = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _reactDomFactories = require("devtools/client/shared/vendor/react-dom-factories");

var _reactPropTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

var _Modal = _interopRequireDefault(require("./shared/Modal"));

loader.lazyRequireGetter(this, "_text", "devtools/client/debugger/src/utils/text");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
const classnames = require("resource://devtools/client/shared/classnames.js");

const isMacOS = Services.appinfo.OS === "Darwin";

class ShortcutsModal extends _react.Component {
  static get propTypes() {
    return {
      enabled: _reactPropTypes.default.bool.isRequired,
      handleClose: _reactPropTypes.default.func.isRequired
    };
  }

  renderPrettyCombos(combo) {
    return combo.split(" ").map(c => (0, _reactDomFactories.span)({
      key: c,
      className: "keystroke"
    }, c)).reduce((prev, curr) => [prev, " + ", curr]);
  }

  renderShorcutItem(title, combo) {
    return (0, _reactDomFactories.li)(null, (0, _reactDomFactories.span)(null, title), (0, _reactDomFactories.span)(null, this.renderPrettyCombos(combo)));
  }

  renderEditorShortcuts() {
    return (0, _reactDomFactories.ul)({
      className: "shortcuts-list"
    }, this.renderShorcutItem(L10N.getStr("shortcuts.toggleBreakpoint"), (0, _text.formatKeyShortcut)(L10N.getStr("toggleBreakpoint.key"))), this.renderShorcutItem(L10N.getStr("shortcuts.toggleCondPanel.breakpoint"), (0, _text.formatKeyShortcut)(L10N.getStr("toggleCondPanel.breakpoint.key"))), this.renderShorcutItem(L10N.getStr("shortcuts.toggleCondPanel.logPoint"), (0, _text.formatKeyShortcut)(L10N.getStr("toggleCondPanel.logPoint.key"))));
  }

  renderSteppingShortcuts() {
    return (0, _reactDomFactories.ul)({
      className: "shortcuts-list"
    }, this.renderShorcutItem(L10N.getStr("shortcuts.pauseOrResume"), "F8"), this.renderShorcutItem(L10N.getStr("shortcuts.stepOver"), "F10"), this.renderShorcutItem(L10N.getStr("shortcuts.stepIn"), "F11"), this.renderShorcutItem(L10N.getStr("shortcuts.stepOut"), (0, _text.formatKeyShortcut)(L10N.getStr("stepOut.key"))));
  }

  renderSearchShortcuts() {
    return (0, _reactDomFactories.ul)({
      className: "shortcuts-list"
    }, this.renderShorcutItem(L10N.getStr("shortcuts.fileSearch2"), (0, _text.formatKeyShortcut)(L10N.getStr("sources.search.key2"))), this.renderShorcutItem(L10N.getStr("shortcuts.projectSearch2"), (0, _text.formatKeyShortcut)(L10N.getStr("projectTextSearch.key"))), this.renderShorcutItem(L10N.getStr("shortcuts.functionSearch2"), (0, _text.formatKeyShortcut)(L10N.getStr("functionSearch.key"))), this.renderShorcutItem(L10N.getStr("shortcuts.gotoLine"), (0, _text.formatKeyShortcut)(L10N.getStr("gotoLineModal.key3"))));
  }

  renderShortcutsContent() {
    return (0, _reactDomFactories.div)({
      className: classnames("shortcuts-content", isMacOS ? "mac" : "")
    }, (0, _reactDomFactories.div)({
      className: "shortcuts-section"
    }, (0, _reactDomFactories.h2)(null, L10N.getStr("shortcuts.header.editor")), this.renderEditorShortcuts()), (0, _reactDomFactories.div)({
      className: "shortcuts-section"
    }, (0, _reactDomFactories.h2)(null, L10N.getStr("shortcuts.header.stepping")), this.renderSteppingShortcuts()), (0, _reactDomFactories.div)({
      className: "shortcuts-section"
    }, (0, _reactDomFactories.h2)(null, L10N.getStr("shortcuts.header.search")), this.renderSearchShortcuts()));
  }

  render() {
    const {
      enabled
    } = this.props;

    if (!enabled) {
      return null;
    }

    return _react.default.createElement(_Modal.default, {
      additionalClass: "shortcuts-modal",
      handleClose: this.props.handleClose
    }, this.renderShortcutsContent());
  }

}

exports.ShortcutsModal = ShortcutsModal;