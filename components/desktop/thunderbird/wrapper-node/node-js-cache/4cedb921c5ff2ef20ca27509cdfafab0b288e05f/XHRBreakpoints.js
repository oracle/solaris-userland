"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _reactDomFactories = require("devtools/client/shared/vendor/react-dom-factories");

var _reactPropTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

var _reactRedux = require("devtools/client/shared/vendor/react-redux");

var _index = _interopRequireDefault(require("../../actions/index"));

loader.lazyRequireGetter(this, "_index2", "devtools/client/debugger/src/components/shared/Button/index");
loader.lazyRequireGetter(this, "_index3", "devtools/client/debugger/src/selectors/index");

var _ExceptionOption = _interopRequireDefault(require("./Breakpoints/ExceptionOption"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const classnames = require("resource://devtools/client/shared/classnames.js"); // At present, the "Pause on any URL" checkbox creates an xhrBreakpoint
// of "ANY" with no path, so we can remove that before creating the list


function getExplicitXHRBreakpoints(xhrBreakpoints) {
  return xhrBreakpoints.filter(bp => bp.path !== "");
}

const xhrMethods = ["ANY", "GET", "POST", "PUT", "HEAD", "DELETE", "PATCH", "OPTIONS"];

class XHRBreakpoints extends _react.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "handleNewSubmit", e => {
      e.preventDefault();
      e.stopPropagation();

      const setXHRBreakpoint = function () {
        this.props.setXHRBreakpoint(this.state.inputValue, this.state.inputMethod);
        this.hideInput();
      }; // force update inputMethod in state for mochitest purposes
      // before setting XHR breakpoint


      this.setState({
        inputMethod: e.target.children[1].value
      }, setXHRBreakpoint);
    });

    _defineProperty(this, "handleExistingSubmit", e => {
      e.preventDefault();
      e.stopPropagation();
      const {
        editIndex,
        inputValue,
        inputMethod
      } = this.state;
      const {
        xhrBreakpoints
      } = this.props;
      const {
        path,
        method
      } = xhrBreakpoints[editIndex];

      if (path !== inputValue || method != inputMethod) {
        this.props.updateXHRBreakpoint(editIndex, inputValue, inputMethod);
      }

      this.hideInput();
    });

    _defineProperty(this, "handleChange", e => {
      this.setState({
        inputValue: e.target.value
      });
    });

    _defineProperty(this, "handleMethodChange", e => {
      this.setState({
        focused: true,
        editing: true,
        inputMethod: e.target.value
      });
    });

    _defineProperty(this, "hideInput", () => {
      if (this.state.clickedOnFormElement) {
        this.setState({
          focused: true,
          clickedOnFormElement: false
        });
      } else {
        this.setState({
          focused: false,
          editing: false,
          editIndex: -1,
          inputValue: "",
          inputMethod: "ANY"
        });
        this.props.onXHRAdded();
      }
    });

    _defineProperty(this, "onFocus", () => {
      this.setState({
        focused: true,
        editing: true
      });
    });

    _defineProperty(this, "onMouseDown", () => {
      this.setState({
        editing: false,
        clickedOnFormElement: true
      });
    });

    _defineProperty(this, "handleTab", e => {
      if (e.key !== "Tab") {
        return;
      }

      if (e.currentTarget.nodeName === "INPUT") {
        this.setState({
          clickedOnFormElement: true,
          editing: false
        });
      } else if (e.currentTarget.nodeName === "SELECT" && !e.shiftKey) {
        // The user has tabbed off the select and we should
        // cancel the edit
        this.hideInput();
      }
    });

    _defineProperty(this, "editExpression", index => {
      const {
        xhrBreakpoints
      } = this.props;
      const {
        path,
        method
      } = xhrBreakpoints[index];
      this.setState({
        inputValue: path,
        inputMethod: method,
        editing: true,
        editIndex: index
      });
    });

    _defineProperty(this, "handleCheckbox", index => {
      const {
        xhrBreakpoints,
        enableXHRBreakpoint,
        disableXHRBreakpoint
      } = this.props;
      const breakpoint = xhrBreakpoints[index];

      if (breakpoint.disabled) {
        enableXHRBreakpoint(index);
      } else {
        disableXHRBreakpoint(index);
      }
    });

    _defineProperty(this, "renderBreakpoint", breakpoint => {
      const {
        path,
        disabled,
        method
      } = breakpoint;
      const {
        editIndex
      } = this.state;
      const {
        removeXHRBreakpoint,
        xhrBreakpoints
      } = this.props; // The "pause on any" checkbox

      if (!path) {
        return null;
      } // Finds the xhrbreakpoint so as to not make assumptions about position


      const index = xhrBreakpoints.findIndex(bp => bp.path === path && bp.method === method);

      if (index === editIndex) {
        return this.renderXHRInput(this.handleExistingSubmit);
      }

      return (0, _reactDomFactories.li)({
        className: "xhr-container",
        key: `${path}-${method}`,
        title: path,
        onDoubleClick: () => this.editExpression(index)
      }, (0, _reactDomFactories.label)(null, _react.default.createElement("input", {
        type: "checkbox",
        className: "xhr-checkbox",
        checked: !disabled,
        onChange: () => this.handleCheckbox(index),
        onClick: ev => ev.stopPropagation()
      }), (0, _reactDomFactories.div)({
        className: "xhr-label-method"
      }, method), (0, _reactDomFactories.div)({
        className: "xhr-label-url"
      }, path), (0, _reactDomFactories.div)({
        className: "xhr-container__close-btn"
      }, _react.default.createElement(_index2.CloseButton, {
        handleClick: () => removeXHRBreakpoint(index)
      }))));
    });

    _defineProperty(this, "renderBreakpoints", explicitXhrBreakpoints => {
      const {
        showInput
      } = this.props;
      return _react.default.createElement(_react.default.Fragment, null, (0, _reactDomFactories.ul)({
        className: "pane expressions-list"
      }, explicitXhrBreakpoints.map(this.renderBreakpoint)), showInput && this.renderXHRInput(this.handleNewSubmit));
    });

    _defineProperty(this, "renderCheckbox", explicitXhrBreakpoints => {
      const {
        shouldPauseOnAny,
        togglePauseOnAny
      } = this.props;
      return (0, _reactDomFactories.div)({
        className: classnames("breakpoints-options", {
          empty: explicitXhrBreakpoints.length === 0
        })
      }, _react.default.createElement(_ExceptionOption.default, {
        className: "breakpoints-exceptions",
        label: L10N.getStr("pauseOnAnyXHR"),
        isChecked: shouldPauseOnAny,
        onChange: () => togglePauseOnAny()
      }));
    });

    _defineProperty(this, "renderMethodOption", method => {
      return (0, _reactDomFactories.option)({
        key: method,
        value: method,
        // e.stopPropagation() required here since otherwise Firefox triggers 2x
        // onMouseDown events on <select> upon clicking on an <option>
        onMouseDown: e => e.stopPropagation()
      }, method);
    });

    _defineProperty(this, "renderMethodSelectElement", () => {
      return (0, _reactDomFactories.select)({
        value: this.state.inputMethod,
        className: "xhr-input-method",
        onChange: this.handleMethodChange,
        onMouseDown: this.onMouseDown,
        onKeyDown: this.handleTab
      }, xhrMethods.map(this.renderMethodOption));
    });

    this.state = {
      editing: false,
      inputValue: "",
      inputMethod: "ANY",
      focused: false,
      editIndex: -1,
      clickedOnFormElement: false
    };
  }

  static get propTypes() {
    return {
      disableXHRBreakpoint: _reactPropTypes.default.func.isRequired,
      enableXHRBreakpoint: _reactPropTypes.default.func.isRequired,
      onXHRAdded: _reactPropTypes.default.func.isRequired,
      removeXHRBreakpoint: _reactPropTypes.default.func.isRequired,
      setXHRBreakpoint: _reactPropTypes.default.func.isRequired,
      shouldPauseOnAny: _reactPropTypes.default.bool.isRequired,
      showInput: _reactPropTypes.default.bool.isRequired,
      togglePauseOnAny: _reactPropTypes.default.func.isRequired,
      updateXHRBreakpoint: _reactPropTypes.default.func.isRequired,
      xhrBreakpoints: _reactPropTypes.default.array.isRequired
    };
  }

  componentDidMount() {
    const {
      showInput
    } = this.props; // Ensures that the input is focused when the "+"
    // is clicked while the panel is collapsed

    if (this._input && showInput) {
      this._input.focus();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const _input = this._input;

    if (!_input) {
      return;
    }

    if (!prevState.editing && this.state.editing) {
      _input.setSelectionRange(0, _input.value.length);

      _input.focus();
    } else if (this.props.showInput && !this.state.focused) {
      _input.focus();
    }
  }

  renderXHRInput(onSubmit) {
    const {
      focused,
      inputValue
    } = this.state;
    const placeholder = L10N.getStr("xhrBreakpoints.placeholder");
    return (0, _reactDomFactories.form)({
      key: "xhr-input-container",
      className: classnames("xhr-input-container xhr-input-form", {
        focused
      }),
      onSubmit
    }, (0, _reactDomFactories.input)({
      className: "xhr-input-url",
      type: "text",
      placeholder,
      onChange: this.handleChange,
      onBlur: this.hideInput,
      onFocus: this.onFocus,
      value: inputValue,
      onKeyDown: this.handleTab,
      ref: c => this._input = c
    }), this.renderMethodSelectElement(), (0, _reactDomFactories.input)({
      type: "submit",
      style: {
        display: "none"
      }
    }));
  }

  render() {
    const {
      xhrBreakpoints
    } = this.props;
    const explicitXhrBreakpoints = getExplicitXHRBreakpoints(xhrBreakpoints);
    return _react.default.createElement(_react.default.Fragment, null, this.renderCheckbox(explicitXhrBreakpoints), explicitXhrBreakpoints.length === 0 ? this.renderXHRInput(this.handleNewSubmit) : this.renderBreakpoints(explicitXhrBreakpoints));
  }

}

const mapStateToProps = state => ({
  xhrBreakpoints: (0, _index3.getXHRBreakpoints)(state),
  shouldPauseOnAny: (0, _index3.shouldPauseOnAnyXHR)(state)
});

var _default = (0, _reactRedux.connect)(mapStateToProps, {
  setXHRBreakpoint: _index.default.setXHRBreakpoint,
  removeXHRBreakpoint: _index.default.removeXHRBreakpoint,
  enableXHRBreakpoint: _index.default.enableXHRBreakpoint,
  disableXHRBreakpoint: _index.default.disableXHRBreakpoint,
  updateXHRBreakpoint: _index.default.updateXHRBreakpoint,
  togglePauseOnAny: _index.default.togglePauseOnAny
})(XHRBreakpoints);

exports.default = _default;