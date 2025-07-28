"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Outline = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _reactDomFactories = require("devtools/client/shared/vendor/react-dom-factories");

var _reactPropTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

var _reactRedux = require("devtools/client/shared/vendor/react-redux");

loader.lazyRequireGetter(this, "_ast", "devtools/client/debugger/src/utils/ast");
loader.lazyRequireGetter(this, "_location", "devtools/client/debugger/src/utils/location");

var _index = _interopRequireDefault(require("../../actions/index"));

loader.lazyRequireGetter(this, "_index2", "devtools/client/debugger/src/selectors/index");

var _OutlineFilter = _interopRequireDefault(require("./OutlineFilter"));

var _PreviewFunction = _interopRequireDefault(require("../shared/PreviewFunction"));

loader.lazyRequireGetter(this, "_asyncValue", "devtools/client/debugger/src/utils/async-value");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const classnames = require("resource://devtools/client/shared/classnames.js");

const {
  score: fuzzaldrinScore
} = require("resource://devtools/client/shared/vendor/fuzzaldrin-plus.js"); // Set higher to make the fuzzaldrin filter more specific


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

  return fuzzaldrinScore(name, filter) > FUZZALDRIN_FILTER_THRESHOLD;
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
      focusedItem: null,
      symbols: null
    };
  }

  static get propTypes() {
    return {
      alphabetizeOutline: _reactPropTypes.default.bool.isRequired,
      cursorPosition: _reactPropTypes.default.object,
      onAlphabetizeClick: _reactPropTypes.default.func.isRequired,
      selectLocation: _reactPropTypes.default.func.isRequired,
      selectedLocation: _reactPropTypes.default.object,
      getFunctionSymbols: _reactPropTypes.default.func.isRequired,
      getClassSymbols: _reactPropTypes.default.func.isRequired,
      selectedSourceTextContent: _reactPropTypes.default.object,
      canFetchSymbols: _reactPropTypes.default.bool
    };
  }

  componentDidMount() {
    if (!this.props.canFetchSymbols) {
      return;
    }

    this.getClassAndFunctionSymbols();
  }

  componentDidUpdate(prevProps) {
    const {
      cursorPosition,
      selectedSourceTextContent,
      canFetchSymbols
    } = this.props;

    if (cursorPosition && cursorPosition !== prevProps.cursorPosition) {
      this.setFocus(cursorPosition);
    }

    if (this.focusedElRef && !isVisible(this.focusedElRef, this.refs.outlineList)) {
      this.focusedElRef.scrollIntoView({
        block: "center"
      });
    } // Lets make sure the source text has been loaded and it is different


    if (canFetchSymbols && prevProps.selectedSourceTextContent !== selectedSourceTextContent) {
      this.getClassAndFunctionSymbols();
    }
  }

  async getClassAndFunctionSymbols() {
    const {
      selectedLocation,
      getFunctionSymbols,
      getClassSymbols
    } = this.props;
    const functions = await getFunctionSymbols(selectedLocation);
    const classes = await getClassSymbols(selectedLocation);
    this.setState({
      symbols: {
        functions,
        classes
      }
    });
  }

  async setFocus(cursorPosition) {
    const {
      symbols
    } = this.state;
    let classes = [];
    let functions = [];

    if (symbols) {
      ({
        classes,
        functions
      } = symbols);
    } // Find items that enclose the selected location


    const enclosedItems = [...classes, ...functions].filter(({
      location
    }) => (0, _ast.containsPosition)(location, cursorPosition));

    if (!enclosedItems.length) {
      this.setState({
        focusedItem: null
      });
      return;
    } // Find the closest item to the selected location to focus


    const closestItem = enclosedItems.reduce((item, closest) => (0, _ast.positionAfter)(item.location, closest.location) ? item : closest);
    this.setState({
      focusedItem: closestItem
    });
  }

  selectItem(selectedItem) {
    const {
      selectedLocation,
      selectLocation
    } = this.props;

    if (!selectedLocation || !selectedItem) {
      return;
    }

    selectLocation((0, _location.createLocation)({
      source: selectedLocation.source,
      line: selectedItem.location.start.line,
      column: selectedItem.location.start.column
    }));
    this.setState({
      focusedItem: selectedItem
    });
  }

  onContextMenu(event, func) {
    event.stopPropagation();
    event.preventDefault();
    const {
      symbols
    } = this.state;
    this.props.showOutlineContextMenu(event, func, symbols);
  }

  renderPlaceholder() {
    const placeholderMessage = this.props.selectedLocation ? L10N.getStr("outline.noFunctions") : L10N.getStr("outline.noFileSelected");
    return (0, _reactDomFactories.div)({
      className: "outline-pane-info"
    }, placeholderMessage);
  }

  renderLoading() {
    return (0, _reactDomFactories.div)({
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
    return (0, _reactDomFactories.li)({
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
    }, (0, _reactDomFactories.span)({
      className: "outline-list__element-icon"
    }, "λ"), _react.default.createElement(_PreviewFunction.default, {
      func: {
        name,
        parameterNames
      }
    }));
  }

  renderClassHeader(klass) {
    return (0, _reactDomFactories.div)(null, (0, _reactDomFactories.span)({
      className: "keyword"
    }, "class"), " ", klass);
  }

  renderClassFunctions(klass, functions) {
    const {
      symbols
    } = this.state;

    if (!symbols || klass == null || !functions.length) {
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
    return (0, _reactDomFactories.li)({
      className: "outline-list__class",
      ref: el => {
        if (isFocused) {
          this.focusedElRef = el;
        }
      },
      key: klass
    }, (0, _reactDomFactories.h2)({
      className: classnames({
        focused: isFocused
      }),
      onClick: () => this.selectItem(item)
    }, classFunc ? this.renderFunction(classFunc) : this.renderClassHeader(klass)), (0, _reactDomFactories.ul)({
      className: "outline-list__class-list"
    }, classFunctions.map(func => this.renderFunction(func))));
  }

  renderFunctions(functions) {
    const {
      filter
    } = this.state;
    let classes = [...new Set(functions.map(({
      klass
    }) => klass))];
    const namedFunctions = functions.filter(({
      name,
      klass
    }) => filterOutlineItem(name, filter) && !klass && !classes.includes(name));
    const classFunctions = functions.filter(({
      name,
      klass
    }) => filterOutlineItem(name, filter) && !!klass);

    if (this.props.alphabetizeOutline) {
      const sortByName = (a, b) => a.name < b.name ? -1 : 1;

      namedFunctions.sort(sortByName);
      classes = classes.sort();
      classFunctions.sort(sortByName);
    }

    return (0, _reactDomFactories.ul)({
      ref: "outlineList",
      className: "outline-list devtools-monospace",
      dir: "ltr"
    }, namedFunctions.map(func => this.renderFunction(func)), classes.map(klass => this.renderClassFunctions(klass, classFunctions)));
  }

  renderFooter() {
    return (0, _reactDomFactories.div)({
      className: "outline-footer"
    }, (0, _reactDomFactories.button)({
      onClick: this.props.onAlphabetizeClick,
      className: this.props.alphabetizeOutline ? "active" : ""
    }, L10N.getStr("outline.sortLabel")));
  }

  render() {
    const {
      selectedLocation
    } = this.props;
    const {
      filter,
      symbols
    } = this.state;

    if (!selectedLocation) {
      return this.renderPlaceholder();
    }

    if (!symbols) {
      return this.renderLoading();
    }

    const {
      functions
    } = symbols;

    if (functions.length === 0) {
      return this.renderPlaceholder();
    }

    return (0, _reactDomFactories.div)({
      className: "outline"
    }, (0, _reactDomFactories.div)(null, _react.default.createElement(_OutlineFilter.default, {
      filter,
      updateFilter: this.updateFilter
    }), this.renderFunctions(functions), this.renderFooter()));
  }

}

exports.Outline = Outline;

const mapStateToProps = state => {
  const selectedSourceTextContent = (0, _index2.getSelectedSourceTextContent)(state);
  return {
    selectedSourceTextContent,
    selectedLocation: (0, _index2.getSelectedLocation)(state),
    canFetchSymbols: selectedSourceTextContent && (0, _asyncValue.isFulfilled)(selectedSourceTextContent),
    cursorPosition: (0, _index2.getCursorPosition)(state)
  };
};

var _default = (0, _reactRedux.connect)(mapStateToProps, {
  selectLocation: _index.default.selectLocation,
  showOutlineContextMenu: _index.default.showOutlineContextMenu,
  getFunctionSymbols: _index.default.getFunctionSymbols,
  getClassSymbols: _index.default.getClassSymbols
})(Outline);

exports.default = _default;