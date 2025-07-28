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

var _AccessibleImage = _interopRequireDefault(require("../shared/AccessibleImage"));

var objectInspector = _interopRequireWildcard(require("resource://devtools/client/shared/components/object-inspector/index.js"));

var _index2 = _interopRequireDefault(require("../../actions/index"));

loader.lazyRequireGetter(this, "_index3", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_expressions", "devtools/client/debugger/src/utils/expressions");
loader.lazyRequireGetter(this, "_index4", "devtools/client/debugger/src/components/shared/Button/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const {
  debounce
} = require("resource://devtools/shared/debounce.js");

const {
  ObjectInspector
} = objectInspector;

class Expressions extends _react.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "clear", () => {
      this.setState(() => ({
        editing: false,
        editIndex: -1,
        inputValue: ""
      }));
    });

    _defineProperty(this, "handleChange", e => {
      const {
        target
      } = e;

      if (_prefs.features.autocompleteExpression) {
        this.findAutocompleteMatches(target.value, target.selectionStart);
      }

      this.setState({
        inputValue: target.value
      });
    });

    _defineProperty(this, "findAutocompleteMatches", debounce((value, selectionStart) => {
      const {
        autocomplete
      } = this.props;
      autocomplete(value, selectionStart);
    }, 250));

    _defineProperty(this, "handleKeyDown", e => {
      if (e.key === "Escape") {
        this.clear();
      }
    });

    _defineProperty(this, "hideInput", () => {
      this.props.onExpressionAdded();
    });

    _defineProperty(this, "createElement", element => {
      return document.createElement(element);
    });

    _defineProperty(this, "handleExistingSubmit", async (e, expression) => {
      e.preventDefault();
      e.stopPropagation();
      this.props.updateExpression(this.state.inputValue, expression);
    });

    _defineProperty(this, "handleNewSubmit", async e => {
      e.preventDefault();
      e.stopPropagation();
      await this.props.addExpression(this.state.inputValue);
      this.setState({
        editing: false,
        editIndex: -1,
        inputValue: ""
      });
      this.props.clearAutocomplete();
    });

    _defineProperty(this, "renderExpression", (expression, index) => {
      const {
        openLink,
        openElementInInspector,
        highlightDomElement,
        unHighlightDomElement
      } = this.props;
      const {
        editing,
        editIndex
      } = this.state;
      const {
        input: _input,
        updating
      } = expression;
      const isEditingExpr = editing && editIndex === index;

      if (isEditingExpr) {
        return this.renderExpressionEditInput(expression);
      }

      if (updating) {
        return null;
      }

      const {
        expressionResultGrip,
        expressionResultFront
      } = (0, _expressions.getExpressionResultGripAndFront)(expression);
      const root = {
        name: expression.input,
        path: _input,
        contents: {
          value: expressionResultGrip,
          front: expressionResultFront
        }
      };
      return (0, _reactDomFactories.li)({
        className: "expression-container",
        key: _input,
        title: expression.input
      }, (0, _reactDomFactories.div)({
        className: "expression-content"
      }, _react.default.createElement(ObjectInspector, {
        roots: [root],
        autoExpandDepth: 0,
        disableWrap: true,
        openLink,
        createElement: this.createElement,
        onDoubleClick: (items, {
          depth
        }) => {
          if (depth === 0) {
            this.editExpression(expression, index);
          }
        },
        onDOMNodeClick: grip => openElementInInspector(grip),
        onInspectIconClick: grip => openElementInInspector(grip),
        onDOMNodeMouseOver: grip => highlightDomElement(grip),
        onDOMNodeMouseOut: grip => unHighlightDomElement(grip),
        shouldRenderTooltip: true,
        mayUseCustomFormatter: true
      }), (0, _reactDomFactories.div)({
        className: "expression-container__close-btn"
      }, _react.default.createElement(_index4.CloseButton, {
        handleClick: e => this.deleteExpression(e, expression),
        tooltip: L10N.getStr("expressions.remove.tooltip")
      }))));
    });

    this.state = {
      editing: false,
      editIndex: -1,
      inputValue: ""
    };
  }

  static get propTypes() {
    return {
      addExpression: _reactPropTypes.default.func.isRequired,
      autocomplete: _reactPropTypes.default.func.isRequired,
      autocompleteMatches: _reactPropTypes.default.array,
      clearAutocomplete: _reactPropTypes.default.func.isRequired,
      deleteExpression: _reactPropTypes.default.func.isRequired,
      expressions: _reactPropTypes.default.array.isRequired,
      highlightDomElement: _reactPropTypes.default.func.isRequired,
      onExpressionAdded: _reactPropTypes.default.func.isRequired,
      openElementInInspector: _reactPropTypes.default.func.isRequired,
      openLink: _reactPropTypes.default.any.isRequired,
      showInput: _reactPropTypes.default.bool.isRequired,
      unHighlightDomElement: _reactPropTypes.default.func.isRequired,
      updateExpression: _reactPropTypes.default.func.isRequired,
      isOriginalVariableMappingDisabled: _reactPropTypes.default.bool,
      isLoadingOriginalVariables: _reactPropTypes.default.bool
    };
  }

  componentDidMount() {
    const {
      showInput
    } = this.props; // Ensures that the input is focused when the "+"
    // is clicked while the panel is collapsed

    if (showInput && this._input) {
      this._input.focus();
    }
  }

  // FIXME: https://bugzilla.mozilla.org/show_bug.cgi?id=1774507
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.state.editing) {
      this.clear();
    } // Ensures that the add watch expression input
    // is no longer visible when the new watch expression is rendered


    if (this.props.expressions.length < nextProps.expressions.length) {
      this.hideInput();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const {
      editing,
      inputValue
    } = this.state;
    const {
      expressions,
      showInput,
      autocompleteMatches,
      isLoadingOriginalVariables,
      isOriginalVariableMappingDisabled
    } = this.props;
    return autocompleteMatches !== nextProps.autocompleteMatches || expressions !== nextProps.expressions || isLoadingOriginalVariables !== nextProps.isLoadingOriginalVariables || isOriginalVariableMappingDisabled !== nextProps.isOriginalVariableMappingDisabled || editing !== nextState.editing || inputValue !== nextState.inputValue || nextProps.showInput !== showInput;
  }

  componentDidUpdate(prevProps, prevState) {
    const _input = this._input;

    if (!_input) {
      return;
    }

    if (!prevState.editing && this.state.editing) {
      _input.setSelectionRange(0, _input.value.length);

      _input.focus();
    } else if (this.props.showInput) {
      _input.focus();
    }
  }

  editExpression(expression, index) {
    this.setState({
      inputValue: expression.input,
      editing: true,
      editIndex: index
    });
  }

  deleteExpression(e, expression) {
    e.stopPropagation();
    const {
      deleteExpression
    } = this.props;
    deleteExpression(expression);
  }

  onBlur() {
    this.clear();
    this.hideInput();
  }

  renderExpressionsNotification() {
    const {
      isOriginalVariableMappingDisabled,
      isLoadingOriginalVariables
    } = this.props;

    if (isOriginalVariableMappingDisabled) {
      return (0, _reactDomFactories.div)({
        className: "pane-info no-original-scopes-info",
        "aria-role": "status"
      }, (0, _reactDomFactories.span)({
        className: "info icon"
      }, _react.default.createElement(_AccessibleImage.default, {
        className: "sourcemap"
      })), (0, _reactDomFactories.span)({
        className: "message"
      }, L10N.getStr("expressions.noOriginalScopes")));
    }

    if (isLoadingOriginalVariables) {
      return (0, _reactDomFactories.div)({
        className: "pane-info"
      }, (0, _reactDomFactories.span)({
        className: "info icon"
      }, _react.default.createElement(_AccessibleImage.default, {
        className: "loader"
      })), (0, _reactDomFactories.span)({
        className: "message"
      }, L10N.getStr("scopes.loadingOriginalScopes")));
    }

    return null;
  }

  renderExpressions() {
    const {
      expressions,
      showInput
    } = this.props;
    return _react.default.createElement(_react.default.Fragment, null, (0, _reactDomFactories.ul)({
      className: "pane expressions-list"
    }, expressions.map(this.renderExpression)), showInput && this.renderNewExpressionInput());
  }

  renderAutoCompleteMatches() {
    if (!_prefs.features.autocompleteExpression) {
      return null;
    }

    const {
      autocompleteMatches
    } = this.props;

    if (autocompleteMatches) {
      return (0, _reactDomFactories.datalist)({
        id: "autocomplete-matches"
      }, autocompleteMatches.map((match, index) => {
        return (0, _reactDomFactories.option)({
          key: index,
          value: match
        });
      }));
    }

    return (0, _reactDomFactories.datalist)({
      id: "autocomplete-matches"
    });
  }

  renderNewExpressionInput() {
    const {
      editing,
      inputValue
    } = this.state;
    return (0, _reactDomFactories.form)({
      className: "expression-input-container expression-input-form",
      onSubmit: this.handleNewSubmit
    }, (0, _reactDomFactories.input)({
      className: "input-expression",
      type: "text",
      placeholder: L10N.getStr("expressions.placeholder2"),
      onChange: this.handleChange,
      onBlur: this.hideInput,
      onKeyDown: this.handleKeyDown,
      value: !editing ? inputValue : "",
      ref: c => this._input = c,
      ...(_prefs.features.autocompleteExpression && {
        list: "autocomplete-matches"
      })
    }), this.renderAutoCompleteMatches(), (0, _reactDomFactories.input)({
      type: "submit",
      style: {
        display: "none"
      }
    }));
  }

  renderExpressionEditInput(expression) {
    const {
      inputValue,
      editing
    } = this.state;
    return (0, _reactDomFactories.form)({
      key: expression.input,
      className: "expression-input-container expression-input-form",
      onSubmit: e => this.handleExistingSubmit(e, expression)
    }, (0, _reactDomFactories.input)({
      className: "input-expression",
      type: "text",
      onChange: this.handleChange,
      onBlur: this.clear,
      onKeyDown: this.handleKeyDown,
      value: editing ? inputValue : expression.input,
      ref: c => this._input = c,
      ...(_prefs.features.autocompleteExpression && {
        list: "autocomplete-matches"
      })
    }), this.renderAutoCompleteMatches(), (0, _reactDomFactories.input)({
      type: "submit",
      style: {
        display: "none"
      }
    }));
  }

  render() {
    const {
      expressions
    } = this.props;
    return (0, _reactDomFactories.div)({
      className: "pane"
    }, this.renderExpressionsNotification(), expressions.length === 0 ? this.renderNewExpressionInput() : this.renderExpressions());
  }

}

const mapStateToProps = state => {
  const selectedFrame = (0, _index3.getSelectedFrame)(state);
  const selectedSource = (0, _index3.getSelectedSource)(state);
  const isPaused = (0, _index3.getIsCurrentThreadPaused)(state);
  const mapScopesEnabled = (0, _index3.isMapScopesEnabled)(state);
  const expressions = (0, _index3.getExpressions)(state);
  const selectedSourceIsNonPrettyPrintedOriginal = selectedSource?.isOriginal && !selectedSource?.isPrettyPrinted;
  let isOriginalVariableMappingDisabled, isLoadingOriginalVariables;

  if (selectedSourceIsNonPrettyPrintedOriginal) {
    isOriginalVariableMappingDisabled = isPaused && !mapScopesEnabled;
    isLoadingOriginalVariables = isPaused && mapScopesEnabled && !expressions.length && !(0, _index3.getOriginalFrameScope)(state, selectedFrame)?.scope;
  }

  return {
    isOriginalVariableMappingDisabled,
    isLoadingOriginalVariables,
    autocompleteMatches: (0, _index3.getAutocompleteMatchset)(state),
    expressions
  };
};

var _default = (0, _reactRedux.connect)(mapStateToProps, {
  autocomplete: _index2.default.autocomplete,
  clearAutocomplete: _index2.default.clearAutocomplete,
  addExpression: _index2.default.addExpression,
  updateExpression: _index2.default.updateExpression,
  deleteExpression: _index2.default.deleteExpression,
  openLink: _index2.default.openLink,
  openElementInInspector: _index2.default.openElementInInspectorCommand,
  highlightDomElement: _index2.default.highlightDomElement,
  unHighlightDomElement: _index2.default.unHighlightDomElement
})(Expressions);

exports.default = _default;