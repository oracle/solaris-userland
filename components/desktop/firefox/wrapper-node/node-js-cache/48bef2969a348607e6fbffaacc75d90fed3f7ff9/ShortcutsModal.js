"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ShortcutsModal = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _Modal = _interopRequireDefault(require("./shared/Modal"));

var _classnames = _interopRequireDefault(require("devtools/client/debugger/dist/vendors").vendored["classnames"]);

loader.lazyRequireGetter(this, "_text", "devtools/client/debugger/src/utils/text");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
class ShortcutsModal extends _react.Component {
  renderPrettyCombos(combo) {
    return combo.split(" ").map(c => _react.default.createElement("span", {
      key: c,
      className: "keystroke"
    }, c)).reduce((prev, curr) => [prev, " + ", curr]);
  }

  renderShorcutItem(title, combo) {
    return _react.default.createElement("li", null, _react.default.createElement("span", null, title), _react.default.createElement("span", null, this.renderPrettyCombos(combo)));
  }

  renderEditorShortcuts() {
    return _react.default.createElement("ul", {
      className: "shortcuts-list"
    }, this.renderShorcutItem(L10N.getStr("shortcuts.toggleBreakpoint"), (0, _text.formatKeyShortcut)(L10N.getStr("toggleBreakpoint.key"))), this.renderShorcutItem(L10N.getStr("shortcuts.toggleCondPanel.breakpoint"), (0, _text.formatKeyShortcut)(L10N.getStr("toggleCondPanel.breakpoint.key"))), this.renderShorcutItem(L10N.getStr("shortcuts.toggleCondPanel.logPoint"), (0, _text.formatKeyShortcut)(L10N.getStr("toggleCondPanel.logPoint.key"))));
  }

  renderSteppingShortcuts() {
    return _react.default.createElement("ul", {
      className: "shortcuts-list"
    }, this.renderShorcutItem(L10N.getStr("shortcuts.pauseOrResume"), "F8"), this.renderShorcutItem(L10N.getStr("shortcuts.stepOver"), "F10"), this.renderShorcutItem(L10N.getStr("shortcuts.stepIn"), "F11"), this.renderShorcutItem(L10N.getStr("shortcuts.stepOut"), (0, _text.formatKeyShortcut)(L10N.getStr("stepOut.key"))));
  }

  renderSearchShortcuts() {
    return _react.default.createElement("ul", {
      className: "shortcuts-list"
    }, this.renderShorcutItem(L10N.getStr("shortcuts.fileSearch2"), (0, _text.formatKeyShortcut)(L10N.getStr("sources.search.key2"))), this.renderShorcutItem(L10N.getStr("shortcuts.searchAgain2"), (0, _text.formatKeyShortcut)(L10N.getStr("sourceSearch.search.again.key3"))), this.renderShorcutItem(L10N.getStr("shortcuts.projectSearch2"), (0, _text.formatKeyShortcut)(L10N.getStr("projectTextSearch.key"))), this.renderShorcutItem(L10N.getStr("shortcuts.functionSearch2"), (0, _text.formatKeyShortcut)(L10N.getStr("functionSearch.key"))), this.renderShorcutItem(L10N.getStr("shortcuts.gotoLine"), (0, _text.formatKeyShortcut)(L10N.getStr("gotoLineModal.key3"))));
  }

  renderShortcutsContent() {
    return _react.default.createElement("div", {
      className: (0, _classnames.default)("shortcuts-content", this.props.additionalClass)
    }, _react.default.createElement("div", {
      className: "shortcuts-section"
    }, _react.default.createElement("h2", null, L10N.getStr("shortcuts.header.editor")), this.renderEditorShortcuts()), _react.default.createElement("div", {
      className: "shortcuts-section"
    }, _react.default.createElement("h2", null, L10N.getStr("shortcuts.header.stepping")), this.renderSteppingShortcuts()), _react.default.createElement("div", {
      className: "shortcuts-section"
    }, _react.default.createElement("h2", null, L10N.getStr("shortcuts.header.search")), this.renderSearchShortcuts()));
  }

  render() {
    const {
      enabled
    } = this.props;

    if (!enabled) {
      return null;
    }

    return _react.default.createElement(_Modal.default, {
      in: enabled,
      additionalClass: "shortcuts-modal",
      handleClose: this.props.handleClose
    }, this.renderShortcutsContent());
  }

}

exports.ShortcutsModal = ShortcutsModal;