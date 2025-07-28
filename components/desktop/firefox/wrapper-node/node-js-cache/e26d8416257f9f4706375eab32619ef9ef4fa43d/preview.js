"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTracerPreview = getTracerPreview;
exports.getPausedPreview = getPausedPreview;
exports.getExceptionPreview = getExceptionPreview;
loader.lazyRequireGetter(this, "_preview", "devtools/client/debugger/src/utils/preview");
loader.lazyRequireGetter(this, "_evaluationResult", "devtools/client/debugger/src/utils/evaluation-result");
loader.lazyRequireGetter(this, "_index", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_expressions", "devtools/client/debugger/src/actions/expressions");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
const {
  TRACER_FIELDS_INDEXES
} = require("resource://devtools/server/actors/tracer.js");

async function findExpressionMatches(state, editor, tokenPos) {
  const location = (0, _index.getSelectedLocation)(state);

  if (!location) {
    return [];
  }

  return editor.findBestMatchExpressions(tokenPos);
}
/**
 * Get a preview object for the currently selected frame in the JS Tracer.
 *
 * @param {Object} target
 *        The hovered DOM Element within CodeMirror rendering.
 * @param {Object} tokenPos
 *        The CodeMirror position object for the hovered token.
 * @param {Object} editor
 *        The CodeMirror editor object.
 */


function getTracerPreview(target, tokenPos, editor) {
  return async thunkArgs => {
    const {
      getState
    } = thunkArgs;
    const selectedTraceIndex = (0, _index.getSelectedTraceIndex)(getState());

    if (selectedTraceIndex == null) {
      return null;
    }

    const trace = (0, _index.getAllTraces)(getState())[selectedTraceIndex]; // We may be selecting a mutation trace, which doesn't expose any value,
    // so only consider method calls.

    if (trace[TRACER_FIELDS_INDEXES.TYPE] != "enter") {
      return null;
    }

    const matches = await findExpressionMatches(getState(), editor, tokenPos);

    if (!matches.length) {
      return null;
    }

    let {
      expression,
      location
    } = matches[0];
    const source = (0, _index.getSelectedSource)(getState());

    if (location && source.isOriginal) {
      const thread = (0, _index.getCurrentThread)(getState());
      const mapResult = await (0, _expressions.getMappedExpression)(expression, thread, thunkArgs);

      if (mapResult) {
        expression = mapResult.expression;
      }
    }

    const argumentValues = trace[TRACER_FIELDS_INDEXES.ENTER_ARGS];
    const argumentNames = trace[TRACER_FIELDS_INDEXES.ENTER_ARG_NAMES];

    if (!argumentNames || !argumentValues) {
      return null;
    }

    const argumentIndex = argumentNames.indexOf(expression);

    if (argumentIndex == -1) {
      return null;
    }

    const result = argumentValues[argumentIndex]; // Values are either primitives, or an Object Front

    const resultGrip = result?.getGrip ? result?.getGrip() : result;
    const root = {
      // Force updating the ObjectInspector when hovering same-name variable on another trace.
      // See ObjectInspector.getNodeKey.
      path: `${selectedTraceIndex}-${expression}`,
      contents: {
        value: resultGrip,
        front: (0, _evaluationResult.getFront)(result)
      }
    };
    return {
      previewType: "tracer",
      target,
      tokenPos,
      cursorPos: target.getBoundingClientRect(),
      expression,
      root,
      resultGrip
    };
  };
}
/**
 * Get a preview object for the currently paused frame, if paused.
 *
 * @param {Object} target
 *        The hovered DOM Element within CodeMirror rendering.
 * @param {Object} tokenPos
 *        The CodeMirror position object for the hovered token.
 * @param {Object} editor
 *        The CodeMirror editor object.
 */


function getPausedPreview(target, tokenPos, editor) {
  return async thunkArgs => {
    const {
      getState,
      client
    } = thunkArgs;

    if (!(0, _index.isSelectedFrameVisible)(getState()) || !(0, _index.isLineInScope)(getState(), tokenPos.line)) {
      return null;
    }

    const source = (0, _index.getSelectedSource)(getState());

    if (!source) {
      return null;
    }

    const thread = (0, _index.getCurrentThread)(getState());
    const selectedFrame = (0, _index.getSelectedFrame)(getState());

    if (!selectedFrame) {
      return null;
    }

    const matches = await findExpressionMatches(getState(), editor, tokenPos);

    if (!matches.length) {
      return null;
    }

    let {
      expression,
      location
    } = matches[0];

    if ((0, _preview.isConsole)(expression)) {
      return null;
    }

    if (location && source.isOriginal) {
      const mapResult = await (0, _expressions.getMappedExpression)(expression, thread, thunkArgs);

      if (mapResult) {
        expression = mapResult.expression;
      }
    }

    const {
      result,
      hasException,
      exception
    } = await client.evaluate(expression, {
      frameId: selectedFrame.id
    }); // The evaluation shouldn't return an exception.

    if (hasException) {
      const errorClass = exception?.getGrip()?.class || "Error";
      throw new Error(`Debugger internal exception: Preview for <${expression}> threw a ${errorClass}`);
    }

    const resultGrip = (0, _evaluationResult.getGrip)(result); // Error case occurs for a token that follows an errored evaluation
    // https://github.com/firefox-devtools/debugger/pull/8056
    // Accommodating for null allows us to show preview for falsy values
    // line "", false, null, Nan, and more

    if (resultGrip === null) {
      return null;
    } // Handle cases where the result is invisible to the debugger
    // and not possible to preview. Bug 1548256


    if (resultGrip && resultGrip.class && typeof resultGrip.class === "string" && resultGrip.class.includes("InvisibleToDebugger")) {
      return null;
    }

    const root = {
      path: expression,
      contents: {
        value: resultGrip,
        front: (0, _evaluationResult.getFront)(result)
      }
    };
    return {
      previewType: "pause",
      target,
      tokenPos,
      cursorPos: target.getBoundingClientRect(),
      expression,
      root,
      resultGrip
    };
  };
}

function getExceptionPreview(target, tokenPos, editor) {
  return async ({
    getState
  }) => {
    const matches = await findExpressionMatches(getState(), editor, tokenPos);

    if (!matches.length) {
      return null;
    }

    let exception; // Lezer might return multiple matches in certain scenarios.
    // Example: For this expression `[].inlineException()` is likely to throw an exception,
    // but if the user hovers over `inlineException` lezer finds 2 matches :
    // 1) `inlineException` for `PropertyName`,
    // 2) `[].inlineException()` for `MemberExpression`
    // Babel seems to only include the `inlineException`.

    for (const match of matches) {
      const tokenColumnStart = match.location.start.column + 1;
      exception = (0, _index.getSelectedException)(getState(), tokenPos.line, tokenColumnStart);

      if (exception) {
        break;
      }
    }

    if (!exception) {
      return null;
    }

    return {
      target,
      tokenPos,
      cursorPos: target.getBoundingClientRect(),
      exception
    };
  };
}