"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updatePreview = updatePreview;
exports.setPreview = setPreview;
exports.clearPreview = clearPreview;
loader.lazyRequireGetter(this, "_preview", "devtools/client/debugger/src/utils/preview");
loader.lazyRequireGetter(this, "_ast", "devtools/client/debugger/src/utils/ast");
loader.lazyRequireGetter(this, "_evaluationResult", "devtools/client/debugger/src/utils/evaluation-result");
loader.lazyRequireGetter(this, "_getExpression", "devtools/client/debugger/src/utils/editor/get-expression");
loader.lazyRequireGetter(this, "_source", "devtools/client/debugger/src/utils/source");

var _devtoolsEnvironment = require("devtools/client/debugger/dist/vendors").vendored["devtools-environment"];

loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_expressions", "devtools/client/debugger/src/actions/expressions");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
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
}

function updatePreview(cx, target, tokenPos, codeMirror) {
  return ({
    dispatch,
    getState,
    client,
    sourceMaps
  }) => {
    const cursorPos = target.getBoundingClientRect();

    if (!(0, _selectors.isSelectedFrameVisible)(getState()) || !(0, _selectors.isLineInScope)(getState(), tokenPos.line)) {
      return;
    }

    const match = findExpressionMatch(getState(), codeMirror, tokenPos);

    if (!match) {
      return;
    }

    const {
      expression,
      location
    } = match;

    if ((0, _preview.isConsole)(expression)) {
      return;
    }

    dispatch(setPreview(cx, expression, location, tokenPos, cursorPos, target));
  };
}

function setPreview(cx, expression, location, tokenPos, cursorPos, target) {
  return async ({
    dispatch,
    getState,
    client,
    sourceMaps
  }) => {
    dispatch({
      type: "START_PREVIEW"
    });
    const previewCount = (0, _selectors.getPreviewCount)(getState());

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

    const {
      result
    } = await client.evaluateInFrame(expression, {
      frameId: selectedFrame.id,
      thread
    });
    const resultGrip = (0, _evaluationResult.getGrip)(result); // Error case occurs for a token that follows an errored evaluation
    // https://github.com/firefox-devtools/debugger/pull/8056
    // Accommodating for null allows us to show preview for falsy values
    // line "", false, null, Nan, and more

    if (resultGrip === null) {
      return;
    } // Handle cases where the result is invisible to the debugger
    // and not possible to preview. Bug 1548256


    if (resultGrip && resultGrip.class && typeof resultGrip.class === "string" && resultGrip.class.includes("InvisibleToDebugger")) {
      return;
    }

    const root = {
      name: expression,
      path: expression,
      contents: {
        value: resultGrip,
        front: (0, _evaluationResult.getFront)(result)
      }
    };
    const properties = await client.loadObjectProperties(root); // The first time a popup is rendered, the mouse should be hovered
    // on the token. If it happens to be hovered on whitespace, it should
    // not render anything

    if (!target.matches(":hover") && !(0, _devtoolsEnvironment.isTesting)()) {
      return;
    } // Don't finish dispatching if another setPreview was started


    if (previewCount != (0, _selectors.getPreviewCount)(getState())) {
      return;
    }

    dispatch({
      type: "SET_PREVIEW",
      cx,
      value: {
        expression,
        resultGrip,
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
  return ({
    dispatch,
    getState,
    client
  }) => {
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