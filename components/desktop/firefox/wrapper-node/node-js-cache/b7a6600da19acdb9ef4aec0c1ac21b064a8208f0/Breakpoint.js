"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _reactDomFactories = require("devtools/client/shared/vendor/react-dom-factories");

var _reactPropTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

var _reactRedux = require("devtools/client/shared/vendor/react-redux");

var _index = _interopRequireDefault(require("../../../actions/index"));

loader.lazyRequireGetter(this, "_index2", "devtools/client/debugger/src/components/shared/Button/index");
loader.lazyRequireGetter(this, "_index3", "devtools/client/debugger/src/utils/breakpoint/index");
loader.lazyRequireGetter(this, "_selectedLocation", "devtools/client/debugger/src/utils/selected-location");
loader.lazyRequireGetter(this, "_source", "devtools/client/debugger/src/utils/source");
loader.lazyRequireGetter(this, "_index4", "devtools/client/debugger/src/selectors/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const classnames = require("resource://devtools/client/shared/classnames.js");

class Breakpoint extends _react.PureComponent {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "onContextMenu", event => {
      event.preventDefault();
      this.props.showBreakpointContextMenu(event, this.props.breakpoint, this.props.source);
    });

    _defineProperty(this, "stopClicks", event => event.stopPropagation());

    _defineProperty(this, "onDoubleClick", () => {
      const {
        breakpoint,
        openConditionalPanel
      } = this.props;

      if (breakpoint.options.condition) {
        openConditionalPanel(this.props.selectedBreakpointLocation);
      } else if (breakpoint.options.logValue) {
        openConditionalPanel(this.props.selectedBreakpointLocation, true);
      }
    });

    _defineProperty(this, "onKeyDown", event => {
      // Handling only the Enter/Space keys, bail if another key was pressed
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }

      if (event.shiftKey) {
        this.onDoubleClick();
        return;
      }

      this.selectBreakpoint(event);
    });

    _defineProperty(this, "selectBreakpoint", event => {
      event.preventDefault();
      const {
        selectSpecificLocation
      } = this.props;
      selectSpecificLocation(this.props.selectedBreakpointLocation);
    });

    _defineProperty(this, "removeBreakpoint", event => {
      const {
        removeBreakpoint,
        breakpoint
      } = this.props;
      event.stopPropagation();
      removeBreakpoint(breakpoint);
    });

    _defineProperty(this, "handleBreakpointCheckbox", () => {
      const {
        breakpoint,
        enableBreakpoint,
        disableBreakpoint
      } = this.props;

      if (breakpoint.disabled) {
        enableBreakpoint(breakpoint);
      } else {
        disableBreakpoint(breakpoint);
      }
    });
  }

  static get propTypes() {
    return {
      breakpoint: _reactPropTypes.default.object.isRequired,
      disableBreakpoint: _reactPropTypes.default.func.isRequired,
      editor: _reactPropTypes.default.object.isRequired,
      enableBreakpoint: _reactPropTypes.default.func.isRequired,
      openConditionalPanel: _reactPropTypes.default.func.isRequired,
      removeBreakpoint: _reactPropTypes.default.func.isRequired,
      selectSpecificLocation: _reactPropTypes.default.func.isRequired,
      selectedBreakpointLocation: _reactPropTypes.default.object.isRequired,
      isCurrentlyPausedAtBreakpoint: _reactPropTypes.default.bool.isRequired,
      source: _reactPropTypes.default.object.isRequired,
      checkSourceOnIgnoreList: _reactPropTypes.default.func.isRequired,
      isBreakpointLineBlackboxed: _reactPropTypes.default.bool,
      showBreakpointContextMenu: _reactPropTypes.default.func.isRequired,
      breakpointText: _reactPropTypes.default.string.isRequired
    };
  }

  getBreakpointLocation() {
    const {
      source
    } = this.props;
    const {
      column,
      line
    } = this.props.selectedBreakpointLocation;
    const isWasm = source?.isWasm; // column is 0-based everywhere, but we want to display 1-based to the user.

    const columnVal = column ? `:${column + 1}` : "";
    const bpLocation = isWasm ? `0x${line.toString(16).toUpperCase()}` : `${line}${columnVal}`;
    return bpLocation;
  }

  highlightText(text = "", editor) {
    const htmlString = editor.highlightText(document, text);
    return {
      __html: htmlString
    };
  }

  render() {
    const {
      breakpoint,
      editor,
      isBreakpointLineBlackboxed,
      breakpointText
    } = this.props;
    const labelId = `${breakpoint.id}-label`;
    return (0, _reactDomFactories.div)({
      className: classnames({
        breakpoint,
        paused: this.props.isCurrentlyPausedAtBreakpoint,
        disabled: breakpoint.disabled,
        "is-conditional": !!breakpoint.options.condition,
        "is-log": !!breakpoint.options.logValue
      }),
      onClick: this.selectBreakpoint,
      onDoubleClick: this.onDoubleClick,
      onContextMenu: this.onContextMenu,
      onKeyDown: this.onKeyDown,
      role: "button",
      tabIndex: 0,
      title: breakpointText
    }, (0, _reactDomFactories.input)({
      id: breakpoint.id,
      type: "checkbox",
      className: "breakpoint-checkbox",
      checked: !breakpoint.disabled,
      disabled: isBreakpointLineBlackboxed,
      onChange: this.handleBreakpointCheckbox,
      onClick: this.stopClicks,
      "aria-labelledby": labelId
    }), (0, _reactDomFactories.span)({
      id: labelId,
      className: "breakpoint-label cm-s-mozilla devtools-monospace",
      onClick: this.selectBreakpoint
    }, (0, _reactDomFactories.span)({
      className: "cm-highlighted",
      dangerouslySetInnerHTML: this.highlightText(breakpointText, editor)
    })), (0, _reactDomFactories.div)({
      className: "breakpoint-line-close"
    }, (0, _reactDomFactories.div)({
      className: "breakpoint-line devtools-monospace"
    }, this.getBreakpointLocation()), _react.default.createElement(_index2.CloseButton, {
      handleClick: this.removeBreakpoint,
      tooltip: L10N.getStr("breakpoints.removeBreakpointTooltip")
    })));
  }

}

function isCurrentlyPausedAtBreakpoint(state, selectedBreakpointLocation, selectedSource) {
  const frame = (0, _index4.getSelectedFrame)(state);

  if (!frame) {
    return false;
  }

  const bpId = (0, _index3.makeBreakpointId)(selectedBreakpointLocation);
  const frameId = (0, _index3.makeBreakpointId)((0, _selectedLocation.getSelectedLocation)(frame, selectedSource));
  return bpId == frameId;
}

function getBreakpointText(breakpoint, selectedSource) {
  const {
    condition,
    logValue
  } = breakpoint.options;
  return logValue || condition || (0, _index3.getSelectedText)(breakpoint, selectedSource);
}

const mapStateToProps = (state, props) => {
  const {
    breakpoint,
    source
  } = props;
  const selectedSource = (0, _index4.getSelectedSource)(state);
  const selectedBreakpointLocation = (0, _selectedLocation.getSelectedLocation)(breakpoint, selectedSource);
  const blackboxedRangesForSource = (0, _index4.getBlackBoxRanges)(state)[source.url];
  const isSourceOnIgnoreList = (0, _index4.isSourceMapIgnoreListEnabled)(state) && (0, _index4.isSourceOnSourceMapIgnoreList)(state, source);
  return {
    selectedBreakpointLocation,
    isCurrentlyPausedAtBreakpoint: isCurrentlyPausedAtBreakpoint(state, selectedBreakpointLocation, selectedSource),
    isBreakpointLineBlackboxed: (0, _source.isLineBlackboxed)(blackboxedRangesForSource, breakpoint.location.line, isSourceOnIgnoreList),
    breakpointText: getBreakpointText(breakpoint, selectedSource)
  };
};

var _default = (0, _reactRedux.connect)(mapStateToProps, {
  enableBreakpoint: _index.default.enableBreakpoint,
  removeBreakpoint: _index.default.removeBreakpoint,
  disableBreakpoint: _index.default.disableBreakpoint,
  selectSpecificLocation: _index.default.selectSpecificLocation,
  openConditionalPanel: _index.default.openConditionalPanel,
  showBreakpointContextMenu: _index.default.showBreakpointContextMenu
})(Breakpoint);

exports.default = _default;