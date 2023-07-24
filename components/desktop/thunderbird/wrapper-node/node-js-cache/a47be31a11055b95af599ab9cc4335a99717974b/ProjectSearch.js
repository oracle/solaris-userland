"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.ProjectSearch = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _propTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

loader.lazyRequireGetter(this, "_connect", "devtools/client/debugger/src/utils/connect");

var _actions = _interopRequireDefault(require("../../actions/index"));

loader.lazyRequireGetter(this, "_editor", "devtools/client/debugger/src/utils/editor/index");
loader.lazyRequireGetter(this, "_constants", "devtools/client/debugger/src/constants");
loader.lazyRequireGetter(this, "_projectTextSearch", "devtools/client/debugger/src/reducers/project-text-search");
loader.lazyRequireGetter(this, "_utils", "devtools/client/debugger/src/utils/sources-tree/utils");
loader.lazyRequireGetter(this, "_source", "devtools/client/debugger/src/utils/source");
loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");

var _SearchInput = _interopRequireDefault(require("../shared/SearchInput"));

var _AccessibleImage = _interopRequireDefault(require("../shared/AccessibleImage"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const {
  PluralForm
} = require("devtools/shared/plural-form");

const classnames = require("devtools/client/shared/classnames.js");

const Tree = require("devtools/client/shared/components/Tree");

function getFilePath(item, index) {
  return item.type === "RESULT" ? `${item.location.source.id}-${index || "$"}` : `${item.location.source.id}-${item.location.line}-${item.location.column}-${index || "$"}`;
}

class ProjectSearch extends _react.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "selectMatchItem", matchItem => {
      this.props.selectSpecificLocation(this.props.cx, matchItem.location);
      this.props.doSearchForHighlight(this.state.inputValue, (0, _editor.getEditor)(), matchItem.location.line, matchItem.location.column);
    });

    _defineProperty(this, "highlightMatches", lineMatch => {
      const {
        value,
        matchIndex,
        match
      } = lineMatch;
      const len = match.length;
      return _react.default.createElement("span", {
        className: "line-value"
      }, _react.default.createElement("span", {
        className: "line-match",
        key: 0
      }, value.slice(0, matchIndex)), _react.default.createElement("span", {
        className: "query-match",
        key: 1
      }, value.substr(matchIndex, len)), _react.default.createElement("span", {
        className: "line-match",
        key: 2
      }, value.slice(matchIndex + len, value.length)));
    });

    _defineProperty(this, "getResultCount", () => this.props.results.reduce((count, file) => count + file.matches.length, 0));

    _defineProperty(this, "onKeyDown", e => {
      if (e.key === "Escape") {
        return;
      }

      e.stopPropagation();
      this.setState({
        focusedItem: null
      });
      this.doSearch(this.state.inputValue);
    });

    _defineProperty(this, "onHistoryScroll", query => {
      this.setState({
        inputValue: query
      });
    });

    _defineProperty(this, "onEnterPress", () => {
      // This is to select a match from the search result.
      if (!this.state.focusedItem || this.state.inputFocused) {
        return;
      }

      if (this.state.focusedItem.type === "MATCH") {
        this.selectMatchItem(this.state.focusedItem);
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
      const {
        cx,
        clearSearch
      } = this.props;
      this.setState({
        inputValue
      });

      if (inputValue === "") {
        clearSearch(cx);
      }
    });

    _defineProperty(this, "renderFile", (file, focused, expanded) => {
      const matchesLength = file.matches.length;
      const matches = ` (${matchesLength} match${matchesLength > 1 ? "es" : ""})`;
      return _react.default.createElement("div", {
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
      }), _react.default.createElement("span", {
        className: "file-path"
      }, file.location.source.url ? (0, _utils.getRelativePath)(file.location.source.url) : (0, _source.getFormattedSourceId)(file.location.source.id)), _react.default.createElement("span", {
        className: "matches-summary"
      }, matches));
    });

    _defineProperty(this, "renderMatch", (match, focused) => {
      return _react.default.createElement("div", {
        className: classnames("result", {
          focused
        }),
        onClick: () => setTimeout(() => this.selectMatchItem(match), 50)
      }, _react.default.createElement("span", {
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

    _defineProperty(this, "renderResults", () => {
      const {
        status,
        results
      } = this.props;

      if (!this.props.query) {
        return null;
      }

      if (results.length) {
        return _react.default.createElement(Tree, {
          getRoots: () => results,
          getChildren: file => file.matches || [],
          itemHeight: 24,
          autoExpandAll: true,
          autoExpandDepth: 1,
          autoExpandNodeChildrenLimit: 100,
          getParent: item => null,
          getPath: getFilePath,
          renderItem: this.renderItem,
          focused: this.state.focusedItem,
          onFocus: this.onFocus,
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
          getKey: getFilePath
        });
      }

      const msg = status === _projectTextSearch.statusType.fetching ? L10N.getStr("loadingText") : L10N.getStr("projectTextSearch.noResults");
      return _react.default.createElement("div", {
        className: "no-result-msg absolute-center"
      }, msg);
    });

    _defineProperty(this, "renderSummary", () => {
      if (this.props.query !== "") {
        const resultsSummaryString = L10N.getStr("sourceSearch.resultsSummary2");
        const count = this.getResultCount();
        return PluralForm.get(count, resultsSummaryString).replace("#1", count);
      }

      return "";
    });

    this.state = {
      inputValue: this.props.query || "",
      inputFocused: false,
      focusedItem: null,
      expanded: new Set()
    };
  }

  static get propTypes() {
    return {
      clearSearch: _propTypes.default.func.isRequired,
      cx: _propTypes.default.object.isRequired,
      doSearchForHighlight: _propTypes.default.func.isRequired,
      query: _propTypes.default.string.isRequired,
      results: _propTypes.default.array.isRequired,
      searchSources: _propTypes.default.func.isRequired,
      selectSpecificLocation: _propTypes.default.func.isRequired,
      setActiveSearch: _propTypes.default.func.isRequired,
      status: _propTypes.default.oneOf(["INITIAL", "FETCHING", "CANCELED", "DONE", "ERROR"]).isRequired,
      modifiers: _propTypes.default.object,
      toggleProjectSearchModifier: _propTypes.default.func
    };
  }

  componentDidMount() {
    const {
      shortcuts
    } = this.context;
    shortcuts.on("Enter", this.onEnterPress);
  }

  componentWillUnmount() {
    const {
      shortcuts
    } = this.context;
    shortcuts.off("Enter", this.onEnterPress);
  }

  componentDidUpdate(prevProps) {
    // If the query changes in redux, also change it in the UI
    if (prevProps.query !== this.props.query) {
      this.setState({
        inputValue: this.props.query
      });
    }
  }

  doSearch(searchTerm) {
    if (searchTerm) {
      this.props.searchSources(this.props.cx, searchTerm);
    }
  }

  shouldShowErrorEmoji() {
    return !this.getResultCount() && this.props.status === _projectTextSearch.statusType.done;
  }

  renderInput() {
    const {
      status
    } = this.props;
    return _react.default.createElement(_SearchInput.default, {
      query: this.state.inputValue,
      count: this.getResultCount(),
      placeholder: L10N.getStr("projectTextSearch.placeholder"),
      size: "small",
      showErrorEmoji: this.shouldShowErrorEmoji(),
      summaryMsg: this.renderSummary(),
      isLoading: status === _projectTextSearch.statusType.fetching,
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
      onToggleSearchModifier: () => this.doSearch(this.state.inputValue)
    });
  }

  render() {
    return _react.default.createElement("div", {
      className: "search-container"
    }, _react.default.createElement("div", {
      className: "project-text-search"
    }, _react.default.createElement("div", {
      className: "header"
    }, this.renderInput()), this.renderResults()));
  }

}

exports.ProjectSearch = ProjectSearch;
ProjectSearch.contextTypes = {
  shortcuts: _propTypes.default.object
};

const mapStateToProps = state => ({
  cx: (0, _selectors.getContext)(state),
  results: (0, _selectors.getProjectSearchResults)(state),
  query: (0, _selectors.getProjectSearchQuery)(state),
  status: (0, _selectors.getProjectSearchStatus)(state)
});

var _default = (0, _connect.connect)(mapStateToProps, {
  searchSources: _actions.default.searchSources,
  clearSearch: _actions.default.clearSearch,
  selectSpecificLocation: _actions.default.selectSpecificLocation,
  setActiveSearch: _actions.default.setActiveSearch,
  doSearchForHighlight: _actions.default.doSearchForHighlight
})(ProjectSearch);

exports.default = _default;