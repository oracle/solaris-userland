"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.ProjectSearch = void 0;

var _propTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

loader.lazyRequireGetter(this, "_connect", "devtools/client/debugger/src/utils/connect");

var _classnames = _interopRequireDefault(require("devtools/client/debugger/dist/vendors").vendored["classnames"]);

var _actions = _interopRequireDefault(require("../actions/index"));

loader.lazyRequireGetter(this, "_editor", "devtools/client/debugger/src/utils/editor/index");
loader.lazyRequireGetter(this, "_projectSearch", "devtools/client/debugger/src/utils/project-search");
loader.lazyRequireGetter(this, "_projectTextSearch", "devtools/client/debugger/src/reducers/project-text-search");
loader.lazyRequireGetter(this, "_sourcesTree", "devtools/client/debugger/src/utils/sources-tree/index");
loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");

var _ManagedTree = _interopRequireDefault(require("./shared/ManagedTree"));

var _SearchInput = _interopRequireDefault(require("./shared/SearchInput"));

var _AccessibleImage = _interopRequireDefault(require("./shared/AccessibleImage"));

var _pluralForm = _interopRequireDefault(require("devtools/shared/plural-form"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function getFilePath(item, index) {
  return item.type === "RESULT" ? `${item.sourceId}-${index || "$"}` : `${item.sourceId}-${item.line}-${item.column}-${index || "$"}`;
}

function sanitizeQuery(query) {
  // no '\' at end of query
  return query.replace(/\\$/, "");
}

class ProjectSearch extends _react.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "toggleProjectTextSearch", (key, e) => {
      const {
        cx,
        closeProjectSearch,
        setActiveSearch
      } = this.props;

      if (e) {
        e.preventDefault();
      }

      if (this.isProjectSearchEnabled()) {
        return closeProjectSearch(cx);
      }

      return setActiveSearch("project");
    });

    _defineProperty(this, "isProjectSearchEnabled", () => this.props.activeSearch === "project");

    _defineProperty(this, "selectMatchItem", matchItem => {
      this.props.selectSpecificLocation(this.props.cx, {
        sourceId: matchItem.sourceId,
        line: matchItem.line,
        column: matchItem.column
      });
      this.props.doSearchForHighlight(this.state.inputValue, (0, _editor.getEditor)(), matchItem.line, matchItem.column);
    });

    _defineProperty(this, "getResultCount", () => this.props.results.reduce((count, file) => count + file.matches.length, 0));

    _defineProperty(this, "onKeyDown", e => {
      if (e.key === "Escape") {
        return;
      }

      e.stopPropagation();

      if (e.key !== "Enter") {
        return;
      }

      this.setState({
        focusedItem: null
      });
      const query = sanitizeQuery(this.state.inputValue);

      if (query) {
        this.doSearch(query);
      }
    });

    _defineProperty(this, "onHistoryScroll", query => {
      this.setState({
        inputValue: query
      });
    });

    _defineProperty(this, "onEnterPress", () => {
      if (!this.isProjectSearchEnabled() || !this.state.focusedItem || this.state.inputFocused) {
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
        className: (0, _classnames.default)("file-result", {
          focused
        }),
        key: file.sourceId
      }, _react.default.createElement(_AccessibleImage.default, {
        className: (0, _classnames.default)("arrow", {
          expanded
        })
      }), _react.default.createElement(_AccessibleImage.default, {
        className: "file"
      }), _react.default.createElement("span", {
        className: "file-path"
      }, (0, _sourcesTree.getRelativePath)(file.filepath)), _react.default.createElement("span", {
        className: "matches-summary"
      }, matches));
    });

    _defineProperty(this, "renderMatch", (match, focused) => {
      return _react.default.createElement("div", {
        className: (0, _classnames.default)("result", {
          focused
        }),
        onClick: () => setTimeout(() => this.selectMatchItem(match), 50)
      }, _react.default.createElement("span", {
        className: "line-number",
        key: match.line
      }, match.line), (0, _projectSearch.highlightMatches)(match));
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
        return;
      }

      if (results.length) {
        return _react.default.createElement(_ManagedTree.default, {
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
          onFocus: this.onFocus
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
        return _pluralForm.default.get(count, resultsSummaryString).replace("#1", count);
      }

      return "";
    });

    this.state = {
      inputValue: this.props.query || "",
      inputFocused: false,
      focusedItem: null
    };
  }

  componentDidMount() {
    const {
      shortcuts
    } = this.context;
    shortcuts.on(L10N.getStr("projectTextSearch.key"), this.toggleProjectTextSearch);
    shortcuts.on("Enter", this.onEnterPress);
  }

  componentWillUnmount() {
    const {
      shortcuts
    } = this.context;
    shortcuts.off(L10N.getStr("projectTextSearch.key"), this.toggleProjectTextSearch);
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
    this.props.searchSources(this.props.cx, searchTerm);
  }

  shouldShowErrorEmoji() {
    return !this.getResultCount() && this.props.status === _projectTextSearch.statusType.done;
  }

  renderInput() {
    const {
      cx,
      closeProjectSearch,
      status
    } = this.props;
    return _react.default.createElement(_SearchInput.default, {
      query: this.state.inputValue,
      count: this.getResultCount(),
      placeholder: L10N.getStr("projectTextSearch.placeholder"),
      size: "big",
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
      handleClose: () => closeProjectSearch(cx),
      ref: "searchInput"
    });
  }

  render() {
    if (!this.isProjectSearchEnabled()) {
      return null;
    }

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
  activeSearch: (0, _selectors.getActiveSearch)(state),
  results: (0, _selectors.getTextSearchResults)(state),
  query: (0, _selectors.getTextSearchQuery)(state),
  status: (0, _selectors.getTextSearchStatus)(state)
});

var _default = (0, _connect.connect)(mapStateToProps, {
  closeProjectSearch: _actions.default.closeProjectSearch,
  searchSources: _actions.default.searchSources,
  clearSearch: _actions.default.clearSearch,
  selectSpecificLocation: _actions.default.selectSpecificLocation,
  setActiveSearch: _actions.default.setActiveSearch,
  doSearchForHighlight: _actions.default.doSearchForHighlight
})(ProjectSearch);

exports.default = _default;