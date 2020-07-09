"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

loader.lazyRequireGetter(this, "_Button", "devtools/client/debugger/src/components/shared/Button/index");

var _AccessibleImage = _interopRequireDefault(require("./AccessibleImage"));

var _classnames = _interopRequireDefault(require("devtools/client/debugger/dist/vendors").vendored["classnames"]);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
        return onKeyDown(e);
      }

      const inputValue = e.target.value;
      const {
        history
      } = this.state;
      const currentHistoryIndex = history.indexOf(inputValue);

      if (e.key === "Enter") {
        this.saveEnteredTerm(inputValue);
        return onKeyDown(e);
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

    this.state = {
      history: []
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

  renderSvg() {
    return _react.default.createElement(_AccessibleImage.default, {
      className: "search"
    });
  }

  renderArrowButtons() {
    const {
      handleNext,
      handlePrev
    } = this.props;
    return [arrowBtn(handlePrev, "arrow-up", (0, _classnames.default)("nav-btn", "prev"), L10N.getFormatStr("editor.searchResults.prevResult")), arrowBtn(handleNext, "arrow-down", (0, _classnames.default)("nav-btn", "next"), L10N.getFormatStr("editor.searchResults.nextResult"))];
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

    if (isLoading) {
      return _react.default.createElement(_AccessibleImage.default, {
        className: "loader spin"
      });
    }
  }

  renderNav() {
    const {
      count,
      handleNext,
      handlePrev
    } = this.props;

    if (!handleNext && !handlePrev || !count || count == 1) {
      return;
    }

    return _react.default.createElement("div", {
      className: "search-nav-buttons"
    }, this.renderArrowButtons());
  }

  render() {
    const {
      expanded,
      handleClose,
      onChange,
      onKeyUp,
      placeholder,
      query,
      selectedItemId,
      showErrorEmoji,
      size,
      showClose
    } = this.props;
    const inputProps = {
      className: (0, _classnames.default)({
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
      className: (0, _classnames.default)("search-field", size),
      role: "combobox",
      "aria-haspopup": "listbox",
      "aria-owns": "result-list",
      "aria-expanded": expanded
    }, this.renderSvg(), _react.default.createElement("input", inputProps), this.renderSpinner(), this.renderSummaryMsg(), this.renderNav(), showClose && _react.default.createElement(_Button.CloseButton, {
      handleClick: handleClose,
      buttonClass: size
    })));
  }

}

_defineProperty(SearchInput, "defaultProps", {
  expanded: false,
  hasPrefix: false,
  selectedItemId: "",
  size: "",
  showClose: true
});

var _default = SearchInput;
exports.default = _default;