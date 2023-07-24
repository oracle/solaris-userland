"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.QuickOpenModal = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _propTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

loader.lazyRequireGetter(this, "_connect", "devtools/client/debugger/src/utils/connect");

var _fuzzaldrinPlus = _interopRequireDefault(require("devtools/client/debugger/dist/vendors").vendored["fuzzaldrin-plus"]);

loader.lazyRequireGetter(this, "_path", "devtools/client/debugger/src/utils/path");
loader.lazyRequireGetter(this, "_location", "devtools/client/debugger/src/utils/location");

var _actions = _interopRequireDefault(require("../actions/index"));

loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_memoizeLast", "devtools/client/debugger/src/utils/memoizeLast");
loader.lazyRequireGetter(this, "_resultList", "devtools/client/debugger/src/utils/result-list");
loader.lazyRequireGetter(this, "_constants", "devtools/client/debugger/src/constants");
loader.lazyRequireGetter(this, "_quickOpen", "devtools/client/debugger/src/utils/quick-open");

var _Modal = _interopRequireDefault(require("./shared/Modal"));

var _SearchInput = _interopRequireDefault(require("./shared/SearchInput"));

var _ResultList = _interopRequireDefault(require("./shared/ResultList"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const {
  throttle
} = require("devtools/shared/throttle");

const maxResults = 100;
const SIZE_BIG = {
  size: "big"
};
const SIZE_DEFAULT = {};

function filter(values, query) {
  const preparedQuery = _fuzzaldrinPlus.default.prepareQuery(query);

  return _fuzzaldrinPlus.default.filter(values, query, {
    key: "value",
    maxResults,
    preparedQuery
  });
}

class QuickOpenModal extends _react.Component {
  // Put it on the class so it can be retrieved in tests
  constructor(props) {
    super(props);

    _defineProperty(this, "closeModal", () => {
      this.props.closeQuickOpen();
    });

    _defineProperty(this, "dropGoto", query => {
      const index = query.indexOf(":");
      return index !== -1 ? query.slice(0, index) : query;
    });

    _defineProperty(this, "formatSources", (0, _memoizeLast.memoizeLast)((displayedSources, tabUrls, blackBoxRanges, projectDirectoryRoot) => {
      // Note that we should format all displayed sources,
      // the actual filtering will only be done late from `searchSources()`
      return displayedSources.map(source => {
        const isBlackBoxed = !!blackBoxRanges[source.url];
        const hasTabOpened = tabUrls.includes(source.url);
        return (0, _quickOpen.formatSourceForList)(source, hasTabOpened, isBlackBoxed, projectDirectoryRoot);
      });
    }));

    _defineProperty(this, "searchSources", query => {
      const {
        displayedSources,
        tabUrls,
        blackBoxRanges,
        projectDirectoryRoot
      } = this.props;
      const sources = this.formatSources(displayedSources, tabUrls, blackBoxRanges, projectDirectoryRoot);
      const results = query == "" ? sources : filter(sources, this.dropGoto(query));
      return this.setResults(results);
    });

    _defineProperty(this, "searchSymbols", query => {
      const {
        symbols: {
          functions
        }
      } = this.props;
      let results = functions;
      results = results.filter(result => result.title !== "anonymous");

      if (query === "@" || query === "#") {
        return this.setResults(results);
      }

      results = filter(results, query.slice(1));
      return this.setResults(results);
    });

    _defineProperty(this, "searchShortcuts", query => {
      const results = (0, _quickOpen.formatShortcutResults)();

      if (query == "?") {
        this.setResults(results);
      } else {
        this.setResults(filter(results, query.slice(1)));
      }
    });

    _defineProperty(this, "showTopSources", () => {
      const {
        tabUrls,
        blackBoxRanges,
        projectDirectoryRoot
      } = this.props;
      let {
        displayedSources
      } = this.props; // If there is some tabs opened, only show tab's sources.
      // Otherwise, we display all visible sources (per SourceTree definition),
      // setResults will restrict the number of results to a maximum limit.

      if (tabUrls.length) {
        displayedSources = displayedSources.filter(source => !!source.url && tabUrls.includes(source.url));
      }

      this.setResults(this.formatSources(displayedSources, tabUrls, blackBoxRanges, projectDirectoryRoot));
    });

    _defineProperty(this, "updateResults", throttle(query => {
      if (this.isGotoQuery()) {
        return;
      }

      if (query == "" && !this.isShortcutQuery()) {
        this.showTopSources();
        return;
      }

      if (this.isSymbolSearch()) {
        this.searchSymbols(query);
        return;
      }

      if (this.isShortcutQuery()) {
        this.searchShortcuts(query);
        return;
      }

      this.searchSources(query);
    }, QuickOpenModal.UPDATE_RESULTS_THROTTLE));

    _defineProperty(this, "setModifier", item => {
      if (["@", "#", ":"].includes(item.id)) {
        this.props.setQuickOpenQuery(item.id);
      }
    });

    _defineProperty(this, "selectResultItem", (e, item) => {
      if (item == null) {
        return;
      }

      if (this.isShortcutQuery()) {
        this.setModifier(item);
        return;
      }

      if (this.isGotoSourceQuery()) {
        const location = (0, _quickOpen.parseLineColumn)(this.props.query);
        this.gotoLocation({ ...location,
          source: item.source
        });
        return;
      }

      if (this.isSymbolSearch()) {
        this.gotoLocation({
          line: item.location && item.location.start ? item.location.start.line : 0
        });
        return;
      }

      this.gotoLocation({
        source: item.source,
        line: 0
      });
    });

    _defineProperty(this, "onSelectResultItem", item => {
      const {
        selectedSource,
        highlightLineRange,
        clearHighlightLineRange
      } = this.props;

      if (selectedSource == null || !this.isSymbolSearch() || !this.isFunctionQuery()) {
        return;
      }

      if (item.location) {
        highlightLineRange({
          start: item.location.start.line,
          end: item.location.end.line,
          sourceId: selectedSource.id
        });
      } else {
        clearHighlightLineRange();
      }
    });

    _defineProperty(this, "traverseResults", e => {
      const direction = e.key === "ArrowUp" ? -1 : 1;
      const {
        selectedIndex,
        results
      } = this.state;
      const resultCount = this.getResultCount();
      const index = selectedIndex + direction;
      const nextIndex = (index + resultCount) % resultCount || 0;
      this.setState({
        selectedIndex: nextIndex
      });

      if (results != null) {
        this.onSelectResultItem(results[nextIndex]);
      }
    });

    _defineProperty(this, "gotoLocation", location => {
      const {
        cx,
        selectSpecificLocation,
        selectedSource
      } = this.props;

      if (location != null) {
        selectSpecificLocation(cx, (0, _location.createLocation)({
          source: location.source || selectedSource,
          line: location.line,
          column: location.column
        }));
        this.closeModal();
      }
    });

    _defineProperty(this, "onChange", e => {
      const {
        selectedSource,
        selectedContentLoaded,
        setQuickOpenQuery
      } = this.props;
      setQuickOpenQuery(e.target.value);
      const noSource = !selectedSource || !selectedContentLoaded;

      if (noSource && this.isSymbolSearch() || this.isGotoQuery()) {
        return;
      } // Wait for the next tick so that reducer updates are complete.


      const targetValue = e.target.value;
      setTimeout(() => this.updateResults(targetValue), 0);
    });

    _defineProperty(this, "onKeyDown", e => {
      const {
        enabled,
        query
      } = this.props;
      const {
        results,
        selectedIndex
      } = this.state;
      const isGoToQuery = this.isGotoQuery();

      if ((!enabled || !results) && !isGoToQuery) {
        return;
      }

      if (e.key === "Enter") {
        if (isGoToQuery) {
          const location = (0, _quickOpen.parseLineColumn)(query);
          this.gotoLocation(location);
          return;
        }

        if (results) {
          this.selectResultItem(e, results[selectedIndex]);
          return;
        }
      }

      if (e.key === "Tab") {
        this.closeModal();
        return;
      }

      if (["ArrowUp", "ArrowDown"].includes(e.key)) {
        e.preventDefault();
        this.traverseResults(e);
      }
    });

    _defineProperty(this, "getResultCount", () => {
      const {
        results
      } = this.state;
      return results && results.length ? results.length : 0;
    });

    _defineProperty(this, "isFunctionQuery", () => this.props.searchType === "functions");

    _defineProperty(this, "isSymbolSearch", () => this.isFunctionQuery());

    _defineProperty(this, "isGotoQuery", () => this.props.searchType === "goto");

    _defineProperty(this, "isGotoSourceQuery", () => this.props.searchType === "gotoSource");

    _defineProperty(this, "isShortcutQuery", () => this.props.searchType === "shortcuts");

    _defineProperty(this, "isSourcesQuery", () => this.props.searchType === "sources");

    _defineProperty(this, "isSourceSearch", () => this.isSourcesQuery() || this.isGotoSourceQuery());

    _defineProperty(this, "highlightMatching", (query, results) => {
      let newQuery = query;

      if (newQuery === "") {
        return results;
      }

      newQuery = query.replace(/[@:#?]/gi, " ");
      return results.map(result => {
        if (typeof result.title == "string") {
          return { ...result,
            title: this.renderHighlight(result.title, (0, _path.basename)(newQuery), "title")
          };
        }

        return result;
      });
    });

    this.state = {
      results: null,
      selectedIndex: 0
    };
  }

  static get propTypes() {
    return {
      closeQuickOpen: _propTypes.default.func.isRequired,
      cx: _propTypes.default.object.isRequired,
      displayedSources: _propTypes.default.array.isRequired,
      blackBoxRanges: _propTypes.default.object.isRequired,
      enabled: _propTypes.default.bool.isRequired,
      highlightLineRange: _propTypes.default.func.isRequired,
      clearHighlightLineRange: _propTypes.default.func.isRequired,
      query: _propTypes.default.string.isRequired,
      searchType: _propTypes.default.oneOf(["functions", "goto", "gotoSource", "other", "shortcuts", "sources", "variables"]).isRequired,
      selectSpecificLocation: _propTypes.default.func.isRequired,
      selectedContentLoaded: _propTypes.default.bool,
      selectedSource: _propTypes.default.object,
      setQuickOpenQuery: _propTypes.default.func.isRequired,
      shortcutsModalEnabled: _propTypes.default.bool.isRequired,
      symbols: _propTypes.default.object.isRequired,
      symbolsLoading: _propTypes.default.bool.isRequired,
      tabUrls: _propTypes.default.array.isRequired,
      toggleShortcutsModal: _propTypes.default.func.isRequired,
      projectDirectoryRoot: _propTypes.default.string
    };
  }

  setResults(results) {
    if (results) {
      results = results.slice(0, maxResults);
    }

    this.setState({
      results
    });
  }

  componentDidMount() {
    const {
      query,
      shortcutsModalEnabled,
      toggleShortcutsModal
    } = this.props;
    this.updateResults(query);

    if (shortcutsModalEnabled) {
      toggleShortcutsModal();
    }
  }

  componentDidUpdate(prevProps) {
    const nowEnabled = !prevProps.enabled && this.props.enabled;
    const queryChanged = prevProps.query !== this.props.query;

    if (this.refs.resultList && this.refs.resultList.refs) {
      (0, _resultList.scrollList)(this.refs.resultList.refs, this.state.selectedIndex);
    }

    if (nowEnabled || queryChanged) {
      this.updateResults(this.props.query);
    }
  }

  /* eslint-disable react/no-danger */
  renderHighlight(candidateString, query, name) {
    const options = {
      wrap: {
        tagOpen: '<mark class="highlight">',
        tagClose: "</mark>"
      }
    };

    const html = _fuzzaldrinPlus.default.wrap(candidateString, query, options);

    return _react.default.createElement("div", {
      dangerouslySetInnerHTML: {
        __html: html
      }
    });
  }

  shouldShowErrorEmoji() {
    const {
      query
    } = this.props;

    if (this.isGotoQuery()) {
      return !/^:\d*$/.test(query);
    }

    return !!query && !this.getResultCount();
  }

  getSummaryMessage() {
    let summaryMsg = "";

    if (this.isGotoQuery()) {
      summaryMsg = L10N.getStr("shortcuts.gotoLine");
    } else if (this.isFunctionQuery() && this.props.symbolsLoading) {
      summaryMsg = L10N.getStr("loadingText");
    }

    return summaryMsg;
  }

  render() {
    const {
      enabled,
      query
    } = this.props;
    const {
      selectedIndex,
      results
    } = this.state;

    if (!enabled) {
      return null;
    }

    const items = this.highlightMatching(query, results || []);
    const expanded = !!items && !!items.length;
    return _react.default.createElement(_Modal.default, {
      in: enabled,
      handleClose: this.closeModal
    }, _react.default.createElement(_SearchInput.default, _extends({
      query: query,
      hasPrefix: true,
      count: this.getResultCount(),
      placeholder: L10N.getStr("sourceSearch.search2"),
      summaryMsg: this.getSummaryMessage(),
      showErrorEmoji: this.shouldShowErrorEmoji(),
      isLoading: false,
      onChange: this.onChange,
      onKeyDown: this.onKeyDown,
      handleClose: this.closeModal,
      expanded: expanded,
      showClose: false,
      searchKey: _constants.searchKeys.QUICKOPEN_SEARCH,
      showExcludePatterns: false,
      showSearchModifiers: false,
      selectedItemId: expanded && items[selectedIndex] ? items[selectedIndex].id : ""
    }, this.isSourceSearch() ? SIZE_BIG : SIZE_DEFAULT)), results && _react.default.createElement(_ResultList.default, _extends({
      key: "results",
      items: items,
      selected: selectedIndex,
      selectItem: this.selectResultItem,
      ref: "resultList",
      expanded: expanded
    }, this.isSourceSearch() ? SIZE_BIG : SIZE_DEFAULT)));
  }

}
/* istanbul ignore next: ignoring testing of redux connection stuff */


exports.QuickOpenModal = QuickOpenModal;

_defineProperty(QuickOpenModal, "UPDATE_RESULTS_THROTTLE", 100);

function mapStateToProps(state) {
  const selectedSource = (0, _selectors.getSelectedSource)(state);
  const location = (0, _selectors.getSelectedLocation)(state);
  const displayedSources = (0, _selectors.getDisplayedSourcesList)(state);
  const tabs = (0, _selectors.getTabs)(state);
  const tabUrls = [...new Set(tabs.map(tab => tab.url))];
  const symbols = (0, _selectors.getSymbols)(state, location);
  return {
    cx: (0, _selectors.getContext)(state),
    enabled: (0, _selectors.getQuickOpenEnabled)(state),
    displayedSources,
    blackBoxRanges: (0, _selectors.getBlackBoxRanges)(state),
    projectDirectoryRoot: (0, _selectors.getProjectDirectoryRoot)(state),
    selectedSource,
    selectedContentLoaded: location ? !!(0, _selectors.getSettledSourceTextContent)(state, location) : undefined,
    symbols: (0, _quickOpen.formatSymbols)(symbols, maxResults),
    symbolsLoading: !symbols,
    query: (0, _selectors.getQuickOpenQuery)(state),
    searchType: (0, _selectors.getQuickOpenType)(state),
    tabUrls
  };
}

var _default = (0, _connect.connect)(mapStateToProps, {
  selectSpecificLocation: _actions.default.selectSpecificLocation,
  setQuickOpenQuery: _actions.default.setQuickOpenQuery,
  highlightLineRange: _actions.default.highlightLineRange,
  clearHighlightLineRange: _actions.default.clearHighlightLineRange,
  closeQuickOpen: _actions.default.closeQuickOpen
})(QuickOpenModal);

exports.default = _default;