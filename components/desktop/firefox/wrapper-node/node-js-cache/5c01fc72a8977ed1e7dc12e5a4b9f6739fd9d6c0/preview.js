"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updatePreview = updatePreview;
exports.setPreview = setPreview;
exports.clearPreview = clearPreview;

var _preview = require("../utils/preview");

var _ast = require("../utils/ast");

var _getExpression = require("../utils/editor/get-expression");

var _source = require("../utils/source");

var _devtoolsEnvironment = require("devtools/client/debugger/dist/vendors").vendored["devtools-environment"];

var _selectors = require("../selectors/index");

var _expressions = require("./expressions");

function findExpressionMatch(state, codeMirror, tokenPos) {
  const source = (0, _selectors.getSelectedSource)(state);
  if (!source) {
    return;
  }

  const symbols = (0, _selectors.getSymbols)(state, source);

  let match;
  if (!symbols || symbols.loading) {
    match = (0, _getExpression.getExpressionFromCoords)(codeMirror, tokenPos);
  } else {
    match = (0, _ast.findBestMatchExpression)(symbols, tokenPos);
  }
  return match;
} /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

function updatePreview(cx, target, tokenPos, codeMirror) {
  return ({ dispatch, getState, client, sourceMaps }) => {
    const cursorPos = target.getBoundingClientRect();

    if (!(0, _selectors.isSelectedFrameVisible)(getState()) || !(0, _selectors.isLineInScope)(getState(), tokenPos.line)) {
      return;
    }

    const match = findExpressionMatch(getState(), codeMirror, tokenPos);
    if (!match) {
      return;
    }

    const { expression, location } = match;

    if ((0, _preview.isConsole)(expression)) {
      return;
    }

    dispatch(setPreview(cx, expression, location, tokenPos, cursorPos, target));
  };
}

function setPreview(cx, expression, location, tokenPos, cursorPos, target) {
  return async ({ dispatch, getState, client, sourceMaps }) => {
    if ((0, _selectors.getPreview)(getState())) {
      dispatch(clearPreview(cx));
    }

    const source = (0, _selectors.getSelectedSource)(getState());
    if (!source) {
      return;
    }

    const thread = (0, _selectors.getCurrentThread)(getState());
    const selectedFrame = (0, _selectors.getSelectedFrame)(getState(), thread);

    if (location && (0, _source.isOriginal)(source)) {
      const mapResult = await dispatch((0, _expressions.getMappedExpression)(expression));
      if (mapResult) {
        expression = mapResult.expression;
      }
    }

    if (!selectedFrame) {
      return;
    }

    const { result } = await client.evaluateInFrame(expression, {
      frameId: selectedFrame.id,
      thread
    });

    // Error case occurs for a token that follows an errored evaluation
    // https://github.com/firefox-devtools/debugger/pull/8056
    // Accommodating for null allows us to show preview for falsy values
    // line "", false, null, Nan, and more
    if (result === null) {
      return;
    }

    // Handle cases where the result is invisible to the debugger
    // and not possible to preview. Bug 1548256
    if (result.class && result.class.includes("InvisibleToDebugger")) {
      return;
    }

    const root = {
      name: expression,
      path: expression,
      contents: { value: result }
    };
    const properties = await client.loadObjectProperties(root);

    // The first time a popup is rendered, the mouse should be hovered
    // on the token. If it happens to be hovered on whitespace, it should
    // not render anything
    if (!target.matches(":hover") && !(0, _devtoolsEnvironment.isTesting)()) {
      return;
    }

    dispatch({
      type: "SET_PREVIEW",
      cx,
      value: {
        expression,
        result,
        properties,
        root,
        location,
        tokenPos,
        cursorPos,
        target
      }
    });
  };
}

function clearPreview(cx) {
  return ({ dispatch, getState, client }) => {
    const currentSelection = (0, _selectors.getPreview)(getState());
    if (!currentSelection) {
      return;
    }

    return dispatch({
      type: "CLEAR_PREVIEW",
      cx
    });
  };
}