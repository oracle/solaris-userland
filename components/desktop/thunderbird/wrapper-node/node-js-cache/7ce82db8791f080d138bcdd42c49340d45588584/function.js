"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findFunctionText = findFunctionText;
loader.lazyRequireGetter(this, "_asyncValue", "devtools/client/debugger/src/utils/async-value");
loader.lazyRequireGetter(this, "_ast", "devtools/client/debugger/src/utils/ast");
loader.lazyRequireGetter(this, "_indentation", "devtools/client/debugger/src/utils/indentation");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function findFunctionText(line, source, symbols) {
  const func = (0, _ast.findClosestFunction)(symbols, {
    sourceId: source.id,
    line,
    column: Infinity
  });

  if (source.isWasm || !func || !source.content || !(0, _asyncValue.isFulfilled)(source.content) || source.content.value.type !== "text") {
    return null;
  }

  const {
    location: {
      start,
      end
    }
  } = func;
  const lines = source.content.value.value.split("\n");
  const firstLine = lines[start.line - 1].slice(start.column);
  const lastLine = lines[end.line - 1].slice(0, end.column);
  const middle = lines.slice(start.line, end.line - 1);
  const functionText = [firstLine, ...middle, lastLine].join("\n");
  const indentedFunctionText = (0, _indentation.correctIndentation)(functionText);
  return indentedFunctionText;
}