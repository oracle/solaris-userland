"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

loader.lazyRequireGetter(this, "_connect", "devtools/client/debugger/src/utils/connect");

var _reselect = require("devtools/client/shared/vendor/reselect");

var _classnames = _interopRequireDefault(require("devtools/client/debugger/dist/vendors").vendored["classnames"]);

var _actions = _interopRequireDefault(require("../../../actions/index"));

var _lodash = require("devtools/client/shared/vendor/lodash");

var _BreakpointsContextMenu = _interopRequireDefault(require("./BreakpointsContextMenu"));

loader.lazyRequireGetter(this, "_Button", "devtools/client/debugger/src/components/shared/Button/index");
loader.lazyRequireGetter(this, "_breakpoint", "devtools/client/debugger/src/utils/breakpoint/index");
loader.lazyRequireGetter(this, "_selectedLocation", "devtools/client/debugger/src/utils/selected-location");
loader.lazyRequireGetter(this, "_prefs", "devtools/client/debugger/src/utils/prefs");
loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Breakpoint extends _react.PureComponent {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "onContextMenu", e => {
      (0, _BreakpointsContextMenu.default)({ ...this.props,
        contextMenuEvent: e
      });
    });

    _defineProperty(this, "onDoubleClick", () => {
      const {
        breakpoint,
        openConditionalPanel
      } = this.props;

      if (breakpoint.options.condition) {
        openConditionalPanel(this.selectedLocation);
      } else if (breakpoint.options.logValue) {
        openConditionalPanel(this.selectedLocation, true);
      }
    });

    _defineProperty(this, "selectBreakpoint", event => {
      event.preventDefault();
      const {
        cx,
        selectSpecificLocation
      } = this.props;
      selectSpecificLocation(cx, this.selectedLocation);
    });

    _defineProperty(this, "removeBreakpoint", event => {
      const {
        cx,
        removeBreakpoint,
        breakpoint
      } = this.props;
      event.stopPropagation();
      removeBreakpoint(cx, breakpoint);
    });

    _defineProperty(this, "handleBreakpointCheckbox", () => {
      const {
        cx,
        breakpoint,
        enableBreakpoint,
        disableBreakpoint
      } = this.props;

      if (breakpoint.disabled) {
        enableBreakpoint(cx, breakpoint);
      } else {
        disableBreakpoint(cx, breakpoint);
      }
    });

    _defineProperty(this, "highlightText", (0, _lodash.memoize)((text = "", editor) => {
      const node = document.createElement("div");
      editor.CodeMirror.runMode(text, "application/javascript", node);
      return {
        __html: node.innerHTML
      };
    }, text => text));
  }

  get selectedLocation() {
    const {
      breakpoint,
      selectedSource
    } = this.props;
    return (0, _selectedLocation.getSelectedLocation)(breakpoint, selectedSource);
  }

  isCurrentlyPausedAtBreakpoint() {
    const {
      frame
    } = this.props;

    if (!frame) {
      return false;
    }

    const bpId = _prefs.features.columnBreakpoints ? (0, _breakpoint.makeBreakpointId)(this.selectedLocation) : (0, _breakpoint.getLocationWithoutColumn)(this.selectedLocation);
    const frameId = _prefs.features.columnBreakpoints ? (0, _breakpoint.makeBreakpointId)(frame.selectedLocation) : (0, _breakpoint.getLocationWithoutColumn)(frame.selectedLocation);
    return bpId == frameId;
  }

  getBreakpointLocation() {
    const {
      source
    } = this.props;
    const {
      column,
      line
    } = this.selectedLocation;
    const isWasm = source === null || source === void 0 ? void 0 : source.isWasm;
    const columnVal = _prefs.features.columnBreakpoints && column ? `:${column}` : "";
    const bpLocation = isWasm ? `0x${line.toString(16).toUpperCase()}` : `${line}${columnVal}`;
    return bpLocation;
  }

  getBreakpointText() {
    const {
      breakpoint,
      selectedSource
    } = this.props;
    const {
      condition,
      logValue
    } = breakpoint.options;
    return logValue || condition || (0, _breakpoint.getSelectedText)(breakpoint, selectedSource);
  }

  render() {
    const {
      breakpoint,
      editor
    } = this.props;
    const text = this.getBreakpointText();
    const labelId = `${breakpoint.id}-label`;
    return _react.default.createElement("div", {
      className: (0, _classnames.default)({
        breakpoint,
        paused: this.isCurrentlyPausedAtBreakpoint(),
        disabled: breakpoint.disabled,
        "is-conditional": !!breakpoint.options.condition,
        "is-log": !!breakpoint.options.logValue
      }),
      onClick: this.selectBreakpoint,
      onDoubleClick: this.onDoubleClick,
      onContextMenu: this.onContextMenu
    }, _react.default.createElement("input", {
      id: breakpoint.id,
      type: "checkbox",
      className: "breakpoint-checkbox",
      checked: !breakpoint.disabled,
      onChange: this.handleBreakpointCheckbox,
      onClick: ev => ev.stopPropagation(),
      "aria-labelledby": labelId
    }), _react.default.createElement("span", {
      id: labelId,
      className: "breakpoint-label cm-s-mozilla devtools-monospace",
      onClick: this.selectBreakpoint,
      title: text
    }, _react.default.createElement("span", {
      dangerouslySetInnerHTML: this.highlightText(text, editor)
    })), _react.default.createElement("div", {
      className: "breakpoint-line-close"
    }, _react.default.createElement("div", {
      className: "breakpoint-line devtools-monospace"
    }, this.getBreakpointLocation()), _react.default.createElement(_Button.CloseButton, {
      handleClick: e => this.removeBreakpoint(e),
      tooltip: L10N.getStr("breakpoints.removeBreakpointTooltip")
    })));
  }

}

const getFormattedFrame = (0, _reselect.createSelector)(_selectors.getSelectedSource, _selectors.getSelectedFrame, (selectedSource, frame) => {
  if (!frame) {
    return null;
  }

  return { ...frame,
    selectedLocation: (0, _selectedLocation.getSelectedLocation)(frame, selectedSource)
  };
});

const mapStateToProps = (state, p) => ({
  cx: (0, _selectors.getContext)(state),
  breakpoints: (0, _selectors.getBreakpointsList)(state),
  frame: getFormattedFrame(state, (0, _selectors.getCurrentThread)(state))
});

var _default = (0, _connect.connect)(mapStateToProps, {
  enableBreakpoint: _actions.default.enableBreakpoint,
  removeBreakpoint: _actions.default.removeBreakpoint,
  removeBreakpoints: _actions.default.removeBreakpoints,
  removeAllBreakpoints: _actions.default.removeAllBreakpoints,
  disableBreakpoint: _actions.default.disableBreakpoint,
  selectSpecificLocation: _actions.default.selectSpecificLocation,
  setBreakpointOptions: _actions.default.setBreakpointOptions,
  toggleAllBreakpoints: _actions.default.toggleAllBreakpoints,
  toggleBreakpoints: _actions.default.toggleBreakpoints,
  toggleDisabledBreakpoint: _actions.default.toggleDisabledBreakpoint,
  openConditionalPanel: _actions.default.openConditionalPanel
})(Breakpoint);

exports.default = _default;