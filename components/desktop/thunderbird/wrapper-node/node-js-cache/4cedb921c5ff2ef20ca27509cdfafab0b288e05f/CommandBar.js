"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _reactDomFactories = require("devtools/client/shared/vendor/react-dom-factories");

var _reactPropTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

var _reactRedux = require("devtools/client/shared/vendor/react-redux");

loader.lazyRequireGetter(this, "_prefs", "devtools/client/debugger/src/utils/prefs");
loader.lazyRequireGetter(this, "_index", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_text", "devtools/client/debugger/src/utils/text");

var _index2 = _interopRequireDefault(require("../../actions/index"));

loader.lazyRequireGetter(this, "_CommandBarButton", "devtools/client/debugger/src/components/shared/Button/CommandBarButton");

var _AccessibleImage = _interopRequireDefault(require("../shared/AccessibleImage"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
const classnames = require("resource://devtools/client/shared/classnames.js");

const MenuButton = require("resource://devtools/client/shared/components/menu/MenuButton.js");

const MenuItem = require("resource://devtools/client/shared/components/menu/MenuItem.js");

const MenuList = require("resource://devtools/client/shared/components/menu/MenuList.js");

const isMacOS = Services.appinfo.OS === "Darwin"; // NOTE: the "resume" command will call either the resume or breakOnNext action
// depending on whether or not the debugger is paused or running

const COMMANDS = ["resume", "stepOver", "stepIn", "stepOut"];
const KEYS = {
  WINNT: {
    resume: "F8",
    stepOver: "F10",
    stepIn: "F11",
    stepOut: "Shift+F11",
    trace: "Ctrl+Shift+5"
  },
  Darwin: {
    resume: "Cmd+\\",
    stepOver: "Cmd+'",
    stepIn: "Cmd+;",
    stepOut: "Cmd+Shift+:",
    stepOutDisplay: "Cmd+Shift+;",
    trace: "Ctrl+Shift+5"
  },
  Linux: {
    resume: "F8",
    stepOver: "F10",
    stepIn: "F11",
    stepOut: "Shift+F11",
    trace: "Ctrl+Shift+5"
  }
};

function getKey(action) {
  return getKeyForOS(Services.appinfo.OS, action);
}

function getKeyForOS(os, action) {
  const osActions = KEYS[os] || KEYS.Linux;
  return osActions[action];
}

function formatKey(action) {
  const key = getKey(`${action}Display`) || getKey(action); // On MacOS, we bind both Windows and MacOS/Darwin key shortcuts
  // Display them both, but only when they are different

  if (isMacOS) {
    const winKey = getKeyForOS("WINNT", `${action}Display`) || getKeyForOS("WINNT", action);

    if (key != winKey) {
      return (0, _text.formatKeyShortcut)([key, winKey].join(" "));
    }
  }

  return (0, _text.formatKeyShortcut)(key);
}

class CommandBar extends _react.Component {
  constructor() {
    super();
    this.state = {};
  }

  static get propTypes() {
    return {
      breakOnNext: _reactPropTypes.default.func.isRequired,
      horizontal: _reactPropTypes.default.bool.isRequired,
      isPaused: _reactPropTypes.default.bool.isRequired,
      isWaitingOnBreak: _reactPropTypes.default.bool.isRequired,
      javascriptEnabled: _reactPropTypes.default.bool.isRequired,
      resume: _reactPropTypes.default.func.isRequired,
      skipPausing: _reactPropTypes.default.bool.isRequired,
      stepIn: _reactPropTypes.default.func.isRequired,
      stepOut: _reactPropTypes.default.func.isRequired,
      stepOver: _reactPropTypes.default.func.isRequired,
      toggleEditorWrapping: _reactPropTypes.default.func.isRequired,
      toggleInlinePreview: _reactPropTypes.default.func.isRequired,
      toggleJavaScriptEnabled: _reactPropTypes.default.func.isRequired,
      toggleSkipPausing: _reactPropTypes.default.any.isRequired,
      toggleSourceMapsEnabled: _reactPropTypes.default.func.isRequired,
      topFrameSelected: _reactPropTypes.default.bool.isRequired,
      setHideOrShowIgnoredSources: _reactPropTypes.default.func.isRequired,
      toggleSourceMapIgnoreList: _reactPropTypes.default.func.isRequired
    };
  }

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
    COMMANDS.forEach(action => shortcuts.on(getKey(action), e => this.handleEvent(e, action)));

    if (isMacOS) {
      // The Mac supports both the Windows Function keys
      // as well as the Mac non-Function keys
      COMMANDS.forEach(action => shortcuts.on(getKeyForOS("WINNT", action), e => this.handleEvent(e, action)));
    }
  }

  handleEvent(e, action) {
    e.preventDefault();
    e.stopPropagation();

    if (action === "resume") {
      this.props.isPaused ? this.props.resume() : this.props.breakOnNext();
    } else {
      this.props[action]();
    }
  }

  renderStepButtons() {
    const {
      isPaused,
      topFrameSelected
    } = this.props;
    const className = isPaused ? "active" : "disabled";
    const isDisabled = !isPaused;
    return [this.renderPauseButton(), (0, _CommandBarButton.debugBtn)(() => this.props.stepOver(), "stepOver", className, L10N.getFormatStr("stepOverTooltip", formatKey("stepOver")), isDisabled), (0, _CommandBarButton.debugBtn)(() => this.props.stepIn(), "stepIn", className, L10N.getFormatStr("stepInTooltip", formatKey("stepIn")), isDisabled || !topFrameSelected), (0, _CommandBarButton.debugBtn)(() => this.props.stepOut(), "stepOut", className, L10N.getFormatStr("stepOutTooltip", formatKey("stepOut")), isDisabled)];
  }

  resume() {
    this.props.resume();
  }

  renderPauseButton() {
    const {
      breakOnNext,
      isWaitingOnBreak
    } = this.props;

    if (this.props.isPaused) {
      return (0, _CommandBarButton.debugBtn)(() => this.resume(), "resume", "active", L10N.getFormatStr("resumeButtonTooltip", formatKey("resume")));
    }

    if (isWaitingOnBreak) {
      return (0, _CommandBarButton.debugBtn)(null, "pause", "disabled", L10N.getStr("pausePendingButtonTooltip"), true);
    }

    return (0, _CommandBarButton.debugBtn)(() => breakOnNext(), "pause", "active", L10N.getFormatStr("pauseButtonTooltip", formatKey("resume")));
  }

  renderSkipPausingButton() {
    const {
      skipPausing,
      toggleSkipPausing
    } = this.props;
    return (0, _reactDomFactories.button)({
      className: classnames("command-bar-button", "command-bar-skip-pausing", {
        active: skipPausing
      }),
      title: skipPausing ? L10N.getStr("undoSkipPausingTooltip.label") : L10N.getStr("skipPausingTooltip.label"),
      onClick: toggleSkipPausing
    }, _react.default.createElement(_AccessibleImage.default, {
      className: skipPausing ? "enable-pausing" : "disable-pausing"
    }));
  }

  renderSettingsButton() {
    const {
      toolboxDoc
    } = this.context;
    return _react.default.createElement(MenuButton, {
      menuId: "debugger-settings-menu-button",
      toolboxDoc,
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
      key: "debugger-settings-menu-item-disable-wrap-lines",
      checked: _prefs.prefs.editorWrapping,
      label: L10N.getStr("editorWrapping.toggle.label"),
      tooltip: L10N.getStr("editorWrapping.toggle.tooltip"),
      onClick: () => this.props.toggleEditorWrapping(!_prefs.prefs.editorWrapping)
    }), _react.default.createElement(MenuItem, {
      key: "debugger-settings-menu-item-disable-sourcemaps",
      checked: _prefs.prefs.clientSourceMapsEnabled,
      label: L10N.getStr("settings.toggleSourceMaps.label"),
      tooltip: L10N.getStr("settings.toggleSourceMaps.tooltip"),
      onClick: () => this.props.toggleSourceMapsEnabled(!_prefs.prefs.clientSourceMapsEnabled)
    }), _react.default.createElement(MenuItem, {
      key: "debugger-settings-menu-item-hide-ignored-sources",
      className: "menu-item debugger-settings-menu-item-hide-ignored-sources",
      checked: _prefs.prefs.hideIgnoredSources,
      label: L10N.getStr("settings.hideIgnoredSources.label"),
      tooltip: L10N.getStr("settings.hideIgnoredSources.tooltip"),
      onClick: () => this.props.setHideOrShowIgnoredSources(!_prefs.prefs.hideIgnoredSources)
    }), _react.default.createElement(MenuItem, {
      key: "debugger-settings-menu-item-enable-sourcemap-ignore-list",
      className: "menu-item debugger-settings-menu-item-enable-sourcemap-ignore-list",
      checked: _prefs.prefs.sourceMapIgnoreListEnabled,
      label: L10N.getStr("settings.enableSourceMapIgnoreList.label"),
      tooltip: L10N.getStr("settings.enableSourceMapIgnoreList.tooltip"),
      onClick: () => this.props.toggleSourceMapIgnoreList(!_prefs.prefs.sourceMapIgnoreListEnabled)
    }));
  }

  render() {
    return (0, _reactDomFactories.div)({
      className: classnames("command-bar", {
        vertical: !this.props.horizontal
      })
    }, this.renderStepButtons(), (0, _reactDomFactories.div)({
      className: "filler"
    }), this.renderSkipPausingButton(), (0, _reactDomFactories.div)({
      className: "devtools-separator"
    }), this.renderSettingsButton());
  }

}

CommandBar.contextTypes = {
  shortcuts: _reactPropTypes.default.object,
  toolboxDoc: _reactPropTypes.default.object
};

const mapStateToProps = state => ({
  isWaitingOnBreak: (0, _index.getIsWaitingOnBreak)(state, (0, _index.getCurrentThread)(state)),
  skipPausing: (0, _index.getSkipPausing)(state),
  topFrameSelected: (0, _index.isTopFrameSelected)(state, (0, _index.getCurrentThread)(state)),
  javascriptEnabled: state.ui.javascriptEnabled,
  isPaused: (0, _index.getIsCurrentThreadPaused)(state)
});

var _default = (0, _reactRedux.connect)(mapStateToProps, {
  resume: _index2.default.resume,
  stepIn: _index2.default.stepIn,
  stepOut: _index2.default.stepOut,
  stepOver: _index2.default.stepOver,
  breakOnNext: _index2.default.breakOnNext,
  pauseOnExceptions: _index2.default.pauseOnExceptions,
  toggleSkipPausing: _index2.default.toggleSkipPausing,
  toggleInlinePreview: _index2.default.toggleInlinePreview,
  toggleEditorWrapping: _index2.default.toggleEditorWrapping,
  toggleSourceMapsEnabled: _index2.default.toggleSourceMapsEnabled,
  toggleJavaScriptEnabled: _index2.default.toggleJavaScriptEnabled,
  setHideOrShowIgnoredSources: _index2.default.setHideOrShowIgnoredSources,
  toggleSourceMapIgnoreList: _index2.default.toggleSourceMapIgnoreList
})(CommandBar);

exports.default = _default;