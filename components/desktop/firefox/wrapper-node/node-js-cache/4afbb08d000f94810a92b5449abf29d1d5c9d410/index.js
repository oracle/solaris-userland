"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  getEditor: true,
  removeEditor: true,
  updateEditorLineWrapping: true,
  startOperation: true,
  endOperation: true,
  toEditorLine: true,
  fromEditorLine: true,
  toEditorPosition: true,
  toSourceLine: true,
  markText: true,
  lineAtHeight: true,
  getSourceLocationFromMouseEvent: true,
  forEachLine: true,
  removeLineClass: true,
  clearLineClass: true,
  getTextForLine: true,
  getCursorLine: true,
  getCursorColumn: true
};
exports.getEditor = getEditor;
exports.removeEditor = removeEditor;
exports.updateEditorLineWrapping = updateEditorLineWrapping;
exports.startOperation = startOperation;
exports.endOperation = endOperation;
exports.toEditorLine = toEditorLine;
exports.fromEditorLine = fromEditorLine;
exports.toEditorPosition = toEditorPosition;
exports.toSourceLine = toSourceLine;
exports.markText = markText;
exports.lineAtHeight = lineAtHeight;
exports.getSourceLocationFromMouseEvent = getSourceLocationFromMouseEvent;
exports.forEachLine = forEachLine;
exports.removeLineClass = removeLineClass;
exports.clearLineClass = clearLineClass;
exports.getTextForLine = getTextForLine;
exports.getCursorLine = getCursorLine;
exports.getCursorColumn = getCursorColumn;
loader.lazyRequireGetter(this, "_sourceDocuments", "devtools/client/debugger/src/utils/editor/source-documents");
Object.keys(_sourceDocuments).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _sourceDocuments[key];
    }
  });
});
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
loader.lazyRequireGetter(this, "_wasm", "devtools/client/debugger/src/utils/wasm");
loader.lazyRequireGetter(this, "_location", "devtools/client/debugger/src/utils/location");
loader.lazyRequireGetter(this, "_prefs", "devtools/client/debugger/src/utils/prefs");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
let editor;

function getEditor(useCm6) {
  if (editor) {
    return editor;
  }

  editor = (0, _createEditor.createEditor)(useCm6);
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

function getCodeMirror() {
  return editor && editor.hasCodeMirror ? editor.codeMirror : null;
}

function startOperation() {
  const codeMirror = getCodeMirror();

  if (!codeMirror) {
    return;
  }

  codeMirror.startOperation();
}

function endOperation() {
  const codeMirror = getCodeMirror();

  if (!codeMirror) {
    return;
  }

  codeMirror.endOperation();
}

function toEditorLine(sourceId, lineOrOffset) {
  if ((0, _wasm.isWasm)(sourceId)) {
    // TODO ensure offset is always "mappable" to edit line.
    return (0, _wasm.wasmOffsetToLine)(sourceId, lineOrOffset) || 0;
  }

  if (_prefs.features.codemirrorNext) {
    return lineOrOffset;
  }

  return lineOrOffset ? lineOrOffset - 1 : 1;
}

function fromEditorLine(sourceId, line, sourceIsWasm) {
  if (sourceIsWasm) {
    return (0, _wasm.lineToWasmOffset)(sourceId, line) || 0;
  }

  if (_prefs.features.codemirrorNext) {
    return line;
  }

  return line + 1;
}

function toEditorPosition(location) {
  // Note that Spidermonkey, Debugger frontend and CodeMirror are all consistant regarding column
  // and are 0-based. But only CodeMirror consider the line to be 0-based while the two others
  // consider lines to be 1-based.
  return {
    line: toEditorLine(location.source.id, location.line),
    column: (0, _wasm.isWasm)(location.source.id) || (!location.column ? 0 : location.column)
  };
}

function toSourceLine(sourceId, line) {
  if ((0, _wasm.isWasm)(sourceId)) {
    return (0, _wasm.lineToWasmOffset)(sourceId, line);
  }

  if (_prefs.features.codemirrorNext) {
    return line;
  }

  return line + 1;
}

function markText({
  codeMirror
}, className, {
  start,
  end
}) {
  return codeMirror.markText({
    ch: start.column,
    line: start.line
  }, {
    ch: end.column,
    line: end.line
  }, {
    className
  });
}

function lineAtHeight({
  codeMirror
}, sourceId, event) {
  const _editorLine = codeMirror.lineAtHeight(event.clientY);

  return toSourceLine(sourceId, _editorLine);
}

function getSourceLocationFromMouseEvent({
  codeMirror
}, source, e) {
  const {
    line,
    ch
  } = codeMirror.coordsChar({
    left: e.clientX,
    top: e.clientY
  });
  return (0, _location.createLocation)({
    source,
    line: fromEditorLine(source.id, line, (0, _wasm.isWasm)(source.id)),
    column: (0, _wasm.isWasm)(source.id) ? 0 : ch + 1
  });
}

function forEachLine(codeMirror, iter) {
  codeMirror.operation(() => {
    codeMirror.doc.iter(0, codeMirror.lineCount(), iter);
  });
}

function removeLineClass(codeMirror, line, className) {
  codeMirror.removeLineClass(line, "wrap", className);
}

function clearLineClass(codeMirror, className) {
  forEachLine(codeMirror, line => {
    removeLineClass(codeMirror, line, className);
  });
}

function getTextForLine(codeMirror, line) {
  return codeMirror.getLine(line - 1).trim();
}

function getCursorLine(codeMirror) {
  return codeMirror.getCursor().line;
}

function getCursorColumn(codeMirror) {
  return codeMirror.getCursor().ch;
}