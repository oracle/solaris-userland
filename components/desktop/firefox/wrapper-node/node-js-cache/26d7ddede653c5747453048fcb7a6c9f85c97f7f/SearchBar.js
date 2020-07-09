"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _propTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

loader.lazyRequireGetter(this, "_connect", "devtools/client/debugger/src/utils/connect");
loader.lazyRequireGetter(this, "_Button", "devtools/client/debugger/src/components/shared/Button/index");

var _AccessibleImage = _interopRequireDefault(require("../shared/AccessibleImage"));

var _actions = _interopRequireDefault(require("../../actions/index"));

loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_editor", "devtools/client/debugger/src/utils/editor/index");
loader.lazyRequireGetter(this, "_resultList", "devtools/client/debugger/src/utils/result-list");

var _classnames = _interopRequireDefault(require("devtools/client/debugger/dist/vendors").vendored["classnames"]);

var _SearchInput = _interopRequireDefault(require("../shared/SearchInput"));

var _lodash = require("devtools/client/shared/vendor/lodash");

var _pluralForm = _interopRequireDefault(require("devtools/shared/plural-form"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function getShortcuts() {
  const searchAgainKey = L10N.getStr("sourceSearch.search.again.key3");
  const searchAgainPrevKey = L10N.getStr("sourceSearch.search.againPrev.key3");
  const searchKey = L10N.getStr("sourceSearch.search.key2");
  return {
    shiftSearchAgainShortcut: searchAgainPrevKey,
    searchAgainShortcut: searchAgainKey,
    searchShortcut: searchKey
  };
}

class SearchBar extends _react.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "onEscape", e => {
      this.closeSearch(e);
    });

    _defineProperty(this, "clearSearch", () => {
      const {
        editor: ed,
        query
      } = this.props;

      if (ed) {
        const ctx = {
          ed,
          cm: ed.codeMirror
        };
        (0, _editor.removeOverlay)(ctx, query);
      }
    });

    _defineProperty(this, "closeSearch", e => {
      const {
        cx,
        closeFileSearch,
        editor,
        searchOn,
        query
      } = this.props;
      this.clearSearch();

      if (editor && searchOn) {
        closeFileSearch(cx, editor);
        e.stopPropagation();
        e.preventDefault();
      }

      this.setState({
        query,
        inputFocused: false
      });
    });

    _defineProperty(this, "toggleSearch", e => {
      e.stopPropagation();
      e.preventDefault();
      const {
        editor,
        searchOn,
        setActiveSearch
      } = this.props; // Set inputFocused to false, so that search query is highlighted whenever search shortcut is used, even if the input already has focus.

      this.setState({
        inputFocused: false
      });

      if (!searchOn) {
        setActiveSearch("file");
      }

      if (this.props.searchOn && editor) {
        const query = editor.codeMirror.getSelection() || this.state.query;

        if (query !== "") {
          this.setState({
            query,
            inputFocused: true
          });
          this.doSearch(query);
        } else {
          this.setState({
            query: "",
            inputFocused: true
          });
        }
      }
    });

    _defineProperty(this, "doSearch", query => {
      const {
        cx,
        selectedSource,
        selectedContentLoaded
      } = this.props;

      if (!selectedSource || !selectedContentLoaded) {
        return;
      }

      this.props.doSearch(cx, query, this.props.editor);
    });

    _defineProperty(this, "traverseResults", (e, rev) => {
      e.stopPropagation();
      e.preventDefault();
      const {
        editor
      } = this.props;

      if (!editor) {
        return;
      }

      this.props.traverseResults(this.props.cx, rev, editor);
    });

    _defineProperty(this, "onChange", e => {
      this.setState({
        query: e.target.value
      });
      return this.doSearch(e.target.value);
    });

    _defineProperty(this, "onFocus", e => {
      this.setState({
        inputFocused: true
      });
    });

    _defineProperty(this, "onBlur", e => {
      this.setState({
        inputFocused: false
      });
    });

    _defineProperty(this, "onKeyDown", e => {
      if (e.key !== "Enter" && e.key !== "F3") {
        return;
      }

      this.traverseResults(e, e.shiftKey);
      e.preventDefault();
      return this.doSearch(e.target.value);
    });

    _defineProperty(this, "onHistoryScroll", query => {
      this.setState({
        query
      });
      this.doSearch(query);
    });

    _defineProperty(this, "renderSearchModifiers", () => {
      const {
        cx,
        modifiers,
        toggleFileSearchModifier,
        query
      } = this.props;
      const {
        doSearch
      } = this;

      function SearchModBtn({
        modVal,
        className,
        svgName,
        tooltip
      }) {
        const preppedClass = (0, _classnames.default)(className, {
          active: modifiers === null || modifiers === void 0 ? void 0 : modifiers[modVal]
        });
        return _react.default.createElement("button", {
          className: preppedClass,
          onMouseDown: () => {
            toggleFileSearchModifier(cx, modVal);
            doSearch(query);
          },
          onKeyDown: e => {
            if (e.key === "Enter") {
              toggleFileSearchModifier(cx, modVal);
              doSearch(query);
            }
          },
          title: tooltip
        }, _react.default.createElement(_AccessibleImage.default, {
          className: svgName
        }));
      }

      return _react.default.createElement("div", {
        className: "search-modifiers"
      }, _react.default.createElement("span", {
        className: "pipe-divider"
      }), _react.default.createElement("span", {
        className: "search-type-name"
      }, L10N.getStr("symbolSearch.searchModifier.modifiersLabel")), _react.default.createElement(SearchModBtn, {
        modVal: "regexMatch",
        className: "regex-match-btn",
        svgName: "regex-match",
        tooltip: L10N.getStr("symbolSearch.searchModifier.regex")
      }), _react.default.createElement(SearchModBtn, {
        modVal: "caseSensitive",
        className: "case-sensitive-btn",
        svgName: "case-match",
        tooltip: L10N.getStr("symbolSearch.searchModifier.caseSensitive")
      }), _react.default.createElement(SearchModBtn, {
        modVal: "wholeWord",
        className: "whole-word-btn",
        svgName: "whole-word-match",
        tooltip: L10N.getStr("symbolSearch.searchModifier.wholeWord")
      }));
    });

    this.state = {
      query: props.query,
      selectedResultIndex: 0,
      count: 0,
      index: -1,
      inputFocused: false
    };
  }

  componentWillUnmount() {
    const {
      shortcuts
    } = this.context;
    const {
      searchShortcut,
      searchAgainShortcut,
      shiftSearchAgainShortcut
    } = getShortcuts();
    shortcuts.off(searchShortcut);
    shortcuts.off("Escape");
    shortcuts.off(searchAgainShortcut);
    shortcuts.off(shiftSearchAgainShortcut);
  }

  componentDidMount() {
    // overwrite this.doSearch with debounced version to
    // reduce frequency of queries
    this.doSearch = (0, _lodash.debounce)(this.doSearch, 100);
    const {
      shortcuts
    } = this.context;
    const {
      searchShortcut,
      searchAgainShortcut,
      shiftSearchAgainShortcut
    } = getShortcuts();
    shortcuts.on(searchShortcut, (_, e) => this.toggleSearch(e));
    shortcuts.on("Escape", (_, e) => this.onEscape(e));
    shortcuts.on(shiftSearchAgainShortcut, (_, e) => this.traverseResults(e, true));
    shortcuts.on(searchAgainShortcut, (_, e) => this.traverseResults(e, false));
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.refs.resultList && this.refs.resultList.refs) {
      (0, _resultList.scrollList)(this.refs.resultList.refs, this.state.selectedResultIndex);
    }
  }

  // Renderers
  buildSummaryMsg() {
    const {
      searchResults: {
        matchIndex,
        count,
        index
      },
      query
    } = this.props;

    if (query.trim() == "") {
      return "";
    }

    if (count == 0) {
      return L10N.getStr("editor.noResultsFound");
    }

    if (index == -1) {
      const resultsSummaryString = L10N.getStr("sourceSearch.resultsSummary1");
      return _pluralForm.default.get(count, resultsSummaryString).replace("#1", count);
    }

    const searchResultsString = L10N.getStr("editor.searchResults1");
    return _pluralForm.default.get(count, searchResultsString).replace("#1", count).replace("%d", matchIndex + 1);
  }

  shouldShowErrorEmoji() {
    const {
      query,
      searchResults: {
        count
      }
    } = this.props;
    return !!query && !count;
  }

  render() {
    const {
      searchResults: {
        count
      },
      searchOn,
      showClose = true,
      size = "big"
    } = this.props;

    if (!searchOn) {
      return _react.default.createElement("div", null);
    }

    return _react.default.createElement("div", {
      className: "search-bar"
    }, _react.default.createElement(_SearchInput.default, {
      query: this.state.query,
      count: count,
      placeholder: L10N.getStr("sourceSearch.search.placeholder2"),
      summaryMsg: this.buildSummaryMsg(),
      isLoading: false,
      onChange: this.onChange,
      onFocus: this.onFocus,
      onBlur: this.onBlur,
      showErrorEmoji: this.shouldShowErrorEmoji(),
      onKeyDown: this.onKeyDown,
      onHistoryScroll: this.onHistoryScroll,
      handleNext: e => this.traverseResults(e, false),
      handlePrev: e => this.traverseResults(e, true),
      shouldFocus: this.state.inputFocused,
      showClose: false
    }), _react.default.createElement("div", {
      className: "search-bottom-bar"
    }, this.renderSearchModifiers(), showClose && _react.default.createElement(_react.default.Fragment, null, _react.default.createElement("span", {
      className: "pipe-divider"
    }), _react.default.createElement(_Button.CloseButton, {
      handleClick: this.closeSearch,
      buttonClass: size
    }))));
  }

}

SearchBar.contextTypes = {
  shortcuts: _propTypes.default.object
};

const mapStateToProps = (state, p) => {
  const selectedSource = (0, _selectors.getSelectedSource)(state);
  return {
    cx: (0, _selectors.getContext)(state),
    searchOn: (0, _selectors.getActiveSearch)(state) === "file",
    selectedSource,
    selectedContentLoaded: selectedSource ? !!(0, _selectors.getSourceContent)(state, selectedSource.id) : false,
    query: (0, _selectors.getFileSearchQuery)(state),
    modifiers: (0, _selectors.getFileSearchModifiers)(state),
    searchResults: (0, _selectors.getFileSearchResults)(state)
  };
};

var _default = (0, _connect.connect)(mapStateToProps, {
  toggleFileSearchModifier: _actions.default.toggleFileSearchModifier,
  setFileSearchQuery: _actions.default.setFileSearchQuery,
  setActiveSearch: _actions.default.setActiveSearch,
  closeFileSearch: _actions.default.closeFileSearch,
  doSearch: _actions.default.doSearch,
  traverseResults: _actions.default.traverseResults
})(SearchBar);

exports.default = _default;