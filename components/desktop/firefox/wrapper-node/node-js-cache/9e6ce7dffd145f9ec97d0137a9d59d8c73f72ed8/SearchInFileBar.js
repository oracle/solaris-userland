"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactPropTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _reactDomFactories = require("devtools/client/shared/vendor/react-dom-factories");

var _reactRedux = require("devtools/client/shared/vendor/react-redux");

var _index = _interopRequireDefault(require("../../actions/index"));

loader.lazyRequireGetter(this, "_index2", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_constants", "devtools/client/debugger/src/constants");
loader.lazyRequireGetter(this, "_resultList", "devtools/client/debugger/src/utils/result-list");
loader.lazyRequireGetter(this, "_location", "devtools/client/debugger/src/utils/location");

var _SearchInput = _interopRequireDefault(require("../shared/SearchInput"));

loader.lazyRequireGetter(this, "_index3", "devtools/client/debugger/src/utils/editor/index");
loader.lazyRequireGetter(this, "_asyncValue", "devtools/client/debugger/src/utils/async-value");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const {
  PluralForm
} = require("resource://devtools/shared/plural-form.js");

const {
  debounce
} = require("resource://devtools/shared/debounce.js");

function getSearchShortcut() {
  return L10N.getStr("sourceSearch.search.key2");
}

class SearchInFileBar extends _react.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "onEscape", e => {
      this.closeSearch(e);
    });

    _defineProperty(this, "clearSearch", () => {
      const {
        editor
      } = this.props;

      if (!editor) {
        return;
      }

      editor.clearSearchMatches();
      editor.removePositionContentMarker("active-selection-marker");
    });

    _defineProperty(this, "closeSearch", e => {
      const {
        closeFileSearch,
        editor,
        searchInFileEnabled
      } = this.props;
      this.clearSearch();

      if (editor && searchInFileEnabled) {
        closeFileSearch();
        e.stopPropagation();
        e.preventDefault();
      }

      this.setState({
        inputFocused: false
      });
    });

    _defineProperty(this, "toggleSearch", e => {
      e.stopPropagation();
      e.preventDefault();
      const {
        editor,
        searchInFileEnabled,
        setActiveSearch
      } = this.props; // Set inputFocused to false, so that search query is highlighted whenever search shortcut is used, even if the input already has focus.

      this.setState({
        inputFocused: false
      });

      if (!searchInFileEnabled) {
        setActiveSearch("file");
      }

      if (searchInFileEnabled && editor) {
        const selectedText = editor.getSelectedText();
        const query = selectedText || this.state.query;

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

    _defineProperty(this, "doSearch", async (query, shouldScroll = true) => {
      const {
        editor,
        modifiers,
        selectedSourceTextContent
      } = this.props;

      if (!editor || !selectedSourceTextContent || !(0, _asyncValue.isFulfilled)(selectedSourceTextContent) || !modifiers) {
        return;
      }

      const selectedContent = selectedSourceTextContent.value;
      const ctx = {
        editor,
        cm: editor.codeMirror
      };

      if (!query) {
        (0, _index3.clearSearch)(ctx);
        return;
      }

      let text;

      if (selectedContent.type === "wasm") {
        text = editor.renderWasmText(selectedContent).join("\n");
      } else {
        text = selectedContent.value;
      }

      const matches = await this.props.querySearchWorker(query, text, modifiers);
      const results = (0, _index3.find)(ctx, query, true, modifiers, {
        shouldScroll
      });
      this.setSearchResults(results, matches);
    });

    _defineProperty(this, "traverseResults", (e, reverse = false) => {
      e.stopPropagation();
      e.preventDefault();
      const {
        editor
      } = this.props;

      if (!editor) {
        return;
      }

      const ctx = {
        editor,
        cm: editor.codeMirror
      };
      const {
        modifiers
      } = this.props;
      const {
        query
      } = this.state;
      const {
        matches
      } = this.state.results;

      if (query === "" && !this.props.searchInFileEnabled) {
        this.props.setActiveSearch("file");
      }

      if (modifiers) {
        const findArgs = [ctx, query, true, modifiers];
        const results = reverse ? (0, _index3.findPrev)(...findArgs) : (0, _index3.findNext)(...findArgs);
        this.setSearchResults(results, matches);
      }
    });

    _defineProperty(this, "setCursorLocation", (line, ch, matchContent) => {
      this.props.selectLocation((0, _location.createLocation)({
        source: this.props.selectedSource,
        line: line + 1,
        column: ch + matchContent.length
      }), {
        // Reset the context, so that we don't switch to original
        // while moving the cursor within a bundle
        keepContext: false,
        // Avoid highlighting the selected line
        highlight: false,
        // This is mostly for displaying the correct location
        // in the footer, so this should not scroll.
        scroll: false
      });
    });

    _defineProperty(this, "onChange", e => {
      this.setState({
        query: e.target.value
      });
      return this.doSearch(e.target.value);
    });

    _defineProperty(this, "onFocus", () => {
      this.setState({
        inputFocused: true
      });
    });

    _defineProperty(this, "onBlur", () => {
      this.setState({
        inputFocused: false
      });
    });

    _defineProperty(this, "onKeyDown", e => {
      if (e.key !== "Enter" && e.key !== "F3") {
        return;
      }

      e.preventDefault();
      this.traverseResults(e, e.shiftKey);
    });

    _defineProperty(this, "onHistoryScroll", query => {
      this.setState({
        query
      });
      this.doSearch(query);
    });

    this.state = {
      query: "",
      selectedResultIndex: 0,
      results: {
        matches: [],
        matchIndex: -1,
        count: 0,
        index: -1
      },
      inputFocused: false
    };
  }

  static get propTypes() {
    return {
      closeFileSearch: _reactPropTypes.default.func.isRequired,
      editor: _reactPropTypes.default.object,
      modifiers: _reactPropTypes.default.object.isRequired,
      searchInFileEnabled: _reactPropTypes.default.bool.isRequired,
      selectedSourceTextContent: _reactPropTypes.default.object,
      selectedSource: _reactPropTypes.default.object.isRequired,
      setActiveSearch: _reactPropTypes.default.func.isRequired,
      querySearchWorker: _reactPropTypes.default.func.isRequired,
      selectLocation: _reactPropTypes.default.func.isRequired,
      isPaused: _reactPropTypes.default.bool.isRequired
    };
  }

  componentWillUnmount() {
    const {
      shortcuts
    } = this.context;
    shortcuts.off(getSearchShortcut(), this.toggleSearch);
    shortcuts.off("Escape", this.onEscape);
    this.doSearch.cancel();
  } // FIXME: https://bugzilla.mozilla.org/show_bug.cgi?id=1774507


  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      query
    } = this.state; // Trigger a search to update the search results ...

    if ( // if there is a search query and ...
    query && ( // the file search bar is toggled open or ...
    !this.props.searchInFileEnabled && nextProps.searchInFileEnabled || // a new source is selected.
    this.props.selectedSource.id !== nextProps.selectedSource.id) || // the source content changes
    this.props.selectedSourceTextContent !== nextProps.selectedSourceTextContent) {
      // Do not scroll to the search location, if we just switched to a new source
      // and debugger is already paused on a selected line.
      this.doSearch(query, !nextProps.isPaused);
    }
  }

  componentDidMount() {
    // overwrite this.doSearch with debounced version to
    // reduce frequency of queries
    this.doSearch = debounce(this.doSearch, 100);
    const {
      shortcuts
    } = this.context;
    shortcuts.on(getSearchShortcut(), this.toggleSearch);
    shortcuts.on("Escape", this.onEscape);
  }

  componentDidUpdate() {
    if (this.refs.resultList && this.refs.resultList.refs) {
      (0, _resultList.scrollList)(this.refs.resultList.refs, this.state.selectedResultIndex);
    }
  }

  /**
   * Update the state with the results and matches from the search.
   * The cursor location is also set for CM6.
   * @param {Object} results
   * @param {Array} matches
   * @returns
   */
  setSearchResults(results, matches) {
    if (!results) {
      this.setState({
        results: {
          matches,
          matchIndex: 0,
          count: matches.length,
          index: -1
        }
      });
      return;
    }

    const {
      ch,
      line
    } = results;
    let matchContent = "";
    const matchIndex = matches.findIndex(elm => {
      if (elm.line === line && elm.ch === ch) {
        matchContent = elm.match;
        return true;
      }

      return false;
    });
    this.setCursorLocation(line, ch, matchContent);
    this.setState({
      results: {
        matches,
        matchIndex,
        count: matches.length,
        index: ch
      }
    });
  }
  /**
   * CodeMirror event handler, called whenever the cursor moves
   * for user-driven or programatic reasons.
   * @param {Number} line
   * @param {Number} ch
   * @param {Number} matchCount
   */


  // Renderers
  buildSummaryMsg() {
    const {
      query,
      results: {
        matchIndex,
        count,
        index
      }
    } = this.state;

    if (query.trim() == "") {
      return "";
    }

    if (count == 0) {
      return L10N.getStr("editor.noResultsFound");
    }

    if (index == -1) {
      const resultsSummaryString = L10N.getStr("sourceSearch.resultsSummary1");
      return PluralForm.get(count, resultsSummaryString).replace("#1", count);
    }

    const searchResultsString = L10N.getStr("editor.searchResults1");
    return PluralForm.get(count, searchResultsString).replace("#1", count).replace("%d", matchIndex + 1);
  }

  shouldShowErrorEmoji() {
    const {
      query,
      results: {
        count
      }
    } = this.state;
    return !!query && !count;
  }

  render() {
    const {
      searchInFileEnabled
    } = this.props;
    const {
      results: {
        count
      }
    } = this.state;

    if (!searchInFileEnabled) {
      return (0, _reactDomFactories.div)(null);
    }

    return (0, _reactDomFactories.div)({
      className: "search-bar"
    }, _react.default.createElement(_SearchInput.default, {
      query: this.state.query,
      count,
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
      showClose: true,
      showExcludePatterns: false,
      handleClose: this.closeSearch,
      showSearchModifiers: true,
      searchKey: _constants.searchKeys.FILE_SEARCH,
      onToggleSearchModifier: () => this.doSearch(this.state.query)
    }));
  }

}

SearchInFileBar.contextTypes = {
  shortcuts: _reactPropTypes.default.object
};

const mapStateToProps = state => {
  return {
    searchInFileEnabled: (0, _index2.getActiveSearch)(state) === "file",
    selectedSource: (0, _index2.getSelectedSource)(state),
    isPaused: (0, _index2.getIsCurrentThreadPaused)(state),
    selectedSourceTextContent: (0, _index2.getSelectedSourceTextContent)(state),
    modifiers: (0, _index2.getSearchOptions)(state, "file-search")
  };
};

var _default = (0, _reactRedux.connect)(mapStateToProps, {
  setFileSearchQuery: _index.default.setFileSearchQuery,
  setActiveSearch: _index.default.setActiveSearch,
  closeFileSearch: _index.default.closeFileSearch,
  querySearchWorker: _index.default.querySearchWorker,
  selectLocation: _index.default.selectLocation
})(SearchInFileBar);

exports.default = _default;