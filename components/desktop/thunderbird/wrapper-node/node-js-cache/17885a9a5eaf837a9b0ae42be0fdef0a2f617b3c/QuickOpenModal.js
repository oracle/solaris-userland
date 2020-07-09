"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.QuickOpenModal = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

loader.lazyRequireGetter(this, "_connect", "devtools/client/debugger/src/utils/connect");

var _fuzzaldrinPlus = _interopRequireDefault(require("devtools/client/debugger/dist/vendors").vendored["fuzzaldrin-plus"]);

loader.lazyRequireGetter(this, "_path", "devtools/client/debugger/src/utils/path");

var _lodash = require("devtools/client/shared/vendor/lodash");

var _actions = _interopRequireDefault(require("../actions/index"));

loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_memoizeLast", "devtools/client/debugger/src/utils/memoizeLast");
loader.lazyRequireGetter(this, "_resultList", "devtools/client/debugger/src/utils/result-list");
loader.lazyRequireGetter(this, "_quickOpen", "devtools/client/debugger/src/utils/quick-open");

var _Modal = _interopRequireDefault(require("./shared/Modal"));

var _SearchInput = _interopRequireDefault(require("./shared/SearchInput"));

var _ResultList = _interopRequireDefault(require("./shared/ResultList"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const updateResultsThrottle = 100;
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
  constructor(props) {
    super(props);

    _defineProperty(this, "closeModal", () => {
      this.props.closeQuickOpen();
    });

    _defineProperty(this, "dropGoto", query => {
      const index = query.indexOf(":");
      return index !== -1 ? query.slice(0, index) : query;
    });

    _defineProperty(this, "formatSources", (0, _memoizeLast.memoizeLast)((displayedSources, tabs) => {
      const tabUrls = new Set(tabs.map(tab => tab.url));
      return (0, _quickOpen.formatSources)(displayedSources, tabUrls);
    }));

    _defineProperty(this, "searchSources", query => {
      const {
        displayedSources,
        tabs
      } = this.props;
      const sources = this.formatSources(displayedSources, tabs);
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
        displayedSources,
        tabs
      } = this.props;
      const tabUrls = new Set(tabs.map(tab => tab.url));

      if (tabs.length > 0) {
        this.setResults((0, _quickOpen.formatSources)(displayedSources.filter(source => !!source.url && tabUrls.has(source.url)), tabUrls));
      } else {
        this.setResults((0, _quickOpen.formatSources)(displayedSources, tabUrls));
      }
    });

    _defineProperty(this, "updateResults", (0, _lodash.throttle)(query => {
      if (this.isGotoQuery()) {
        return;
      }

      if (query == "" && !this.isShortcutQuery()) {
        return this.showTopSources();
      }

      if (this.isSymbolSearch()) {
        return this.searchSymbols(query);
      }

      if (this.isShortcutQuery()) {
        return this.searchShortcuts(query);
      }

      return this.searchSources(query);
    }, updateResultsThrottle));

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
        return this.setModifier(item);
      }

      if (this.isGotoSourceQuery()) {
        const location = (0, _quickOpen.parseLineColumn)(this.props.query);
        return this.gotoLocation({ ...location,
          sourceId: item.id
        });
      }

      if (this.isSymbolSearch()) {
        return this.gotoLocation({
          line: item.location && item.location.start ? item.location.start.line : 0
        });
      }

      this.gotoLocation({
        sourceId: item.id,
        line: 0
      });
    });

    _defineProperty(this, "onSelectResultItem", item => {
      const {
        selectedSource,
        highlightLineRange
      } = this.props;

      if (selectedSource == null || !this.isSymbolSearch()) {
        return;
      }

      if (this.isFunctionQuery()) {
        return highlightLineRange({ ...(item.location != null ? {
            start: item.location.start.line,
            end: item.location.end.line
          } : {}),
          sourceId: selectedSource.id
        });
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
        const selectedSourceId = selectedSource ? selectedSource.id : "";
        const sourceId = location.sourceId ? location.sourceId : selectedSourceId;
        selectSpecificLocation(cx, {
          sourceId,
          line: location.line,
          column: location.column
        });
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
      }

      this.updateResults(e.target.value);
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
          return this.gotoLocation(location);
        }

        if (results) {
          return this.selectResultItem(e, results[selectedIndex]);
        }
      }

      if (e.key === "Tab") {
        return this.closeModal();
      }

      if (["ArrowUp", "ArrowDown"].includes(e.key)) {
        e.preventDefault();
        return this.traverseResults(e);
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
    const expanded = !!items && items.length > 0;
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

function mapStateToProps(state) {
  const selectedSource = (0, _selectors.getSelectedSource)(state);
  const displayedSources = (0, _selectors.getDisplayedSourcesList)(state);
  const tabs = (0, _selectors.getTabs)(state);
  return {
    cx: (0, _selectors.getContext)(state),
    enabled: (0, _selectors.getQuickOpenEnabled)(state),
    displayedSources,
    selectedSource,
    selectedContentLoaded: selectedSource ? !!(0, _selectors.getSourceContent)(state, selectedSource.id) : undefined,
    symbols: (0, _quickOpen.formatSymbols)((0, _selectors.getSymbols)(state, selectedSource)),
    symbolsLoading: (0, _selectors.isSymbolsLoading)(state, selectedSource),
    query: (0, _selectors.getQuickOpenQuery)(state),
    searchType: (0, _selectors.getQuickOpenType)(state),
    tabs
  };
}
/* istanbul ignore next: ignoring testing of redux connection stuff */


var _default = (0, _connect.connect)(mapStateToProps, {
  selectSpecificLocation: _actions.default.selectSpecificLocation,
  setQuickOpenQuery: _actions.default.setQuickOpenQuery,
  highlightLineRange: _actions.default.highlightLineRange,
  closeQuickOpen: _actions.default.closeQuickOpen
})(QuickOpenModal);

exports.default = _default;