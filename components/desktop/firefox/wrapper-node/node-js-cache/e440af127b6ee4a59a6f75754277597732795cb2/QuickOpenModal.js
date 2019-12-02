"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.QuickOpenModal = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /* This Source Code Form is subject to the terms of the Mozilla Public
                                                                                                                                                                                                                                                                   * License, v. 2.0. If a copy of the MPL was not distributed with this
                                                                                                                                                                                                                                                                   * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

var _react = require("devtools/client/shared/vendor/react");

var _react2 = _interopRequireDefault(_react);

var _connect = require("../utils/connect");

var _fuzzaldrinPlus = require("devtools/client/debugger/dist/vendors").vendored["fuzzaldrin-plus"];

var _fuzzaldrinPlus2 = _interopRequireDefault(_fuzzaldrinPlus);

var _path = require("../utils/path");

var _lodash = require("devtools/client/shared/vendor/lodash");

var _actions = require("../actions/index");

var _actions2 = _interopRequireDefault(_actions);

var _selectors = require("../selectors/index");

var _resultList = require("../utils/result-list");

var _quickOpen = require("../utils/quick-open");

var _Modal = require("./shared/Modal");

var _Modal2 = _interopRequireDefault(_Modal);

var _SearchInput = require("./shared/SearchInput");

var _SearchInput2 = _interopRequireDefault(_SearchInput);

var _ResultList = require("./shared/ResultList");

var _ResultList2 = _interopRequireDefault(_ResultList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const updateResultsThrottle = 100;
const maxResults = 100;

function filter(values, query) {
  const preparedQuery = _fuzzaldrinPlus2.default.prepareQuery(query);

  return _fuzzaldrinPlus2.default.filter(values, query, {
    key: "value",
    maxResults: maxResults,
    preparedQuery
  });
}

class QuickOpenModal extends _react.Component {
  constructor(props) {
    super(props);

    this.closeModal = () => {
      this.props.closeQuickOpen();
    };

    this.dropGoto = query => {
      return query.split(":")[0];
    };

    this.searchSources = query => {
      const { displayedSources, tabs } = this.props;
      const tabUrls = new Set(tabs.map(tab => tab.url));
      const sources = (0, _quickOpen.formatSources)(displayedSources, tabUrls);

      const results = query == "" ? sources : filter(sources, this.dropGoto(query));
      return this.setResults(results);
    };

    this.searchSymbols = query => {
      const {
        symbols: { functions }
      } = this.props;

      let results = functions;
      results = results.filter(result => result.title !== "anonymous");

      if (query === "@" || query === "#") {
        return this.setResults(results);
      }
      results = filter(results, query.slice(1));
      return this.setResults(results);
    };

    this.searchShortcuts = query => {
      const results = (0, _quickOpen.formatShortcutResults)();
      if (query == "?") {
        this.setResults(results);
      } else {
        this.setResults(filter(results, query.slice(1)));
      }
    };

    this.showTopSources = () => {
      const { displayedSources, tabs } = this.props;
      const tabUrls = new Set(tabs.map(tab => tab.url));

      if (tabs.length > 0) {
        this.setResults((0, _quickOpen.formatSources)(displayedSources.filter(source => !!source.url && tabUrls.has(source.url)), tabUrls));
      } else {
        this.setResults((0, _quickOpen.formatSources)(displayedSources, tabUrls));
      }
    };

    this.updateResults = (0, _lodash.throttle)(query => {
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
    }, updateResultsThrottle);

    this.setModifier = item => {
      if (["@", "#", ":"].includes(item.id)) {
        this.props.setQuickOpenQuery(item.id);
      }
    };

    this.selectResultItem = (e, item) => {
      if (item == null) {
        return;
      }

      if (this.isShortcutQuery()) {
        return this.setModifier(item);
      }

      if (this.isGotoSourceQuery()) {
        const location = (0, _quickOpen.parseLineColumn)(this.props.query);
        return this.gotoLocation({ ...location, sourceId: item.id });
      }

      if (this.isSymbolSearch()) {
        return this.gotoLocation({
          line: item.location && item.location.start ? item.location.start.line : 0
        });
      }

      this.gotoLocation({ sourceId: item.id, line: 0 });
    };

    this.onSelectResultItem = item => {
      const { selectedSource, highlightLineRange } = this.props;
      if (!this.isSymbolSearch() || selectedSource == null) {
        return;
      }

      if (this.isFunctionQuery()) {
        return highlightLineRange({
          ...(item.location != null ? { start: item.location.start.line, end: item.location.end.line } : {}),
          sourceId: selectedSource.id
        });
      }
    };

    this.traverseResults = e => {
      const direction = e.key === "ArrowUp" ? -1 : 1;
      const { selectedIndex, results } = this.state;
      const resultCount = this.getResultCount();
      const index = selectedIndex + direction;
      const nextIndex = (index + resultCount) % resultCount || 0;

      this.setState({ selectedIndex: nextIndex });

      if (results != null) {
        this.onSelectResultItem(results[nextIndex]);
      }
    };

    this.gotoLocation = location => {
      const { cx, selectSpecificLocation, selectedSource } = this.props;
      const selectedSourceId = selectedSource ? selectedSource.id : "";
      if (location != null) {
        const sourceId = location.sourceId ? location.sourceId : selectedSourceId;
        selectSpecificLocation(cx, {
          sourceId,
          line: location.line,
          column: location.column
        });
        this.closeModal();
      }
    };

    this.onChange = e => {
      const {
        selectedSource,
        selectedContentLoaded,
        setQuickOpenQuery
      } = this.props;
      setQuickOpenQuery(e.target.value);
      const noSource = !selectedSource || !selectedContentLoaded;
      if (this.isSymbolSearch() && noSource || this.isGotoQuery()) {
        return;
      }

      this.updateResults(e.target.value);
    };

    this.onKeyDown = e => {
      const { enabled, query } = this.props;
      const { results, selectedIndex } = this.state;

      if (!this.isGotoQuery() && (!enabled || !results)) {
        return;
      }

      if (e.key === "Enter") {
        if (this.isGotoQuery()) {
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
    };

    this.getResultCount = () => {
      const results = this.state.results;
      return results && results.length ? results.length : 0;
    };

    this.isFunctionQuery = () => this.props.searchType === "functions";

    this.isSymbolSearch = () => this.isFunctionQuery();

    this.isGotoQuery = () => this.props.searchType === "goto";

    this.isGotoSourceQuery = () => this.props.searchType === "gotoSource";

    this.isShortcutQuery = () => this.props.searchType === "shortcuts";

    this.isSourcesQuery = () => this.props.searchType === "sources";

    this.isSourceSearch = () => this.isSourcesQuery() || this.isGotoSourceQuery();

    this.highlightMatching = (query, results) => {
      let newQuery = query;
      if (newQuery === "") {
        return results;
      }
      newQuery = query.replace(/[@:#?]/gi, " ");

      return results.map(result => {
        if (typeof result.title == "string") {
          return {
            ...result,
            title: this.renderHighlight(result.title, (0, _path.basename)(newQuery), "title")
          };
        }
        return result;
      });
    };

    this.state = { results: null, selectedIndex: 0 };
  }

  setResults(results) {
    if (results) {
      results = results.slice(0, maxResults);
    }
    this.setState({ results });
  }

  componentDidMount() {
    const { query, shortcutsModalEnabled, toggleShortcutsModal } = this.props;

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

  // Query helpers


  /* eslint-disable react/no-danger */
  renderHighlight(candidateString, query, name) {
    const options = {
      wrap: {
        tagOpen: '<mark class="highlight">',
        tagClose: "</mark>"
      }
    };
    const html = _fuzzaldrinPlus2.default.wrap(candidateString, query, options);
    return _react2.default.createElement("div", { dangerouslySetInnerHTML: { __html: html } });
  }

  shouldShowErrorEmoji() {
    const { query } = this.props;
    if (this.isGotoQuery()) {
      return !/^:\d*$/.test(query);
    }
    return !this.getResultCount() && !!query;
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
    const { enabled, query } = this.props;
    const { selectedIndex, results } = this.state;

    if (!enabled) {
      return null;
    }
    const items = this.highlightMatching(query, results || []);
    const expanded = !!items && items.length > 0;

    return _react2.default.createElement(
      _Modal2.default,
      { "in": enabled, handleClose: this.closeModal },
      _react2.default.createElement(_SearchInput2.default, _extends({
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
      }, this.isSourceSearch() ? { size: "big" } : {})),
      results && _react2.default.createElement(_ResultList2.default, _extends({
        key: "results",
        items: items,
        selected: selectedIndex,
        selectItem: this.selectResultItem,
        ref: "resultList",
        expanded: expanded
      }, this.isSourceSearch() ? { size: "big" } : {}))
    );
  }
}

exports.QuickOpenModal = QuickOpenModal; /* istanbul ignore next: ignoring testing of redux connection stuff */

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
exports.default = (0, _connect.connect)(mapStateToProps, {
  selectSpecificLocation: _actions2.default.selectSpecificLocation,
  setQuickOpenQuery: _actions2.default.setQuickOpenQuery,
  highlightLineRange: _actions2.default.highlightLineRange,
  closeQuickOpen: _actions2.default.closeQuickOpen
})(QuickOpenModal);