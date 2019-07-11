"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectThread = selectThread;
exports.command = command;
exports.stepIn = stepIn;
exports.stepOver = stepOver;
exports.stepOut = stepOut;
exports.resume = resume;
exports.rewind = rewind;
exports.reverseStepOver = reverseStepOver;
exports.astCommand = astCommand;

var _selectors = require("../../selectors/index");

var _promise = require("../utils/middleware/promise");

var _breakpoints = require("../breakpoints/index");

var _expressions = require("../expressions");

var _sources = require("../sources/index");

var _fetchScopes = require("./fetchScopes");

var _prefs = require("../../utils/prefs");

var _telemetry = require("../../utils/telemetry");

var _assert = require("../../utils/assert");

var _assert2 = _interopRequireDefault(_assert);

var _asyncValue = require("../../utils/async-value");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* -*- indent-tabs-mode: nil; js-indent-level: 2; js-indent-level: 2 -*- */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

function selectThread(cx, thread) {
  return async ({ dispatch, getState, client }) => {
    await dispatch({ cx, type: "SELECT_THREAD", thread });

    // Get a new context now that the current thread has changed.
    const threadcx = (0, _selectors.getThreadContext)(getState());
    (0, _assert2.default)(threadcx.thread == thread, "Thread mismatch");

    dispatch((0, _expressions.evaluateExpressions)(threadcx));

    const frame = (0, _selectors.getSelectedFrame)(getState(), thread);
    if (frame) {
      dispatch((0, _sources.selectLocation)(threadcx, frame.location));
      dispatch((0, _fetchScopes.fetchScopes)(threadcx));
    }
  };
}

/**
 * Debugger commands like stepOver, stepIn, stepUp
 *
 * @param string $0.type
 * @memberof actions/pause
 * @static
 */
function command(cx, type) {
  return async ({ dispatch, getState, client }) => {
    if (type) {
      return dispatch({
        type: "COMMAND",
        command: type,
        cx,
        thread: cx.thread,
        [_promise.PROMISE]: client[type](cx.thread)
      });
    }
  };
}

/**
 * StepIn
 * @memberof actions/pause
 * @static
 * @returns {Function} {@link command}
 */
function stepIn(cx) {
  return ({ dispatch, getState }) => {
    if (cx.isPaused) {
      return dispatch(command(cx, "stepIn"));
    }
  };
}

/**
 * stepOver
 * @memberof actions/pause
 * @static
 * @returns {Function} {@link command}
 */
function stepOver(cx) {
  return ({ dispatch, getState }) => {
    if (cx.isPaused) {
      return dispatch(astCommand(cx, "stepOver"));
    }
  };
}

/**
 * stepOut
 * @memberof actions/pause
 * @static
 * @returns {Function} {@link command}
 */
function stepOut(cx) {
  return ({ dispatch, getState }) => {
    if (cx.isPaused) {
      return dispatch(command(cx, "stepOut"));
    }
  };
}

/**
 * resume
 * @memberof actions/pause
 * @static
 * @returns {Function} {@link command}
 */
function resume(cx) {
  return ({ dispatch, getState }) => {
    if (cx.isPaused) {
      (0, _telemetry.recordEvent)("continue");
      return dispatch(command(cx, "resume"));
    }
  };
}

/**
 * rewind
 * @memberof actions/pause
 * @static
 * @returns {Function} {@link command}
 */
function rewind(cx) {
  return ({ dispatch, getState }) => {
    if (cx.isPaused) {
      return dispatch(command(cx, "rewind"));
    }
  };
}

/**
 * reverseStepOver
 * @memberof actions/pause
 * @static
 * @returns {Function} {@link command}
 */
function reverseStepOver(cx) {
  return ({ dispatch, getState }) => {
    if (cx.isPaused) {
      return dispatch(astCommand(cx, "reverseStepOver"));
    }
  };
}

/*
 * Checks for await or yield calls on the paused line
 * This avoids potentially expensive parser calls when we are likely
 * not at an async expression.
 */
function hasAwait(content, pauseLocation) {
  const { line, column } = pauseLocation;
  if (!content || !(0, _asyncValue.isFulfilled)(content) || content.value.type !== "text") {
    return false;
  }

  const lineText = content.value.value.split("\n")[line - 1];

  if (!lineText) {
    return false;
  }

  const snippet = lineText.slice(column - 50, column + 50);

  return !!snippet.match(/(yield|await)/);
}

/**
 * @memberOf actions/pause
 * @static
 * @param stepType
 * @returns {function(ThunkArgs)}
 */
function astCommand(cx, stepType) {
  return async ({ dispatch, getState, sourceMaps, parser }) => {
    if (!_prefs.features.asyncStepping) {
      return dispatch(command(cx, stepType));
    }

    if (stepType == "stepOver") {
      // This type definition is ambiguous:
      const frame = (0, _selectors.getTopFrame)(getState(), cx.thread);
      const source = (0, _selectors.getSource)(getState(), frame.location.sourceId);
      const content = source ? (0, _selectors.getSourceContent)(getState(), source.id) : null;

      if (source && hasAwait(content, frame.location)) {
        const nextLocation = await parser.getNextStep(source.id, frame.location);
        if (nextLocation) {
          await dispatch((0, _breakpoints.addHiddenBreakpoint)(cx, nextLocation));
          return dispatch(command(cx, "resume"));
        }
      }
    }

    return dispatch(command(cx, stepType));
  };
}