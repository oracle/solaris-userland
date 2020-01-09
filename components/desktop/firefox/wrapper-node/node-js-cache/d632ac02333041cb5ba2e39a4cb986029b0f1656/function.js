"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findFunctionText = findFunctionText;

var _asyncValue = require("./async-value");

var _ast = require("./ast");

var _indentation = require("./indentation");

function findFunctionText(line, { source, content }, symbols) {
  const func = (0, _ast.findClosestFunction)(symbols, {
    sourceId: source.id,
    line,
    column: Infinity
  });

  if (source.isWasm || !func || !content || !(0, _asyncValue.isFulfilled)(content) || content.value.type !== "text") {
    return null;
  }

  const {
    location: { start, end }
  } = func;
  const lines = content.value.value.split("\n");
  const firstLine = lines[start.line - 1].slice(start.column);
  const lastLine = lines[end.line - 1].slice(0, end.column);
  const middle = lines.slice(start.line, end.line - 1);
  const functionText = [firstLine, ...middle, lastLine].join("\n");
  const indentedFunctionText = (0, _indentation.correctIndentation)(functionText);

  return indentedFunctionText;
} /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */