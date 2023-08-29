"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.SearchInput = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _propTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

loader.lazyRequireGetter(this, "_connect", "devtools/client/debugger/src/utils/connect");
loader.lazyRequireGetter(this, "_Button", "devtools/client/debugger/src/components/shared/Button/index");

var _AccessibleImage = _interopRequireDefault(require("./AccessibleImage"));

var _actions = _interopRequireDefault(require("../../actions/index"));

loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const classnames = require("devtools/client/shared/classnames.js");

const SearchModifiers = require("devtools/client/shared/components/SearchModifiers");

const arrowBtn = (onClick, type, className, tooltip) => {
  const props = {
    className,
    key: type,
    onClick,
    title: tooltip,
    type
  };
  return _react.default.createElement("button", props, _react.default.createElement(_AccessibleImage.default, {
    className: type
  }));
};

class SearchInput extends _react.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "onFocus", e => {
      const {
        onFocus
      } = this.props;

      if (onFocus) {
        onFocus(e);
      }
    });

    _defineProperty(this, "onBlur", e => {
      const {
        onBlur
      } = this.props;

      if (onBlur) {
        onBlur(e);
      }
    });

    _defineProperty(this, "onKeyDown", e => {
      const {
        onHistoryScroll,
        onKeyDown
      } = this.props;

      if (!onHistoryScroll) {
        onKeyDown(e);
        return;
      }

      const inputValue = e.target.value;
      const {
        history
      } = this.state;
      const currentHistoryIndex = history.indexOf(inputValue);

      if (e.key === "Enter") {
        this.saveEnteredTerm(inputValue);
        onKeyDown(e);
        return;
      }

      if (e.key === "ArrowUp") {
        const previous = currentHistoryIndex > -1 ? currentHistoryIndex - 1 : history.length - 1;
        const previousInHistory = history[previous];

        if (previousInHistory) {
          e.preventDefault();
          onHistoryScroll(previousInHistory);
        }

        return;
      }

      if (e.key === "ArrowDown") {
        const next = currentHistoryIndex + 1;
        const nextInHistory = history[next];

        if (nextInHistory) {
          onHistoryScroll(nextInHistory);
        }
      }
    });

    _defineProperty(this, "onExcludeKeyDown", e => {
      if (e.key === "Enter") {
        this.props.setSearchOptions(this.props.searchKey, {
          excludePatterns: this.state.excludePatterns
        });
        this.props.onKeyDown(e);
      }
    });

    this.state = {
      history: [],
      excludePatterns: props.searchOptions.excludePatterns
    };
  }

  static get propTypes() {
    return {
      count: _propTypes.default.number.isRequired,
      expanded: _propTypes.default.bool.isRequired,
      handleClose: _propTypes.default.func,
      handleNext: _propTypes.default.func,
      handlePrev: _propTypes.default.func,
      hasPrefix: _propTypes.default.bool.isRequired,
      isLoading: _propTypes.default.bool.isRequired,
      onBlur: _propTypes.default.func,
      onChange: _propTypes.default.func,
      onFocus: _propTypes.default.func,
      onHistoryScroll: _propTypes.default.func,
      onKeyDown: _propTypes.default.func,
      onKeyUp: _propTypes.default.func,
      placeholder: _propTypes.default.string,
      query: _propTypes.default.string,
      selectedItemId: _propTypes.default.string,
      shouldFocus: _propTypes.default.bool,
      showClose: _propTypes.default.bool.isRequired,
      showExcludePatterns: _propTypes.default.bool.isRequired,
      excludePatternsLabel: _propTypes.default.string,
      excludePatternsPlaceholder: _propTypes.default.string,
      showErrorEmoji: _propTypes.default.bool.isRequired,
      size: _propTypes.default.string,
      summaryMsg: _propTypes.default.string,
      searchKey: _propTypes.default.string.isRequired,
      searchOptions: _propTypes.default.object,
      setSearchOptions: _propTypes.default.func,
      showSearchModifiers: _propTypes.default.bool.isRequired,
      onToggleSearchModifier: _propTypes.default.func
    };
  }

  componentDidMount() {
    this.setFocus();
  }

  componentDidUpdate(prevProps) {
    if (this.props.shouldFocus && !prevProps.shouldFocus) {
      this.setFocus();
    }
  }

  setFocus() {
    if (this.$input) {
      const input = this.$input;
      input.focus();

      if (!input.value) {
        return;
      } // omit prefix @:# from being selected


      const selectStartPos = this.props.hasPrefix ? 1 : 0;
      input.setSelectionRange(selectStartPos, input.value.length + 1);
    }
  }

  renderArrowButtons() {
    const {
      handleNext,
      handlePrev
    } = this.props;
    return [arrowBtn(handlePrev, "arrow-up", classnames("nav-btn", "prev"), L10N.getFormatStr("editor.searchResults.prevResult")), arrowBtn(handleNext, "arrow-down", classnames("nav-btn", "next"), L10N.getFormatStr("editor.searchResults.nextResult"))];
  }

  saveEnteredTerm(query) {
    const {
      history
    } = this.state;
    const previousIndex = history.indexOf(query);

    if (previousIndex !== -1) {
      history.splice(previousIndex, 1);
    }

    history.push(query);
    this.setState({
      history
    });
  }

  renderSummaryMsg() {
    const {
      summaryMsg
    } = this.props;

    if (!summaryMsg) {
      return null;
    }

    return _react.default.createElement("div", {
      className: "search-field-summary"
    }, summaryMsg);
  }

  renderSpinner() {
    const {
      isLoading
    } = this.props;

    if (!isLoading) {
      return null;
    }

    return _react.default.createElement(_AccessibleImage.default, {
      className: "loader spin"
    });
  }

  renderNav() {
    const {
      count,
      handleNext,
      handlePrev
    } = this.props;

    if (!handleNext && !handlePrev || !count || count == 1) {
      return null;
    }

    return _react.default.createElement("div", {
      className: "search-nav-buttons"
    }, this.renderArrowButtons());
  }

  renderSearchModifiers() {
    if (!this.props.showSearchModifiers) {
      return null;
    }

    return _react.default.createElement(SearchModifiers, {
      modifiers: this.props.searchOptions,
      onToggleSearchModifier: updatedOptions => {
        this.props.setSearchOptions(this.props.searchKey, updatedOptions);
        this.props.onToggleSearchModifier();
      }
    });
  }

  renderExcludePatterns() {
    if (!this.props.showExcludePatterns) {
      return null;
    }

    return _react.default.createElement("div", {
      className: classnames("exclude-patterns-field", this.props.size)
    }, _react.default.createElement("label", null, this.props.excludePatternsLabel), _react.default.createElement("input", {
      placeholder: this.props.excludePatternsPlaceholder,
      value: this.state.excludePatterns,
      onKeyDown: this.onExcludeKeyDown,
      onChange: e => this.setState({
        excludePatterns: e.target.value
      })
    }));
  }

  renderClose() {
    if (!this.props.showClose) {
      return null;
    }

    return _react.default.createElement(_react.default.Fragment, null, _react.default.createElement("span", {
      className: "pipe-divider"
    }), _react.default.createElement(_Button.CloseButton, {
      handleClick: this.props.handleClose,
      buttonClass: this.props.size
    }));
  }

  render() {
    const {
      expanded,
      onChange,
      onKeyUp,
      placeholder,
      query,
      selectedItemId,
      showErrorEmoji,
      size
    } = this.props;
    const inputProps = {
      className: classnames({
        empty: showErrorEmoji
      }),
      onChange,
      onKeyDown: e => this.onKeyDown(e),
      onKeyUp,
      onFocus: e => this.onFocus(e),
      onBlur: e => this.onBlur(e),
      "aria-autocomplete": "list",
      "aria-controls": "result-list",
      "aria-activedescendant": expanded && selectedItemId ? `${selectedItemId}-title` : "",
      placeholder,
      value: query,
      spellCheck: false,
      ref: c => this.$input = c
    };
    return _react.default.createElement("div", {
      className: "search-outline"
    }, _react.default.createElement("div", {
      className: classnames("search-field", size),
      role: "combobox",
      "aria-haspopup": "listbox",
      "aria-owns": "result-list",
      "aria-expanded": expanded
    }, _react.default.createElement(_AccessibleImage.default, {
      className: "search"
    }), _react.default.createElement("input", inputProps), this.renderSpinner(), this.renderSummaryMsg(), this.renderNav(), _react.default.createElement("div", {
      className: "search-buttons-bar"
    }, this.renderSearchModifiers(), this.renderClose())), this.renderExcludePatterns());
  }

}

exports.SearchInput = SearchInput;

_defineProperty(SearchInput, "defaultProps", {
  expanded: false,
  hasPrefix: false,
  selectedItemId: "",
  size: "",
  showClose: true
});

const mapStateToProps = (state, props) => ({
  searchOptions: (0, _selectors.getSearchOptions)(state, props.searchKey)
});

var _default = (0, _connect.connect)(mapStateToProps, {
  setSearchOptions: _actions.default.setSearchOptions
})(SearchInput);

exports.default = _default;