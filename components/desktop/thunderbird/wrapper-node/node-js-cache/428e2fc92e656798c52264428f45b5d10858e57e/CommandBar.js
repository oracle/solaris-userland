"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _propTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

loader.lazyRequireGetter(this, "_connect", "devtools/client/debugger/src/utils/connect");

var _classnames = _interopRequireDefault(require("devtools/client/debugger/dist/vendors").vendored["classnames"]);

loader.lazyRequireGetter(this, "_prefs", "devtools/client/debugger/src/utils/prefs");
loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_text", "devtools/client/debugger/src/utils/text");

var _actions = _interopRequireDefault(require("../../actions/index"));

loader.lazyRequireGetter(this, "_CommandBarButton", "devtools/client/debugger/src/components/shared/Button/CommandBarButton");

var _AccessibleImage = _interopRequireDefault(require("../shared/AccessibleImage"));

loader.lazyRequireGetter(this, "_devtoolsServices", "Services");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
// $FlowIgnore
const MenuButton = require("devtools/client/shared/components/menu/MenuButton"); // $FlowIgnore


const MenuItem = require("devtools/client/shared/components/menu/MenuItem"); // $FlowIgnore


const MenuList = require("devtools/client/shared/components/menu/MenuList");

const isMacOS = _devtoolsServices.appinfo.OS === "Darwin"; // NOTE: the "resume" command will call either the resume or breakOnNext action
// depending on whether or not the debugger is paused or running

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
    const winKey = getKeyForOS("WINNT", `${action}Display`) || getKeyForOS("WINNT", action); // display both Windows type and Mac specific keys

    return (0, _text.formatKeyShortcut)([key, winKey].join(" "));
  }

  return (0, _text.formatKeyShortcut)(key);
}

class CommandBar extends _react.Component {
  componentWillUnmount() {
    const {
      shortcuts
    } = this.context;
    COMMANDS.forEach(action => shortcuts.off(getKey(action)));

    if (isMacOS) {
      COMMANDS.forEach(action => shortcuts.off(getKeyForOS("WINNT", action)));
    }
  }

  componentDidMount() {
    const {
      shortcuts
    } = this.context;
    COMMANDS.forEach(action => shortcuts.on(getKey(action), (_, e) => this.handleEvent(e, action)));

    if (isMacOS) {
      // The Mac supports both the Windows Function keys
      // as well as the Mac non-Function keys
      COMMANDS.forEach(action => shortcuts.on(getKeyForOS("WINNT", action), (_, e) => this.handleEvent(e, action)));
    }
  }

  handleEvent(e, action) {
    const {
      cx
    } = this.props;
    e.preventDefault();
    e.stopPropagation();

    if (action === "resume") {
      this.props.cx.isPaused ? this.props.resume(cx) : this.props.breakOnNext(cx);
    } else {
      this.props[action](cx);
    }
  }

  renderStepButtons() {
    const {
      cx,
      topFrameSelected
    } = this.props;
    const className = cx.isPaused ? "active" : "disabled";
    const isDisabled = !cx.isPaused;
    return [this.renderPauseButton(), (0, _CommandBarButton.debugBtn)(() => this.props.stepOver(cx), "stepOver", className, L10N.getFormatStr("stepOverTooltip", formatKey("stepOver")), isDisabled), (0, _CommandBarButton.debugBtn)(() => this.props.stepIn(cx), "stepIn", className, L10N.getFormatStr("stepInTooltip", formatKey("stepIn")), isDisabled || _prefs.features.frameStep && !topFrameSelected), (0, _CommandBarButton.debugBtn)(() => this.props.stepOut(cx), "stepOut", className, L10N.getFormatStr("stepOutTooltip", formatKey("stepOut")), isDisabled)];
  }

  resume() {
    this.props.resume(this.props.cx);
  }

  renderPauseButton() {
    const {
      cx,
      breakOnNext,
      isWaitingOnBreak
    } = this.props;

    if (cx.isPaused) {
      return (0, _CommandBarButton.debugBtn)(() => this.resume(), "resume", "active", L10N.getFormatStr("resumeButtonTooltip", formatKey("resume")));
    }

    if (isWaitingOnBreak) {
      return (0, _CommandBarButton.debugBtn)(null, "pause", "disabled", L10N.getStr("pausePendingButtonTooltip"), true);
    }

    return (0, _CommandBarButton.debugBtn)(() => breakOnNext(cx), "pause", "active", L10N.getFormatStr("pauseButtonTooltip", formatKey("resume")));
  }

  renderSkipPausingButton() {
    const {
      skipPausing,
      toggleSkipPausing
    } = this.props;

    if (!_prefs.features.skipPausing) {
      return null;
    }

    return _react.default.createElement("button", {
      className: (0, _classnames.default)("command-bar-button", "command-bar-skip-pausing", {
        active: skipPausing
      }),
      title: skipPausing ? L10N.getStr("undoSkipPausingTooltip.label") : L10N.getStr("skipPausingTooltip.label"),
      onClick: toggleSkipPausing
    }, _react.default.createElement(_AccessibleImage.default, {
      className: "disable-pausing"
    }));
  }

  renderSettingsButton() {
    const {
      toolboxDoc
    } = this.context;
    return _react.default.createElement(MenuButton, {
      menuId: "debugger-settings-menu-button",
      toolboxDoc: toolboxDoc,
      className: "devtools-button command-bar-button debugger-settings-menu-button",
      title: L10N.getStr("settings.button.label")
    }, () => this.renderSettingsMenuItems());
  }

  renderSettingsMenuItems() {
    return _react.default.createElement(MenuList, {
      id: "debugger-settings-menu-list"
    }, _react.default.createElement(MenuItem, {
      key: "debugger-settings-menu-item-disable-javascript",
      className: "menu-item debugger-settings-menu-item-disable-javascript",
      checked: !this.props.javascriptEnabled,
      label: L10N.getStr("settings.disableJavaScript.label"),
      tooltip: L10N.getStr("settings.disableJavaScript.tooltip"),
      onClick: () => {
        this.props.toggleJavaScriptEnabled(!this.props.javascriptEnabled);
      }
    }), _react.default.createElement(MenuItem, {
      key: "debugger-settings-menu-item-disable-inline-previews",
      checked: _prefs.features.inlinePreview,
      label: L10N.getStr("inlinePreview.toggle.label"),
      tooltip: L10N.getStr("inlinePreview.toggle.tooltip"),
      onClick: () => this.props.toggleInlinePreview(!_prefs.features.inlinePreview)
    }), _react.default.createElement(MenuItem, {
      key: "debugger-settings-menu-item-disable-sourcemaps",
      checked: _prefs.prefs.clientSourceMapsEnabled,
      label: L10N.getStr("settings.toggleSourceMaps.label"),
      tooltip: L10N.getStr("settings.toggleSourceMaps.tooltip"),
      onClick: () => this.props.toggleSourceMapsEnabled(!_prefs.prefs.clientSourceMapsEnabled)
    }));
  }

  render() {
    return _react.default.createElement("div", {
      className: (0, _classnames.default)("command-bar", {
        vertical: !this.props.horizontal
      })
    }, this.renderStepButtons(), _react.default.createElement("div", {
      className: "filler"
    }), this.renderSkipPausingButton(), _react.default.createElement("div", {
      className: "devtools-separator"
    }), this.renderSettingsButton());
  }

}

CommandBar.contextTypes = {
  shortcuts: _propTypes.default.object,
  toolboxDoc: _propTypes.default.object
};

const mapStateToProps = state => ({
  cx: (0, _selectors.getThreadContext)(state),
  isWaitingOnBreak: (0, _selectors.getIsWaitingOnBreak)(state, (0, _selectors.getCurrentThread)(state)),
  skipPausing: (0, _selectors.getSkipPausing)(state),
  topFrameSelected: (0, _selectors.isTopFrameSelected)(state, (0, _selectors.getCurrentThread)(state)),
  javascriptEnabled: state.ui.javascriptEnabled
});

var _default = (0, _connect.connect)(mapStateToProps, {
  resume: _actions.default.resume,
  stepIn: _actions.default.stepIn,
  stepOut: _actions.default.stepOut,
  stepOver: _actions.default.stepOver,
  breakOnNext: _actions.default.breakOnNext,
  pauseOnExceptions: _actions.default.pauseOnExceptions,
  toggleSkipPausing: _actions.default.toggleSkipPausing,
  toggleInlinePreview: _actions.default.toggleInlinePreview,
  toggleSourceMapsEnabled: _actions.default.toggleSourceMapsEnabled,
  toggleJavaScriptEnabled: _actions.default.toggleJavaScriptEnabled
})(CommandBar);

exports.default = _default;