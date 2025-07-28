"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.ProjectSearch = exports.statusType = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _reactDomFactories = require("devtools/client/shared/vendor/react-dom-factories");

var _reactPropTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

var _reactRedux = require("devtools/client/shared/vendor/react-redux");

var _index = _interopRequireDefault(require("../../actions/index"));

loader.lazyRequireGetter(this, "_index2", "devtools/client/debugger/src/utils/editor/index");
loader.lazyRequireGetter(this, "_constants", "devtools/client/debugger/src/constants");
loader.lazyRequireGetter(this, "_utils", "devtools/client/debugger/src/utils/sources-tree/utils");
loader.lazyRequireGetter(this, "_index3", "devtools/client/debugger/src/selectors/index");

var _SearchInput = _interopRequireDefault(require("../shared/SearchInput"));

var _AccessibleImage = _interopRequireDefault(require("../shared/AccessibleImage"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const {
  PluralForm
} = require("resource://devtools/shared/plural-form.js");

const classnames = require("resource://devtools/client/shared/classnames.js");

const Tree = require("resource://devtools/client/shared/components/Tree.js");

const {
  debounce
} = require("resource://devtools/shared/debounce.js");

const {
  throttle
} = require("resource://devtools/shared/throttle.js");

const {
  HTMLTooltip
} = require("resource://devtools/client/shared/widgets/tooltip/HTMLTooltip.js");

const statusType = {
  initial: "INITIAL",
  fetching: "FETCHING",
  cancelled: "CANCELLED",
  done: "DONE",
  error: "ERROR"
};
exports.statusType = statusType;

function getFilePath(item, index) {
  return item.type === "RESULT" ? `${item.location.source.id}-${index || "$"}` : `${item.location.source.id}-${item.location.line}-${item.location.column}-${index || "$"}`;
}

class ProjectSearch extends _react.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "selectMatchItem", async matchItem => {
      const foundMatchingSource = await this.props.selectSpecificLocationOrSameUrl(matchItem.location); // When we reload, or if the source's target has been destroyed,
      // we may no longer have the source available in the reducer.
      // In such case `selectSpecificLocationOrSameUrl` will return false.

      if (!foundMatchingSource) {
        // When going over results via the key arrows and Enter, we may display many tooltips at once.
        if (this.tooltip) {
          this.tooltip.hide();
        } // Go down to line-number otherwise HTMLTooltip's call to getBoundingClientRect would return (0, 0) position for the tooltip


        const element = document.querySelector(".project-text-search .tree-node.focused .result .line-number");
        const tooltip = new HTMLTooltip(element.ownerDocument, {
          className: "unavailable-source",
          type: "arrow"
        });
        tooltip.panel.textContent = L10N.getStr("projectTextSearch.sourceNoLongerAvailable");
        tooltip.setContentSize({
          height: "auto"
        });
        tooltip.show(element);
        this.tooltip = tooltip;
        return;
      }

      this.props.doSearchForHighlight(this.state.query, (0, _index2.getEditor)());
    });

    _defineProperty(this, "highlightMatches", lineMatch => {
      const {
        value,
        matchIndex,
        match
      } = lineMatch;
      const len = match.length;
      return (0, _reactDomFactories.span)({
        className: "line-value"
      }, (0, _reactDomFactories.span)({
        className: "line-match",
        key: 0
      }, value.slice(0, matchIndex)), (0, _reactDomFactories.span)({
        className: "query-match",
        key: 1
      }, value.substr(matchIndex, len)), (0, _reactDomFactories.span)({
        className: "line-match",
        key: 2
      }, value.slice(matchIndex + len, value.length)));
    });

    _defineProperty(this, "getResultCount", () => this.state.results.reduce((count, file) => count + file.matches.length, 0));

    _defineProperty(this, "onKeyDown", e => {
      if (e.key === "Escape") {
        return;
      }

      e.stopPropagation();
      this.setState({
        focusedItem: null
      });
      this.doSearch();
    });

    _defineProperty(this, "onHistoryScroll", query => {
      this.setState({
        query
      });
      this.doSearch();
    });

    _defineProperty(this, "onActivate", item => {
      if (item && item.type === "MATCH") {
        this.selectMatchItem(item);
      }
    });

    _defineProperty(this, "onFocus", item => {
      if (this.state.focusedItem !== item) {
        this.setState({
          focusedItem: item
        });
      }
    });

    _defineProperty(this, "inputOnChange", e => {
      const inputValue = e.target.value;
      this.setState({
        query: inputValue
      });
      this.doSearch();
    });

    _defineProperty(this, "renderFile", (file, focused, expanded) => {
      const matchesLength = file.matches.length;
      const matches = ` (${matchesLength} match${matchesLength > 1 ? "es" : ""})`;
      return (0, _reactDomFactories.div)({
        className: classnames("file-result", {
          focused
        }),
        key: file.location.source.id
      }, _react.default.createElement(_AccessibleImage.default, {
        className: classnames("arrow", {
          expanded
        })
      }), _react.default.createElement(_AccessibleImage.default, {
        className: "file"
      }), (0, _reactDomFactories.span)({
        className: "file-path"
      }, file.location.source.url ? (0, _utils.getRelativePath)(file.location.source.url) : file.location.source.shortName), (0, _reactDomFactories.span)({
        className: "matches-summary"
      }, matches));
    });

    _defineProperty(this, "renderMatch", (match, focused) => {
      return (0, _reactDomFactories.div)({
        className: classnames("result", {
          focused
        }),
        onClick: () => this.selectMatchItem(match)
      }, (0, _reactDomFactories.span)({
        className: "line-number",
        key: match.location.line
      }, match.location.line), this.highlightMatches(match));
    });

    _defineProperty(this, "renderItem", (item, depth, focused, _, expanded) => {
      if (item.type === "RESULT") {
        return this.renderFile(item, focused, expanded);
      }

      return this.renderMatch(item, focused);
    });

    _defineProperty(this, "renderSummary", () => {
      if (this.state.query === "") {
        return "";
      }

      const resultsSummaryString = L10N.getStr("sourceSearch.resultsSummary2");
      const count = this.getResultCount();

      if (count === 0) {
        return "";
      }

      return PluralForm.get(count, resultsSummaryString).replace("#1", count);
    });

    this.state = {
      // We may restore a previous state when changing tabs in the primary panes,
      // or when restoring primary panes from collapse.
      query: this.props.query || "",
      inputFocused: false,
      focusedItem: null,
      expanded: new Set(),
      results: [],
      navigateCounter: null,
      status: statusType.done
    }; // Use throttle for updating results in order to prevent delaying showing result until the end of the search

    this.onUpdatedResults = throttle(this.onUpdatedResults.bind(this), 100); // Use debounce for input processing in order to wait for the end of user input edition before triggerring the search

    this.doSearch = debounce(this.doSearch.bind(this), 100);
    this.doSearch();
  }

  static get propTypes() {
    return {
      doSearchForHighlight: _reactPropTypes.default.func.isRequired,
      query: _reactPropTypes.default.string.isRequired,
      searchSources: _reactPropTypes.default.func.isRequired,
      selectSpecificLocationOrSameUrl: _reactPropTypes.default.func.isRequired
    };
  }

  async doSearch() {
    // Cancel any previous async ongoing search
    if (this.searchAbortController) {
      this.searchAbortController.abort();
    }

    if (!this.state.query) {
      this.setState({
        status: statusType.done
      });
      return;
    }

    this.setState({
      status: statusType.fetching,
      results: [],
      navigateCounter: this.props.navigateCounter
    }); // Setup an AbortController whose main goal is to be able to cancel the asynchronous
    // operation done by the `searchSources` action.
    // This allows allows the React Component to receive partial updates
    // to render results as they are available.

    this.searchAbortController = new AbortController();
    await this.props.searchSources(this.state.query, this.onUpdatedResults, this.searchAbortController.signal);
  }

  onUpdatedResults(results, done, signal) {
    // debounce may delay the execution after this search has been cancelled
    if (signal.aborted) {
      return;
    }

    this.setState({
      results,
      status: done ? statusType.done : statusType.fetching
    });
  }

  renderRefreshButton() {
    if (!this.state.query) {
      return null;
    } // Highlight the refresh button when the current search results
    // are based on the previous document. doSearch will save the "navigate counter"
    // into state, while props will report the current "navigate counter".
    // The "navigate counter" is incremented each time we navigate to a new page.


    const highlight = this.state.navigateCounter != null && this.state.navigateCounter != this.props.navigateCounter;
    return (0, _reactDomFactories.button)({
      className: classnames("refresh-btn devtools-button", {
        highlight
      }),
      title: highlight ? L10N.getStr("projectTextSearch.refreshButtonTooltipOnNavigation") : L10N.getStr("projectTextSearch.refreshButtonTooltip"),
      onClick: this.doSearch
    }, _react.default.createElement(_AccessibleImage.default, {
      className: "refresh"
    }));
  }

  renderResultsToolbar() {
    if (!this.state.query) {
      return null;
    }

    return (0, _reactDomFactories.div)({
      className: "project-search-results-toolbar"
    }, (0, _reactDomFactories.span)({
      className: "results-count"
    }, this.renderSummary()), this.renderRefreshButton());
  }

  renderResults() {
    const {
      status,
      results
    } = this.state;

    if (!this.state.query) {
      return null;
    }

    if (results.length) {
      return _react.default.createElement(Tree, {
        getRoots: () => results,
        getChildren: file => file.matches || [],
        autoExpandAll: true,
        autoExpandDepth: 1,
        autoExpandNodeChildrenLimit: 100,
        getParent: () => null,
        getPath: getFilePath,
        renderItem: this.renderItem,
        focused: this.state.focusedItem,
        onFocus: this.onFocus,
        onActivate: this.onActivate,
        isExpanded: item => {
          return this.state.expanded.has(item);
        },
        onExpand: item => {
          const {
            expanded
          } = this.state;
          expanded.add(item);
          this.setState({
            expanded
          });
        },
        onCollapse: item => {
          const {
            expanded
          } = this.state;
          expanded.delete(item);
          this.setState({
            expanded
          });
        },
        preventBlur: true,
        getKey: getFilePath
      });
    }

    const msg = status === statusType.fetching ? L10N.getStr("loadingText") : L10N.getStr("projectTextSearch.noResults");
    return (0, _reactDomFactories.div)({
      className: "no-result-msg"
    }, msg);
  }

  shouldShowErrorEmoji() {
    return !this.getResultCount() && this.state.status === statusType.done;
  }

  renderInput() {
    const {
      status
    } = this.state;
    return _react.default.createElement(_SearchInput.default, {
      query: this.state.query,
      count: this.getResultCount(),
      placeholder: L10N.getStr("projectTextSearch.placeholder"),
      size: "small",
      showErrorEmoji: this.shouldShowErrorEmoji(),
      isLoading: status === statusType.fetching,
      onChange: this.inputOnChange,
      onFocus: () => this.setState({
        inputFocused: true
      }),
      onBlur: () => this.setState({
        inputFocused: false
      }),
      onKeyDown: this.onKeyDown,
      onHistoryScroll: this.onHistoryScroll,
      showClose: false,
      showExcludePatterns: true,
      excludePatternsLabel: L10N.getStr("projectTextSearch.excludePatterns.label"),
      excludePatternsPlaceholder: L10N.getStr("projectTextSearch.excludePatterns.placeholder"),
      ref: "searchInput",
      showSearchModifiers: true,
      searchKey: _constants.searchKeys.PROJECT_SEARCH,
      onToggleSearchModifier: this.doSearch
    });
  }

  render() {
    return (0, _reactDomFactories.div)({
      className: "search-container"
    }, (0, _reactDomFactories.div)({
      className: "project-text-search"
    }, (0, _reactDomFactories.div)({
      className: "header"
    }, this.renderInput()), this.renderResultsToolbar(), this.renderResults()));
  }

}

exports.ProjectSearch = ProjectSearch;
ProjectSearch.contextTypes = {
  shortcuts: _reactPropTypes.default.object
};

const mapStateToProps = state => ({
  query: (0, _index3.getProjectSearchQuery)(state),
  navigateCounter: (0, _index3.getNavigateCounter)(state)
});

var _default = (0, _reactRedux.connect)(mapStateToProps, {
  searchSources: _index.default.searchSources,
  selectSpecificLocationOrSameUrl: _index.default.selectSpecificLocationOrSameUrl,
  doSearchForHighlight: _index.default.doSearchForHighlight
})(ProjectSearch);

exports.default = _default;