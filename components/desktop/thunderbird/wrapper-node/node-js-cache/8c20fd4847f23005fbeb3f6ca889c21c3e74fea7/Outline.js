"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Outline = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _devtoolsContextmenu = require("devtools/client/debugger/dist/vendors").vendored["devtools-contextmenu"];

loader.lazyRequireGetter(this, "_connect", "devtools/client/debugger/src/utils/connect");

var _fuzzaldrinPlus = require("devtools/client/debugger/dist/vendors").vendored["fuzzaldrin-plus"];

loader.lazyRequireGetter(this, "_ast", "devtools/client/debugger/src/utils/ast");
loader.lazyRequireGetter(this, "_clipboard", "devtools/client/debugger/src/utils/clipboard");
loader.lazyRequireGetter(this, "_function", "devtools/client/debugger/src/utils/function");

var _actions = _interopRequireDefault(require("../../actions/index"));

loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");

var _OutlineFilter = _interopRequireDefault(require("./OutlineFilter"));

var _PreviewFunction = _interopRequireDefault(require("../shared/PreviewFunction"));

var _lodash = require("devtools/client/shared/vendor/lodash");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const classnames = require("devtools/client/debugger/dist/vendors").vendored["classnames"];

// Set higher to make the fuzzaldrin filter more specific
const FUZZALDRIN_FILTER_THRESHOLD = 15000;
/**
 * Check whether the name argument matches the fuzzy filter argument
 */

const filterOutlineItem = (name, filter) => {
  if (!filter) {
    return true;
  }

  if (filter.length === 1) {
    // when filter is a single char just check if it starts with the char
    return filter.toLowerCase() === name.toLowerCase()[0];
  }

  return (0, _fuzzaldrinPlus.score)(name, filter) > FUZZALDRIN_FILTER_THRESHOLD;
}; // Checks if an element is visible inside its parent element


function isVisible(element, parent) {
  const parentRect = parent.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();
  const parentTop = parentRect.top;
  const parentBottom = parentRect.bottom;
  const elTop = elementRect.top;
  const elBottom = elementRect.bottom;
  return parentTop < elTop && parentBottom > elBottom;
}

class Outline extends _react.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "updateFilter", filter => {
      this.setState({
        filter: filter.trim()
      });
    });

    this.focusedElRef = null;
    this.state = {
      filter: "",
      focusedItem: null
    };
  }

  componentDidUpdate(prevProps) {
    const {
      cursorPosition,
      symbols
    } = this.props;

    if (cursorPosition && symbols && cursorPosition !== prevProps.cursorPosition) {
      this.setFocus(cursorPosition);
    }

    if (this.focusedElRef && !isVisible(this.focusedElRef, this.refs.outlineList)) {
      this.focusedElRef.scrollIntoView({
        block: "center"
      });
    }
  }

  setFocus(cursorPosition) {
    const {
      symbols
    } = this.props;
    let classes = [];
    let functions = [];

    if (symbols && !symbols.loading) {
      ({
        classes,
        functions
      } = symbols);
    } // Find items that enclose the selected location


    const enclosedItems = [...classes, ...functions].filter(({
      name,
      location
    }) => name != "anonymous" && (0, _ast.containsPosition)(location, cursorPosition));

    if (enclosedItems.length == 0) {
      return this.setState({
        focusedItem: null
      });
    } // Find the closest item to the selected location to focus


    const closestItem = enclosedItems.reduce((item, closest) => (0, _ast.positionAfter)(item.location, closest.location) ? item : closest);
    this.setState({
      focusedItem: closestItem
    });
  }

  selectItem(selectedItem) {
    const {
      cx,
      selectedSource,
      selectLocation
    } = this.props;

    if (!selectedSource || !selectedItem) {
      return;
    }

    selectLocation(cx, {
      sourceId: selectedSource.id,
      line: selectedItem.location.start.line,
      column: selectedItem.location.start.column
    });
    this.setState({
      focusedItem: selectedItem
    });
  }

  onContextMenu(event, func) {
    event.stopPropagation();
    event.preventDefault();
    const {
      selectedSource,
      flashLineRange,
      getFunctionText
    } = this.props;

    if (!selectedSource) {
      return;
    }

    const sourceLine = func.location.start.line;
    const functionText = getFunctionText(sourceLine);
    const copyFunctionItem = {
      id: "node-menu-copy-function",
      label: L10N.getStr("copyFunction.label"),
      accesskey: L10N.getStr("copyFunction.accesskey"),
      disabled: !functionText,
      click: () => {
        flashLineRange({
          start: sourceLine,
          end: func.location.end.line,
          sourceId: selectedSource.id
        });
        return (0, _clipboard.copyToTheClipboard)(functionText);
      }
    };
    const menuOptions = [copyFunctionItem];
    (0, _devtoolsContextmenu.showMenu)(event, menuOptions);
  }

  renderPlaceholder() {
    const placeholderMessage = this.props.selectedSource ? L10N.getStr("outline.noFunctions") : L10N.getStr("outline.noFileSelected");
    return _react.default.createElement("div", {
      className: "outline-pane-info"
    }, placeholderMessage);
  }

  renderLoading() {
    return _react.default.createElement("div", {
      className: "outline-pane-info"
    }, L10N.getStr("loadingText"));
  }

  renderFunction(func) {
    const {
      focusedItem
    } = this.state;
    const {
      name,
      location,
      parameterNames
    } = func;
    const isFocused = focusedItem === func;
    return _react.default.createElement("li", {
      key: `${name}:${location.start.line}:${location.start.column}`,
      className: classnames("outline-list__element", {
        focused: isFocused
      }),
      ref: el => {
        if (isFocused) {
          this.focusedElRef = el;
        }
      },
      onClick: () => this.selectItem(func),
      onContextMenu: e => this.onContextMenu(e, func)
    }, _react.default.createElement("span", {
      className: "outline-list__element-icon"
    }, "\u03BB"), _react.default.createElement(_PreviewFunction.default, {
      func: {
        name,
        parameterNames
      }
    }));
  }

  renderClassHeader(klass) {
    return _react.default.createElement("div", null, _react.default.createElement("span", {
      className: "keyword"
    }, "class"), " ", klass);
  }

  renderClassFunctions(klass, functions) {
    const {
      symbols
    } = this.props;

    if (!symbols || symbols.loading || klass == null || functions.length == 0) {
      return null;
    }

    const {
      focusedItem
    } = this.state;
    const classFunc = functions.find(func => func.name === klass);
    const classFunctions = functions.filter(func => func.klass === klass);
    const classInfo = symbols.classes.find(c => c.name === klass);
    const item = classFunc || classInfo;
    const isFocused = focusedItem === item;
    return _react.default.createElement("li", {
      className: "outline-list__class",
      ref: el => {
        if (isFocused) {
          this.focusedElRef = el;
        }
      },
      key: klass
    }, _react.default.createElement("h2", {
      className: classnames("", {
        focused: isFocused
      }),
      onClick: () => this.selectItem(item)
    }, classFunc ? this.renderFunction(classFunc) : this.renderClassHeader(klass)), _react.default.createElement("ul", {
      className: "outline-list__class-list"
    }, classFunctions.map(func => this.renderFunction(func))));
  }

  renderFunctions(functions) {
    const {
      filter
    } = this.state;
    let classes = (0, _lodash.uniq)(functions.map(({
      klass
    }) => klass));
    let namedFunctions = functions.filter(({
      name,
      klass
    }) => filterOutlineItem(name, filter) && !klass && !classes.includes(name));
    let classFunctions = functions.filter(({
      name,
      klass
    }) => filterOutlineItem(name, filter) && !!klass);

    if (this.props.alphabetizeOutline) {
      namedFunctions = (0, _lodash.sortBy)(namedFunctions, "name");
      classes = classes.sort();
      classFunctions = (0, _lodash.sortBy)(classFunctions, "name");
    }

    return _react.default.createElement("ul", {
      ref: "outlineList",
      className: "outline-list devtools-monospace",
      dir: "ltr"
    }, namedFunctions.map(func => this.renderFunction(func)), classes.map(klass => this.renderClassFunctions(klass, classFunctions)));
  }

  renderFooter() {
    return _react.default.createElement("div", {
      className: "outline-footer"
    }, _react.default.createElement("button", {
      onClick: this.props.onAlphabetizeClick,
      className: this.props.alphabetizeOutline ? "active" : ""
    }, L10N.getStr("outline.sortLabel")));
  }

  render() {
    const {
      symbols,
      selectedSource
    } = this.props;
    const {
      filter
    } = this.state;

    if (!selectedSource) {
      return this.renderPlaceholder();
    }

    if (!symbols || symbols.loading) {
      return this.renderLoading();
    }

    const symbolsToDisplay = symbols.functions.filter(({
      name
    }) => name != "anonymous");

    if (symbolsToDisplay.length === 0) {
      return this.renderPlaceholder();
    }

    return _react.default.createElement("div", {
      className: "outline"
    }, _react.default.createElement("div", null, _react.default.createElement(_OutlineFilter.default, {
      filter: filter,
      updateFilter: this.updateFilter
    }), this.renderFunctions(symbolsToDisplay), this.renderFooter()));
  }

}

exports.Outline = Outline;

const mapStateToProps = state => {
  const selectedSource = (0, _selectors.getSelectedSourceWithContent)(state);
  const symbols = selectedSource ? (0, _selectors.getSymbols)(state, selectedSource) : null;
  return {
    cx: (0, _selectors.getContext)(state),
    symbols,
    selectedSource: selectedSource,
    cursorPosition: (0, _selectors.getCursorPosition)(state),
    getFunctionText: line => {
      if (selectedSource) {
        return (0, _function.findFunctionText)(line, selectedSource, symbols);
      }

      return null;
    }
  };
};

var _default = (0, _connect.connect)(mapStateToProps, {
  selectLocation: _actions.default.selectLocation,
  flashLineRange: _actions.default.flashLineRange
})(Outline);

exports.default = _default;