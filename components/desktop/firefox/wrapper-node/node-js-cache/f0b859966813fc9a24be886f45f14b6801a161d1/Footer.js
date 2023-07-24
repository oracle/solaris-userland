"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _propTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

loader.lazyRequireGetter(this, "_connect", "devtools/client/debugger/src/utils/connect");
loader.lazyRequireGetter(this, "_location", "devtools/client/debugger/src/utils/location");

var _actions = _interopRequireDefault(require("../../actions/index"));

loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_source", "devtools/client/debugger/src/utils/source");
loader.lazyRequireGetter(this, "_Button", "devtools/client/debugger/src/components/shared/Button/index");

var _AccessibleImage = _interopRequireDefault(require("../shared/AccessibleImage"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const classnames = require("devtools/client/shared/classnames.js");

class SourceFooter extends _react.PureComponent {
  constructor() {
    super();

    _defineProperty(this, "onCursorChange", event => {
      const {
        line,
        ch
      } = event.doc.getCursor();
      this.setState({
        cursorPosition: {
          line,
          column: ch
        }
      });
    });

    this.state = {
      cursorPosition: {
        line: 0,
        column: 0
      }
    };
  }

  static get propTypes() {
    return {
      canPrettyPrint: _propTypes.default.bool.isRequired,
      prettyPrintMessage: _propTypes.default.string.isRequired,
      cx: _propTypes.default.object.isRequired,
      endPanelCollapsed: _propTypes.default.bool.isRequired,
      horizontal: _propTypes.default.bool.isRequired,
      jumpToMappedLocation: _propTypes.default.func.isRequired,
      mappedSource: _propTypes.default.object,
      selectedSource: _propTypes.default.object,
      isSelectedSourceBlackBoxed: _propTypes.default.bool.isRequired,
      sourceLoaded: _propTypes.default.bool.isRequired,
      toggleBlackBox: _propTypes.default.func.isRequired,
      togglePaneCollapse: _propTypes.default.func.isRequired,
      togglePrettyPrint: _propTypes.default.func.isRequired,
      isSourceOnIgnoreList: _propTypes.default.bool.isRequired
    };
  }

  componentDidUpdate() {
    const eventDoc = document.querySelector(".editor-mount .CodeMirror"); // querySelector can return null

    if (eventDoc) {
      this.toggleCodeMirror(eventDoc, true);
    }
  }

  componentWillUnmount() {
    const eventDoc = document.querySelector(".editor-mount .CodeMirror");

    if (eventDoc) {
      this.toggleCodeMirror(eventDoc, false);
    }
  }

  toggleCodeMirror(eventDoc, toggle) {
    if (toggle === true) {
      eventDoc.CodeMirror.on("cursorActivity", this.onCursorChange);
    } else {
      eventDoc.CodeMirror.off("cursorActivity", this.onCursorChange);
    }
  }

  prettyPrintButton() {
    const {
      cx,
      selectedSource,
      canPrettyPrint,
      prettyPrintMessage,
      togglePrettyPrint,
      sourceLoaded
    } = this.props;

    if (!selectedSource) {
      return null;
    }

    if (!sourceLoaded && selectedSource.isPrettyPrinted) {
      return _react.default.createElement("div", {
        className: "action",
        key: "pretty-loader"
      }, _react.default.createElement(_AccessibleImage.default, {
        className: "loader spin"
      }));
    }

    const type = "prettyPrint";
    return _react.default.createElement("button", {
      onClick: () => {
        if (!canPrettyPrint) {
          return;
        }

        togglePrettyPrint(cx, selectedSource.id);
      },
      className: classnames("action", type, {
        active: sourceLoaded && canPrettyPrint,
        pretty: (0, _source.isPretty)(selectedSource)
      }),
      key: type,
      title: prettyPrintMessage,
      "aria-label": prettyPrintMessage,
      disabled: !canPrettyPrint
    }, _react.default.createElement(_AccessibleImage.default, {
      className: type
    }));
  }

  blackBoxButton() {
    const {
      cx,
      selectedSource,
      isSelectedSourceBlackBoxed,
      toggleBlackBox,
      sourceLoaded,
      isSourceOnIgnoreList
    } = this.props;

    if (!selectedSource || !(0, _source.shouldBlackbox)(selectedSource)) {
      return null;
    }

    let tooltip = isSelectedSourceBlackBoxed ? L10N.getStr("sourceFooter.unignore") : L10N.getStr("sourceFooter.ignore");

    if (isSourceOnIgnoreList) {
      tooltip = L10N.getStr("sourceFooter.ignoreList");
    }

    const type = "black-box";
    return _react.default.createElement("button", {
      onClick: () => toggleBlackBox(cx, selectedSource),
      className: classnames("action", type, {
        active: sourceLoaded,
        blackboxed: isSelectedSourceBlackBoxed || isSourceOnIgnoreList
      }),
      key: type,
      title: tooltip,
      "aria-label": tooltip,
      disabled: isSourceOnIgnoreList
    }, _react.default.createElement(_AccessibleImage.default, {
      className: "blackBox"
    }));
  }

  renderToggleButton() {
    if (this.props.horizontal) {
      return null;
    }

    return _react.default.createElement(_Button.PaneToggleButton, {
      key: "toggle",
      collapsed: this.props.endPanelCollapsed,
      horizontal: this.props.horizontal,
      handleClick: this.props.togglePaneCollapse,
      position: "end"
    });
  }

  renderCommands() {
    const commands = [this.blackBoxButton(), this.prettyPrintButton()].filter(Boolean);
    return commands.length ? _react.default.createElement("div", {
      className: "commands"
    }, commands) : null;
  }

  renderSourceSummary() {
    const {
      cx,
      mappedSource,
      jumpToMappedLocation,
      selectedSource
    } = this.props;

    if (!mappedSource || !selectedSource || !selectedSource.isOriginal) {
      return null;
    }

    const filename = (0, _source.getFilename)(mappedSource);
    const tooltip = L10N.getFormatStr("sourceFooter.mappedSourceTooltip", filename);
    const title = L10N.getFormatStr("sourceFooter.mappedSource", filename);
    const mappedSourceLocation = (0, _location.createLocation)({
      source: selectedSource,
      line: 1,
      column: 1
    });
    return _react.default.createElement("button", {
      className: "mapped-source",
      onClick: () => jumpToMappedLocation(cx, mappedSourceLocation),
      title: tooltip
    }, _react.default.createElement("span", null, title));
  }

  renderCursorPosition() {
    if (!this.props.selectedSource) {
      return null;
    }

    const {
      line,
      column
    } = this.state.cursorPosition;
    const text = L10N.getFormatStr("sourceFooter.currentCursorPosition", line + 1, column + 1);
    const title = L10N.getFormatStr("sourceFooter.currentCursorPosition.tooltip", line + 1, column + 1);
    return _react.default.createElement("div", {
      className: "cursor-position",
      title: title
    }, text);
  }

  render() {
    return _react.default.createElement("div", {
      className: "source-footer"
    }, _react.default.createElement("div", {
      className: "source-footer-start"
    }, this.renderCommands()), _react.default.createElement("div", {
      className: "source-footer-end"
    }, this.renderSourceSummary(), this.renderCursorPosition(), this.renderToggleButton()));
  }

}

const mapStateToProps = state => {
  const selectedSource = (0, _selectors.getSelectedSource)(state);
  const selectedLocation = (0, _selectors.getSelectedLocation)(state);
  const sourceTextContent = (0, _selectors.getSelectedSourceTextContent)(state);
  return {
    cx: (0, _selectors.getContext)(state),
    selectedSource,
    isSelectedSourceBlackBoxed: selectedSource ? (0, _selectors.isSourceBlackBoxed)(state, selectedSource) : null,
    isSourceOnIgnoreList: (0, _selectors.isSourceMapIgnoreListEnabled)(state) && (0, _selectors.isSourceOnSourceMapIgnoreList)(state, selectedSource),
    sourceLoaded: !!sourceTextContent,
    mappedSource: (0, _selectors.getGeneratedSource)(state, selectedSource),
    prettySource: (0, _selectors.getPrettySource)(state, selectedSource ? selectedSource.id : null),
    endPanelCollapsed: (0, _selectors.getPaneCollapse)(state, "end"),
    canPrettyPrint: selectedLocation ? (0, _selectors.canPrettyPrintSource)(state, selectedLocation) : false,
    prettyPrintMessage: selectedLocation ? (0, _selectors.getPrettyPrintMessage)(state, selectedLocation) : null
  };
};

var _default = (0, _connect.connect)(mapStateToProps, {
  togglePrettyPrint: _actions.default.togglePrettyPrint,
  toggleBlackBox: _actions.default.toggleBlackBox,
  jumpToMappedLocation: _actions.default.jumpToMappedLocation,
  togglePaneCollapse: _actions.default.togglePaneCollapse
})(SourceFooter);

exports.default = _default;