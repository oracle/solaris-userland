"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createEditor = createEditor;
exports.createHeadlessEditor = createHeadlessEditor;

var _editor = _interopRequireDefault(require("devtools/client/shared/sourceeditor/editor"));

loader.lazyRequireGetter(this, "_prefs", "devtools/client/debugger/src/utils/prefs");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

/**
 * Create a SourceEditor
 *
 * @param {Object} config: SourceEditor config object
 * @returns
 */
function createEditor(config = {
  cm6: false
}) {
  const gutters = ["breakpoints", "hit-markers", "CodeMirror-linenumbers"];

  if (_prefs.features.codeFolding) {
    gutters.push("CodeMirror-foldgutter");
  }

  return new _editor.default({
    mode: _editor.default.modes.js,
    foldGutter: _prefs.features.codeFolding,
    enableCodeFolding: _prefs.features.codeFolding,
    readOnly: true,
    lineNumbers: true,
    theme: "mozilla",
    styleActiveLine: false,
    lineWrapping: _prefs.prefs.editorWrapping,
    matchBrackets: true,
    showAnnotationRuler: true,
    gutters,
    value: " ",
    extraKeys: {
      // Override code mirror keymap to avoid conflicts with split console and tabbing to other elements.
      Esc: false,
      Tab: false,
      "Shift-Tab": false,
      "Cmd-F": false,
      "Ctrl-F": false,
      "Cmd-G": false,
      "Ctrl-G": false
    },
    cursorBlinkRate: _prefs.prefs.cursorBlinkRate,
    ...config
  });
}
/**
 * Create an headless editor (can be used for syntax highlighting for example)
 *
 * @returns {CodeMirror}
 */


function createHeadlessEditor() {
  const editor = createEditor({
    cm6: true
  });
  editor.appendToLocalElement(document.createElement("div"));
  return editor;
}