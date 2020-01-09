"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getASTLocation = getASTLocation;
exports.findFunctionByName = findFunctionByName;

var _ast = require("../ast");

function getASTLocation(source, symbols, location) {
  if (source.isWasm || !symbols || symbols.loading) {
    return { name: undefined, offset: location, index: 0 };
  }

  const scope = (0, _ast.findClosestFunction)(symbols, location);
  if (scope) {
    // we only record the line, but at some point we may
    // also do column offsets
    const line = location.line - scope.location.start.line;
    return {
      name: scope.name,
      offset: { line, column: undefined },
      index: scope.index
    };
  }
  return { name: undefined, offset: location, index: 0 };
} /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

function findFunctionByName(symbols, name, index) {
  if (symbols.loading) {
    return null;
  }

  const functions = symbols.functions;
  return functions.find(node => node.name === name && node.index === index);
}