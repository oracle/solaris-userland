"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _propTypes = require("devtools/client/shared/vendor/react-prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require("devtools/client/shared/vendor/react");

var _react2 = _interopRequireDefault(_react);

var _connect = require("../../utils/connect");

var _classnames = require("devtools/client/debugger/dist/vendors").vendored["classnames"];

var _classnames2 = _interopRequireDefault(_classnames);

var _prefs = require("../../utils/prefs");

var _selectors = require("../../selectors/index");

var _text = require("../../utils/text");

var _actions = require("../../actions/index");

var _actions2 = _interopRequireDefault(_actions);

var _CommandBarButton = require("../shared/Button/CommandBarButton");

var _AccessibleImage = require("../shared/AccessibleImage");

var _AccessibleImage2 = _interopRequireDefault(_AccessibleImage);

var _devtoolsServices = require("Services");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const isMacOS = _devtoolsServices.appinfo.OS === "Darwin";

// NOTE: the "resume" command will call either the resume or breakOnNext action
// depending on whether or not the debugger is paused or running
/* -*- indent-tabs-mode: nil; js-indent-level: 2; js-indent-level: 2 -*- */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

const COMMANDS = ["resume", "stepOver", "stepIn", "stepOut"];

const KEYS = {
  WINNT: {
    resume: "F8",
    stepOver: "F10",
    stepIn: "F11",
    stepOut: "Shift+F11"
  },
  Darwin: {
    resume: "Cmd+\\",
    stepOver: "Cmd+'",
    stepIn: "Cmd+;",
    stepOut: "Cmd+Shift+:",
    stepOutDisplay: "Cmd+Shift+;"
  },
  Linux: {
    resume: "F8",
    stepOver: "F10",
    stepIn: "F11",
    stepOut: "Shift+F11"
  }
};

function getKey(action) {
  return getKeyForOS(_devtoolsServices.appinfo.OS, action);
}

function getKeyForOS(os, action) {
  const osActions = KEYS[os] || KEYS.Linux;
  return osActions[action];
}

function formatKey(action) {
  const key = getKey(`${action}Display`) || getKey(action);
  if (isMacOS) {
    const winKey = getKeyForOS("WINNT", `${action}Display`) || getKeyForOS("WINNT", action);
    // display both Windows type and Mac specific keys
    return (0, _text.formatKeyShortcut)([key, winKey].join(" "));
  }
  return (0, _text.formatKeyShortcut)(key);
}

class CommandBar extends _react.Component {
  componentWillUnmount() {
    const shortcuts = this.context.shortcuts;
    COMMANDS.forEach(action => shortcuts.off(getKey(action)));
    if (isMacOS) {
      COMMANDS.forEach(action => shortcuts.off(getKeyForOS("WINNT", action)));
    }
  }

  componentDidMount() {
    const shortcuts = this.context.shortcuts;

    COMMANDS.forEach(action => shortcuts.on(getKey(action), (_, e) => this.handleEvent(e, action)));

    if (isMacOS) {
      // The Mac supports both the Windows Function keys
      // as well as the Mac non-Function keys
      COMMANDS.forEach(action => shortcuts.on(getKeyForOS("WINNT", action), (_, e) => this.handleEvent(e, action)));
    }
  }

  handleEvent(e, action) {
    const { cx } = this.props;
    e.preventDefault();
    e.stopPropagation();
    if (action === "resume") {
      this.props.cx.isPaused ? this.props.resume(cx) : this.props.breakOnNext(cx);
    } else {
      this.props[action](cx);
    }
  }

  renderStepButtons() {
    const { cx, canRewind } = this.props;
    const className = cx.isPaused ? "active" : "disabled";
    const isDisabled = !cx.isPaused;

    if (canRewind || !cx.isPaused && _prefs.features.removeCommandBarOptions) {
      return;
    }

    return [(0, _CommandBarButton.debugBtn)(() => this.props.stepOver(cx), "stepOver", className, L10N.getFormatStr("stepOverTooltip", formatKey("stepOver")), isDisabled), (0, _CommandBarButton.debugBtn)(() => this.props.stepIn(cx), "stepIn", className, L10N.getFormatStr("stepInTooltip", formatKey("stepIn")), isDisabled), (0, _CommandBarButton.debugBtn)(() => this.props.stepOut(cx), "stepOut", className, L10N.getFormatStr("stepOutTooltip", formatKey("stepOut")), isDisabled)];
  }

  resume() {
    this.props.resume(this.props.cx);
  }

  renderPauseButton() {
    const { cx, breakOnNext, isWaitingOnBreak, canRewind } = this.props;

    if (cx.isPaused) {
      if (canRewind) {
        return null;
      }
      return (0, _CommandBarButton.debugBtn)(() => this.resume(), "resume", "active", L10N.getFormatStr("resumeButtonTooltip", formatKey("resume")));
    }

    if (_prefs.features.removeCommandBarOptions && !this.props.canRewind) {
      return;
    }

    if (isWaitingOnBreak) {
      return (0, _CommandBarButton.debugBtn)(null, "pause", "disabled", L10N.getStr("pausePendingButtonTooltip"), true);
    }

    return (0, _CommandBarButton.debugBtn)(() => breakOnNext(cx), "pause", "active", L10N.getFormatStr("pauseButtonTooltip", formatKey("resume")));
  }

  renderTimeTravelButtons() {
    const { cx, canRewind } = this.props;

    if (!canRewind || !cx.isPaused) {
      return null;
    }

    const isDisabled = !cx.isPaused;

    return [(0, _CommandBarButton.debugBtn)(() => this.props.rewind(cx), "rewind", "active", "Rewind Execution"), (0, _CommandBarButton.debugBtn)(() => this.props.resume(cx), "resume", "active", L10N.getFormatStr("resumeButtonTooltip", formatKey("resume"))), _react2.default.createElement("div", { key: "divider-1", className: "divider" }), (0, _CommandBarButton.debugBtn)(() => this.props.reverseStepOver(cx), "reverseStepOver", "active", "Reverse step over"), (0, _CommandBarButton.debugBtn)(() => this.props.stepOver(cx), "stepOver", "active", L10N.getFormatStr("stepOverTooltip", formatKey("stepOver")), isDisabled), _react2.default.createElement("div", { key: "divider-2", className: "divider" }), (0, _CommandBarButton.debugBtn)(() => this.props.stepOut(cx), "stepOut", "active", L10N.getFormatStr("stepOutTooltip", formatKey("stepOut")), isDisabled), (0, _CommandBarButton.debugBtn)(() => this.props.stepIn(cx), "stepIn", "active", L10N.getFormatStr("stepInTooltip", formatKey("stepIn")), isDisabled)];
  }

  renderSkipPausingButton() {
    const { skipPausing, toggleSkipPausing } = this.props;

    if (!_prefs.features.skipPausing) {
      return null;
    }

    return _react2.default.createElement(
      "button",
      {
        className: (0, _classnames2.default)("command-bar-button", "command-bar-skip-pausing", {
          active: skipPausing
        }),
        title: skipPausing ? L10N.getStr("undoSkipPausingTooltip.label") : L10N.getStr("skipPausingTooltip.label"),
        onClick: toggleSkipPausing
      },
      _react2.default.createElement(_AccessibleImage2.default, { className: "disable-pausing" })
    );
  }

  render() {
    return _react2.default.createElement(
      "div",
      {
        className: (0, _classnames2.default)("command-bar", {
          vertical: !this.props.horizontal
        })
      },
      this.renderPauseButton(),
      this.renderStepButtons(),
      this.renderTimeTravelButtons(),
      _react2.default.createElement("div", { className: "filler" }),
      this.renderSkipPausingButton()
    );
  }
}

CommandBar.contextTypes = {
  shortcuts: _propTypes2.default.object
};

const mapStateToProps = state => ({
  cx: (0, _selectors.getThreadContext)(state),
  isWaitingOnBreak: (0, _selectors.getIsWaitingOnBreak)(state, (0, _selectors.getCurrentThread)(state)),
  canRewind: (0, _selectors.getCanRewind)(state),
  skipPausing: (0, _selectors.getSkipPausing)(state)
});

exports.default = (0, _connect.connect)(mapStateToProps, {
  resume: _actions2.default.resume,
  stepIn: _actions2.default.stepIn,
  stepOut: _actions2.default.stepOut,
  stepOver: _actions2.default.stepOver,
  breakOnNext: _actions2.default.breakOnNext,
  rewind: _actions2.default.rewind,
  reverseStepOver: _actions2.default.reverseStepOver,
  pauseOnExceptions: _actions2.default.pauseOnExceptions,
  toggleSkipPausing: _actions2.default.toggleSkipPausing
})(CommandBar);