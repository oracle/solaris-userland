"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onMouseOver = undefined;

var _sourceDocuments = require("./source-documents");

Object.keys(_sourceDocuments).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _sourceDocuments[key];
    }
  });
});

var _getTokenLocation = require("./get-token-location");

Object.keys(_getTokenLocation).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _getTokenLocation[key];
    }
  });
});

var _sourceSearch = require("./source-search");

Object.keys(_sourceSearch).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _sourceSearch[key];
    }
  });
});

var _ui = require("../ui");

Object.keys(_ui).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _ui[key];
    }
  });
});

var _tokenEvents = require("./token-events");

Object.defineProperty(exports, "onMouseOver", {
  enumerable: true,
  get: function () {
    return _tokenEvents.onMouseOver;
  }
});
exports.getEditor = getEditor;
exports.removeEditor = removeEditor;
exports.startOperation = startOperation;
exports.endOperation = endOperation;
exports.shouldShowPrettyPrint = shouldShowPrettyPrint;
exports.traverseResults = traverseResults;
exports.toEditorLine = toEditorLine;
exports.fromEditorLine = fromEditorLine;
exports.toEditorPosition = toEditorPosition;
exports.toEditorRange = toEditorRange;
exports.toSourceLine = toSourceLine;
exports.scrollToColumn = scrollToColumn;
exports.getLocationsInViewport = getLocationsInViewport;
exports.markText = markText;
exports.lineAtHeight = lineAtHeight;
exports.getSourceLocationFromMouseEvent = getSourceLocationFromMouseEvent;
exports.forEachLine = forEachLine;
exports.removeLineClass = removeLineClass;
exports.clearLineClass = clearLineClass;
exports.getTextForLine = getTextForLine;
exports.getCursorLine = getCursorLine;
exports.getTokenEnd = getTokenEnd;

var _createEditor = require("./create-editor");

var _source = require("../source");

var _wasm = require("../wasm");

let editor;

function getEditor() {
  if (editor) {
    return editor;
  }

  editor = (0, _createEditor.createEditor)();
  return editor;
}

function removeEditor() {
  editor = null;
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

function shouldShowPrettyPrint(source, content) {
  return (0, _source.shouldPrettyPrint)(source, content);
}

function traverseResults(e, ctx, query, dir, modifiers) {
  e.stopPropagation();
  e.preventDefault();

  if (dir == "prev") {
    (0, _sourceSearch.findPrev)(ctx, query, true, modifiers);
  } else if (dir == "next") {
    (0, _sourceSearch.findNext)(ctx, query, true, modifiers);
  }
}

function toEditorLine(sourceId, lineOrOffset) {
  if ((0, _wasm.isWasm)(sourceId)) {
    // TODO ensure offset is always "mappable" to edit line.
    return (0, _wasm.wasmOffsetToLine)(sourceId, lineOrOffset) || 0;
  }

  return lineOrOffset ? lineOrOffset - 1 : 1;
}

function fromEditorLine(sourceId, line) {
  if ((0, _wasm.isWasm)(sourceId)) {
    return (0, _wasm.lineToWasmOffset)(sourceId, line) || 0;
  }

  return line + 1;
}

function toEditorPosition(location) {
  return {
    line: toEditorLine(location.sourceId, location.line),
    column: (0, _wasm.isWasm)(location.sourceId) || !location.column ? 0 : location.column
  };
}

function toEditorRange(sourceId, location) {
  const { start, end } = location;
  return {
    start: toEditorPosition({ ...start, sourceId }),
    end: toEditorPosition({ ...end, sourceId })
  };
}

function toSourceLine(sourceId, line) {
  return (0, _wasm.isWasm)(sourceId) ? (0, _wasm.lineToWasmOffset)(sourceId, line) : line + 1;
}

function scrollToColumn(codeMirror, line, column) {
  const { top, left } = codeMirror.charCoords({ line: line, ch: column }, "local");

  if (!isVisible(codeMirror, top, left)) {
    const scroller = codeMirror.getScrollerElement();
    const centeredX = Math.max(left - scroller.offsetWidth / 2, 0);
    const centeredY = Math.max(top - scroller.offsetHeight / 2, 0);

    codeMirror.scrollTo(centeredX, centeredY);
  }
}

function isVisible(codeMirror, top, left) {
  function withinBounds(x, min, max) {
    return x >= min && x <= max;
  }

  const scrollArea = codeMirror.getScrollInfo();
  const charWidth = codeMirror.defaultCharWidth();
  const fontHeight = codeMirror.defaultTextHeight();
  const { scrollTop, scrollLeft } = codeMirror.doc;

  const inXView = withinBounds(left, scrollLeft, scrollLeft + (scrollArea.clientWidth - 30) - charWidth);

  const inYView = withinBounds(top, scrollTop, scrollTop + scrollArea.clientHeight - fontHeight);

  return inXView && inYView;
}

function getLocationsInViewport({ codeMirror }) {
  // Get scroll position
  if (!codeMirror) {
    return {
      start: { line: 0, column: 0 },
      end: { line: 0, column: 0 }
    };
  }
  const charWidth = codeMirror.defaultCharWidth();
  const scrollArea = codeMirror.getScrollInfo();
  const { scrollLeft } = codeMirror.doc;
  const rect = codeMirror.getWrapperElement().getBoundingClientRect();
  const topVisibleLine = codeMirror.lineAtHeight(rect.top, "window");
  const bottomVisibleLine = codeMirror.lineAtHeight(rect.bottom, "window");

  const leftColumn = Math.floor(scrollLeft > 0 ? scrollLeft / charWidth : 0);
  const rightPosition = scrollLeft + (scrollArea.clientWidth - 30);
  const rightCharacter = Math.floor(rightPosition / charWidth);

  return {
    start: {
      line: topVisibleLine,
      column: leftColumn
    },
    end: {
      line: bottomVisibleLine,
      column: rightCharacter
    }
  };
}

function markText({ codeMirror }, className, { start, end }) {
  return codeMirror.markText({ ch: start.column, line: start.line }, { ch: end.column, line: end.line }, { className });
}

function lineAtHeight({ codeMirror }, sourceId, event) {
  const _editorLine = codeMirror.lineAtHeight(event.clientY);
  return toSourceLine(sourceId, _editorLine);
}

function getSourceLocationFromMouseEvent({ codeMirror }, source, e) {
  const { line, ch } = codeMirror.coordsChar({
    left: e.clientX,
    top: e.clientY
  });

  return {
    sourceId: source.id,
    line: line + 1,
    column: ch + 1
  };
}

function forEachLine(codeMirror, iter) {
  codeMirror.operation(() => {
    codeMirror.doc.iter(0, codeMirror.lineCount(), iter);
  });
}

function removeLineClass(codeMirror, line, className) {
  codeMirror.removeLineClass(line, "line", className);
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

function getTokenEnd(codeMirror, line, column) {
  const token = codeMirror.getTokenAt({
    line: line,
    ch: column + 1
  });

  return token.end;
}