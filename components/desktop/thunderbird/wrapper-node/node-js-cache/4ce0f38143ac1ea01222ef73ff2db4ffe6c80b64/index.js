"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _reactDomFactories = require("devtools/client/shared/vendor/react-dom-factories");

var _reactPropTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

var _reactRedux = require("devtools/client/shared/vendor/react-redux");

var _ExceptionOption = _interopRequireDefault(require("./ExceptionOption"));

var _Breakpoint = _interopRequireDefault(require("./Breakpoint"));

var _BreakpointHeading = _interopRequireDefault(require("./BreakpointHeading"));

var _index = _interopRequireDefault(require("../../../actions/index"));

loader.lazyRequireGetter(this, "_selectedLocation", "devtools/client/debugger/src/utils/selected-location");
loader.lazyRequireGetter(this, "_createEditor", "devtools/client/debugger/src/utils/editor/create-editor");
loader.lazyRequireGetter(this, "_index2", "devtools/client/debugger/src/utils/breakpoint/index");
loader.lazyRequireGetter(this, "_index3", "devtools/client/debugger/src/selectors/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const classnames = require("resource://devtools/client/shared/classnames.js");

class Breakpoints extends _react.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "togglePauseOnDebuggerStatement", () => {
      this.props.pauseOnDebuggerStatement(!this.props.shouldPauseOnDebuggerStatement);
    });

    _defineProperty(this, "togglePauseOnException", () => {
      this.props.pauseOnExceptions(!this.props.shouldPauseOnExceptions, false);
    });

    _defineProperty(this, "togglePauseOnCaughtException", () => {
      this.props.pauseOnExceptions(true, !this.props.shouldPauseOnCaughtExceptions);
    });
  }

  static get propTypes() {
    return {
      breakpointSources: _reactPropTypes.default.array.isRequired,
      pauseOnExceptions: _reactPropTypes.default.func.isRequired,
      selectedSource: _reactPropTypes.default.object,
      shouldPauseOnDebuggerStatement: _reactPropTypes.default.bool.isRequired,
      shouldPauseOnCaughtExceptions: _reactPropTypes.default.bool.isRequired,
      shouldPauseOnExceptions: _reactPropTypes.default.bool.isRequired
    };
  }

  componentWillUnmount() {
    this.removeEditor();
  }
  /**
   * Get an headless editor that can be used for syntax highlighting
   *
   * @returns {CodeMirror}
   */


  getHeadlessEditor() {
    if (!this.headlessEditor) {
      this.headlessEditor = (0, _createEditor.createHeadlessEditor)();
    }

    return this.headlessEditor;
  }

  removeEditor() {
    if (!this.headlessEditor) {
      return;
    }

    this.headlessEditor.destroy();
    this.headlessEditor = null;
  }

  renderExceptionsOptions() {
    const {
      breakpointSources,
      shouldPauseOnDebuggerStatement,
      shouldPauseOnExceptions,
      shouldPauseOnCaughtExceptions
    } = this.props;
    const isEmpty = !breakpointSources.length;
    return (0, _reactDomFactories.div)({
      className: classnames("breakpoints-options", {
        empty: isEmpty
      })
    }, _react.default.createElement(_ExceptionOption.default, {
      className: "breakpoints-debugger-statement",
      label: L10N.getStr("pauseOnDebuggerStatement"),
      isChecked: shouldPauseOnDebuggerStatement,
      onChange: this.togglePauseOnDebuggerStatement
    }), _react.default.createElement(_ExceptionOption.default, {
      className: "breakpoints-exceptions",
      label: L10N.getStr("pauseOnExceptionsItem2"),
      isChecked: shouldPauseOnExceptions,
      onChange: this.togglePauseOnException
    }), shouldPauseOnExceptions && _react.default.createElement(_ExceptionOption.default, {
      className: "breakpoints-exceptions-caught",
      label: L10N.getStr("pauseOnCaughtExceptionsItem"),
      isChecked: shouldPauseOnCaughtExceptions,
      onChange: this.togglePauseOnCaughtException
    }));
  }

  renderBreakpoints() {
    const {
      breakpointSources,
      selectedSource
    } = this.props;

    if (!breakpointSources.length) {
      return null;
    } // We need to create a specific editor instance to handle cases where we don't have
    // any editor opened yet.


    const editor = this.getHeadlessEditor();
    const sources = breakpointSources.map(({
      source
    }) => source);
    return (0, _reactDomFactories.div)({
      className: "pane breakpoints-list"
    }, breakpointSources.map(({
      source,
      breakpoints
    }) => {
      return [_react.default.createElement(_BreakpointHeading.default, {
        key: source.id,
        source,
        sources
      }), breakpoints.map(breakpoint => _react.default.createElement(_Breakpoint.default, {
        breakpoint,
        source,
        editor,
        key: (0, _index2.makeBreakpointId)((0, _selectedLocation.getSelectedLocation)(breakpoint, selectedSource))
      }))];
    }));
  }

  render() {
    return (0, _reactDomFactories.div)({
      className: "pane"
    }, this.renderExceptionsOptions(), this.renderBreakpoints());
  }

}

const mapStateToProps = state => ({
  breakpointSources: (0, _index3.getBreakpointSources)(state),
  selectedSource: (0, _index3.getSelectedSource)(state),
  shouldPauseOnDebuggerStatement: (0, _index3.getShouldPauseOnDebuggerStatement)(state),
  shouldPauseOnExceptions: (0, _index3.getShouldPauseOnExceptions)(state),
  shouldPauseOnCaughtExceptions: (0, _index3.getShouldPauseOnCaughtExceptions)(state)
});

var _default = (0, _reactRedux.connect)(mapStateToProps, {
  pauseOnDebuggerStatement: _index.default.pauseOnDebuggerStatement,
  pauseOnExceptions: _index.default.pauseOnExceptions
})(Breakpoints);

exports.default = _default;