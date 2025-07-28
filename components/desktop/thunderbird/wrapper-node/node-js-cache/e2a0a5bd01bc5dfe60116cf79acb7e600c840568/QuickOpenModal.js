"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.QuickOpenModal = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _reactDomFactories = require("devtools/client/shared/vendor/react-dom-factories");

var _reactPropTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

var _reactRedux = require("devtools/client/shared/vendor/react-redux");

loader.lazyRequireGetter(this, "_path", "devtools/client/debugger/src/utils/path");
loader.lazyRequireGetter(this, "_location", "devtools/client/debugger/src/utils/location");

var _index = _interopRequireDefault(require("../actions/index"));

loader.lazyRequireGetter(this, "_index2", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_memoizeLast", "devtools/client/debugger/src/utils/memoizeLast");
loader.lazyRequireGetter(this, "_constants", "devtools/client/debugger/src/constants");
loader.lazyRequireGetter(this, "_quickOpen", "devtools/client/debugger/src/utils/quick-open");

var _Modal = _interopRequireDefault(require("./shared/Modal"));

var _SearchInput = _interopRequireDefault(require("./shared/SearchInput"));

var _ResultList = _interopRequireDefault(require("./shared/ResultList"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to set private field on non-instance"); } if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } return value; }

const fuzzyAldrin = require("resource://devtools/client/shared/vendor/fuzzaldrin-plus.js");

const {
  throttle
} = require("resource://devtools/shared/throttle.js");

const maxResults = 100;
const SIZE_BIG = {
  size: "big"
};
const SIZE_DEFAULT = {};

function filter(values, query, key = "value") {
  const preparedQuery = fuzzyAldrin.prepareQuery(query);
  return fuzzyAldrin.filter(values, query, {
    key,
    maxResults,
    preparedQuery
  });
}

class QuickOpenModal extends _react.Component {
  // Put it on the class so it can be retrieved in tests
  constructor(props) {
    super(props);

    _willUnmountCalled.set(this, {
      writable: true,
      value: false
    });

    _defineProperty(this, "closeModal", () => {
      this.props.closeQuickOpen();
    });

    _defineProperty(this, "dropGoto", query => {
      const index = query.indexOf(":");
      return index !== -1 ? query.slice(0, index) : query;
    });

    _defineProperty(this, "formatSources", (0, _memoizeLast.memoizeLast)((displayedSources, openedTabUrls, blackBoxRanges, projectDirectoryRoot) => {
      // Note that we should format all displayed sources,
      // the actual filtering will only be done late from `searchSources()`
      return displayedSources.map(source => {
        const isBlackBoxed = !!blackBoxRanges[source.url];
        const hasTabOpened = openedTabUrls.includes(source.url);
        return (0, _quickOpen.formatSourceForList)(source, hasTabOpened, isBlackBoxed, projectDirectoryRoot);
      });
    }));

    _defineProperty(this, "searchSources", query => {
      const {
        displayedSources,
        openedTabUrls,
        blackBoxRanges,
        projectDirectoryRoot
      } = this.props;
      const sources = this.formatSources(displayedSources, openedTabUrls, blackBoxRanges, projectDirectoryRoot);
      const results = query == "" ? sources : filter(sources, this.dropGoto(query));
      return this.setResults(results);
    });

    _defineProperty(this, "searchSymbols", async query => {
      const {
        getFunctionSymbols,
        selectedLocation
      } = this.props;

      if (!selectedLocation) {
        return this.setResults([]);
      }

      let results = await getFunctionSymbols(selectedLocation, maxResults);

      if (query === "@" || query === "#") {
        results = results.map(_quickOpen.formatSymbol);
        return this.setResults(results);
      }

      results = filter(results, query.slice(1), "name");
      results = results.map(_quickOpen.formatSymbol);
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
        openedTabUrls,
        blackBoxRanges,
        projectDirectoryRoot
      } = this.props;
      let {
        displayedSources
      } = this.props; // If there is some tabs opened, only show tab's sources.
      // Otherwise, we display all visible sources (per SourceTree definition),
      // setResults will restrict the number of results to a maximum limit.

      if (openedTabUrls.length) {
        displayedSources = displayedSources.filter(source => !!source.url && openedTabUrls.includes(source.url));
      }

      this.setResults(this.formatSources(displayedSources, openedTabUrls, blackBoxRanges, projectDirectoryRoot));
    });

    _defineProperty(this, "updateResults", throttle(async query => {
      try {
        if (this.isGotoQuery()) {
          return;
        }

        if (query == "" && !this.isShortcutQuery()) {
          this.showTopSources();
          return;
        }

        if (this.isSymbolSearch()) {
          await this.searchSymbols(query);
          return;
        }

        if (this.isShortcutQuery()) {
          this.searchShortcuts(query);
          return;
        }

        this.searchSources(query);
      } catch (e) {
        // Due to throttling this might get scheduled after the component and the
        // toolbox are destroyed.
        if (_classPrivateFieldGet(this, _willUnmountCalled)) {
          console.warn("Throttled QuickOpen.updateResults failed", e);
        } else {
          throw e;
        }
      }
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
        selectedLocation,
        highlightLineRange,
        clearHighlightLineRange
      } = this.props;

      if (selectedLocation == null || !this.isSymbolSearch() || !this.isFunctionQuery()) {
        return;
      }

      if (item.location) {
        highlightLineRange({
          start: item.location.start.line,
          end: item.location.end.line,
          sourceId: selectedLocation.source.id
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
        selectSpecificLocation,
        selectedLocation,
        updateCursorPosition
      } = this.props;

      if (location != null) {
        const sourceLocation = (0, _location.createLocation)({
          source: location.source || selectedLocation?.source,
          line: location.line,
          column: location.column || 0
        });
        selectSpecificLocation(sourceLocation);
        updateCursorPosition(sourceLocation);
        this.closeModal();
      }
    });

    _defineProperty(this, "onChange", e => {
      const {
        selectedLocation,
        selectedContentLoaded,
        setQuickOpenQuery
      } = this.props;
      setQuickOpenQuery(e.target.value);
      const noSource = !selectedLocation || !selectedContentLoaded;

      if (noSource && this.isSymbolSearch() || this.isGotoQuery()) {
        return;
      } // Wait for the next tick so that reducer updates are complete.


      const targetValue = e.target.value;
      setTimeout(() => this.updateResults(targetValue), 0);
    });

    _defineProperty(this, "onKeyDown", e => {
      const {
        query
      } = this.props;
      const {
        results,
        selectedIndex
      } = this.state;
      const isGoToQuery = this.isGotoQuery();

      if (!results && !isGoToQuery) {
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
      closeQuickOpen: _reactPropTypes.default.func.isRequired,
      displayedSources: _reactPropTypes.default.array.isRequired,
      blackBoxRanges: _reactPropTypes.default.object.isRequired,
      highlightLineRange: _reactPropTypes.default.func.isRequired,
      clearHighlightLineRange: _reactPropTypes.default.func.isRequired,
      query: _reactPropTypes.default.string.isRequired,
      searchType: _reactPropTypes.default.oneOf(["functions", "goto", "gotoSource", "other", "shortcuts", "sources", "variables"]).isRequired,
      selectSpecificLocation: _reactPropTypes.default.func.isRequired,
      selectedContentLoaded: _reactPropTypes.default.bool,
      selectedLocation: _reactPropTypes.default.object,
      setQuickOpenQuery: _reactPropTypes.default.func.isRequired,
      openedTabUrls: _reactPropTypes.default.array.isRequired,
      toggleShortcutsModal: _reactPropTypes.default.func.isRequired,
      projectDirectoryRoot: _reactPropTypes.default.string,
      getFunctionSymbols: _reactPropTypes.default.func.isRequired,
      updateCursorPosition: _reactPropTypes.default.func.isRequired
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
    const queryChanged = prevProps.query !== this.props.query;

    if (queryChanged) {
      this.updateResults(this.props.query);
    }
  }

  componentWillUnmount() {
    _classPrivateFieldSet(this, _willUnmountCalled, true);
  }

  /* eslint-disable react/no-danger */
  renderHighlight(candidateString, query) {
    const options = {
      wrap: {
        tagOpen: '<mark class="highlight">',
        tagClose: "</mark>"
      }
    };
    const html = fuzzyAldrin.wrap(candidateString, query, options);
    return (0, _reactDomFactories.div)({
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
    } else if (this.isFunctionQuery() && !this.state.results) {
      summaryMsg = L10N.getStr("loadingText");
    }

    return summaryMsg;
  }

  render() {
    const {
      query
    } = this.props;
    const {
      selectedIndex,
      results
    } = this.state;
    const items = this.highlightMatching(query, results || []);
    const expanded = !!items && !!items.length;
    return _react.default.createElement(_Modal.default, {
      handleClose: this.closeModal
    }, _react.default.createElement(_SearchInput.default, {
      query,
      hasPrefix: true,
      count: this.getResultCount(),
      placeholder: L10N.getStr("sourceSearch.search2"),
      summaryMsg: this.getSummaryMessage(),
      showErrorEmoji: this.shouldShowErrorEmoji(),
      isLoading: false,
      onChange: this.onChange,
      onKeyDown: this.onKeyDown,
      handleClose: this.closeModal,
      expanded,
      showClose: false,
      searchKey: _constants.searchKeys.QUICKOPEN_SEARCH,
      showExcludePatterns: false,
      showSearchModifiers: false,
      selectedItemId: expanded && items[selectedIndex] ? items[selectedIndex].id : "",
      ...(this.isSourceSearch() ? SIZE_BIG : SIZE_DEFAULT)
    }), results && _react.default.createElement(_ResultList.default, {
      key: "results",
      items,
      selected: selectedIndex,
      selectItem: this.selectResultItem,
      ref: "resultList",
      expanded,
      ...(this.isSourceSearch() ? SIZE_BIG : SIZE_DEFAULT)
    }));
  }

}
/* istanbul ignore next: ignoring testing of redux connection stuff */


exports.QuickOpenModal = QuickOpenModal;

var _willUnmountCalled = new WeakMap();

_defineProperty(QuickOpenModal, "UPDATE_RESULTS_THROTTLE", 100);

function mapStateToProps(state) {
  const selectedLocation = (0, _index2.getSelectedLocation)(state);
  const displayedSources = (0, _index2.getDisplayedSourcesList)(state);
  const tabs = (0, _index2.getSourceTabs)(state);
  const openedTabUrls = [...new Set(tabs.map(tab => tab.url))];
  return {
    displayedSources,
    blackBoxRanges: (0, _index2.getBlackBoxRanges)(state),
    projectDirectoryRoot: (0, _index2.getProjectDirectoryRoot)(state),
    selectedLocation,
    selectedContentLoaded: selectedLocation ? !!(0, _index2.getSettledSourceTextContent)(state, selectedLocation) : undefined,
    query: (0, _index2.getQuickOpenQuery)(state),
    searchType: (0, _index2.getQuickOpenType)(state),
    openedTabUrls
  };
}

var _default = (0, _reactRedux.connect)(mapStateToProps, {
  selectSpecificLocation: _index.default.selectSpecificLocation,
  setQuickOpenQuery: _index.default.setQuickOpenQuery,
  highlightLineRange: _index.default.highlightLineRange,
  clearHighlightLineRange: _index.default.clearHighlightLineRange,
  closeQuickOpen: _index.default.closeQuickOpen,
  getFunctionSymbols: _index.default.getFunctionSymbols,
  updateCursorPosition: _index.default.updateCursorPosition
})(QuickOpenModal);

exports.default = _default;