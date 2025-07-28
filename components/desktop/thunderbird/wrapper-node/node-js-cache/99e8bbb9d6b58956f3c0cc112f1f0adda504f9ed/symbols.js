"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOriginalFunctionDisplayName = getOriginalFunctionDisplayName;
exports.getFunctionSymbols = getFunctionSymbols;
exports.getClassSymbols = getClassSymbols;
loader.lazyRequireGetter(this, "_loadSourceText", "devtools/client/debugger/src/actions/sources/loadSourceText");
loader.lazyRequireGetter(this, "_index", "devtools/client/debugger/src/utils/editor/index");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function getOriginalFunctionDisplayName(location) {
  return async ({
    dispatch
  }) => {
    // Make sure the source for the symbols exist.
    await dispatch((0, _loadSourceText.loadSourceText)(location.source, location.sourceActor));
    const editor = (0, _index.getEditor)();
    return editor.getClosestFunctionName(location);
  };
}

function getFunctionSymbols(location, maxResults) {
  return async ({
    dispatch
  }) => {
    // Make sure the source for the symbols exist.
    await dispatch((0, _loadSourceText.loadSourceText)(location.source, location.sourceActor));
    const editor = (0, _index.getEditor)();
    return editor?.getFunctionSymbols(maxResults);
  };
}

function getClassSymbols(location) {
  return async ({
    dispatch
  }) => {
    // See  comment in getFunctionSymbols
    await dispatch((0, _loadSourceText.loadSourceText)(location.source, location.sourceActor));
    const editor = (0, _index.getEditor)();
    return editor?.getClassSymbols();
  };
}