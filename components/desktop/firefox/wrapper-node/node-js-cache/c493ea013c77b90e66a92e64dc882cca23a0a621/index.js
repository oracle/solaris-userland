"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  getEditor: true,
  removeEditor: true,
  updateEditorLineWrapping: true,
  toWasmSourceLine: true,
  toEditorLine: true,
  fromEditorLine: true,
  toEditorPosition: true,
  toSourceLine: true
};
exports.getEditor = getEditor;
exports.removeEditor = removeEditor;
exports.updateEditorLineWrapping = updateEditorLineWrapping;
exports.toWasmSourceLine = toWasmSourceLine;
exports.toEditorLine = toEditorLine;
exports.fromEditorLine = fromEditorLine;
exports.toEditorPosition = toEditorPosition;
exports.toSourceLine = toSourceLine;
loader.lazyRequireGetter(this, "_sourceSearch", "devtools/client/debugger/src/utils/editor/source-search");
Object.keys(_sourceSearch).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _sourceSearch[key];
    }
  });
});
loader.lazyRequireGetter(this, "_ui", "devtools/client/debugger/src/utils/ui");
Object.keys(_ui).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _ui[key];
    }
  });
});
loader.lazyRequireGetter(this, "_tokens", "devtools/client/debugger/src/utils/editor/tokens");
Object.keys(_tokens).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _tokens[key];
    }
  });
});
loader.lazyRequireGetter(this, "_createEditor", "devtools/client/debugger/src/utils/editor/create-editor");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
let editor;

function getEditor() {
  if (editor) {
    return editor;
  }

  editor = (0, _createEditor.createEditor)({
    cm6: true
  });
  return editor;
}

function removeEditor() {
  editor = null;
}
/**
 *  Update line wrapping for the codemirror editor.
 */


function updateEditorLineWrapping(value) {
  if (!editor) {
    return;
  }

  editor.setLineWrapping(value);
}

function toWasmSourceLine(offset) {
  return editor.wasmOffsetToLine(offset) || 0;
}
/**
 * Convert source lines / WASM line offsets to Codemirror lines
 * @param {Object} source
 * @param {Number} lineOrOffset
 * @returns
 */


function toEditorLine(source, lineOrOffset) {
  if (editor.isWasm && !source.isOriginal) {
    // TODO ensure offset is always "mappable" to edit line.
    return toWasmSourceLine(lineOrOffset) + 1;
  }

  return lineOrOffset;
}

function fromEditorLine(source, line) {
  // Also ignore the original source related to the .wasm file.
  if (editor.isWasm && !source.isOriginal) {
    // Content lines is 1-based in CM6 and 0-based in WASM
    return editor.lineToWasmOffset(line - 1);
  }

  return line;
}

function toEditorPosition(location) {
  // Note that Spidermonkey, Debugger frontend and CodeMirror are all consistent regarding column
  // and are 0-based. But only CodeMirror consider the line to be 0-based while the two others
  // consider lines to be 1-based.
  const isSourceWasm = editor.isWasm && !location.source.isOriginal;
  return {
    line: toEditorLine(location.source, location.line),
    column: isSourceWasm || !location.column ? 0 : location.column
  };
}

function toSourceLine(source, line) {
  if (editor.isWasm && !source.isOriginal) {
    return editor.lineToWasmOffset(line - 1);
  }

  return line;
}