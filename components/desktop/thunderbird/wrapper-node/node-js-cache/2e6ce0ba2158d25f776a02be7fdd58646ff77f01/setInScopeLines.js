"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setInScopeLines = setInScopeLines;
loader.lazyRequireGetter(this, "_index", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_asyncValue", "devtools/client/debugger/src/utils/async-value");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

/**
 * Get and store the in scope lines in the reducer
 * @param {Object} editor - The editor provides an API to retrieve the in scope location
 *                          details based on lezer in CM6.
 * @returns
 */
function setInScopeLines(editor) {
  return async thunkArgs => {
    const {
      getState,
      dispatch
    } = thunkArgs;
    const visibleFrame = (0, _index.getVisibleSelectedFrame)(getState());

    if (!visibleFrame) {
      return;
    }

    const {
      location
    } = visibleFrame;
    const sourceTextContent = (0, _index.getSourceTextContent)(getState(), location); // Ignore if in scope lines have already be computed, or if the selected location
    // doesn't have its content already fully fetched.
    // The ParserWorker will only have the source text content once the source text content is fulfilled.

    if ((0, _index.hasInScopeLines)(getState(), location) || !sourceTextContent || !(0, _asyncValue.isFulfilled)(sourceTextContent) || !editor) {
      return;
    }

    const lines = await editor.getInScopeLines(location);
    dispatch({
      type: "IN_SCOPE_LINES",
      location,
      lines
    });
  };
}