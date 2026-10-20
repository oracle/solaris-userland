"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactPropTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _FileSearchBar = _interopRequireDefault(require("devtools/client/shared/components/FileSearchBar"));

var _CloseButton = _interopRequireDefault(require("devtools/client/shared/components/CloseButton"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class FileSearch extends _react.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "setCursorLocation", (line, ch, matchContent) => {
      this.props.selectLocation(this.props.createLocation({
        source: this.props.selectedSource,
        line: line + 1,
        column: ch + matchContent.length
      }), {
        // Reset the context, so that we don't switch to original
        // while moving the cursor within a bundle
        keepContext: false,
        // Avoid highlighting the selected line
        highlight: false,
        // We should ensure showing the search result by scrolling it
        // into the viewport.
        // We won't be scrolling when receiving redux updates and we are paused.
        scroll: true
      });
    });
  }

  static get propTypes() {
    return {
      editor: _reactPropTypes.default.object.isRequired,
      selectedSource: _reactPropTypes.default.object.isRequired,
      modifiers: _reactPropTypes.default.object.isRequired,
      textContent: _reactPropTypes.default.object,
      searchInFileEnabled: _reactPropTypes.default.bool.isRequired,
      shouldScroll: _reactPropTypes.default.bool.isRequired,
      setActiveSearch: _reactPropTypes.default.func.isRequired,
      closeFileSearch: _reactPropTypes.default.func.isRequired,
      querySearchWorker: _reactPropTypes.default.func.isRequired,
      selectLocation: _reactPropTypes.default.func.isRequired,
      createLocation: _reactPropTypes.default.func.isRequired,
      clearSearchEditor: _reactPropTypes.default.func.isRequired,
      find: _reactPropTypes.default.func.isRequired,
      findNext: _reactPropTypes.default.func.isRequired,
      findPrev: _reactPropTypes.default.func.isRequired,
      searchKey: _reactPropTypes.default.string.isRequired,
      scrollList: _reactPropTypes.default.func.isRequired
    };
  }

  shouldComponentUpdate(nextProps) {
    return this.props.selectedSource?.id !== nextProps.selectedSource?.id || this.props.textContent !== nextProps.textContent || this.props.searchInFileEnabled !== nextProps.searchInFileEnabled || this.props.shouldScroll !== nextProps.shouldScroll || this.props.editor !== nextProps.editor;
  }
  /**
   * Ensure showing the search result in CodeMirror editor,
   * and setting the cursor at the end of the matched string.
   *
   * @param {number} line
   * @param {number} ch
   * @param {string} matchContent
   */


  render() {
    return _react.default.createElement(_FileSearchBar.default, {
      setCursorLocation: this.setCursorLocation,
      ...this.props,
      shortcuts: this.context.shortcuts,
      CloseButton: _CloseButton.default
    });
  }

}

_defineProperty(FileSearch, "contextTypes", {
  shortcuts: _reactPropTypes.default.object
});

var _default = FileSearch;
exports.default = _default;