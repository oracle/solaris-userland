"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("devtools/client/shared/vendor/react");

var _react2 = _interopRequireDefault(_react);

var _connect = require("../../utils/connect");

var _classnames = require("devtools/client/debugger/dist/vendors").vendored["classnames"];

var _classnames2 = _interopRequireDefault(_classnames);

var _actions = require("../../actions/index");

var _actions2 = _interopRequireDefault(_actions);

var _selectors = require("../../selectors/index");

var _asyncValue = require("../../utils/async-value");

var _source = require("../../utils/source");

var _sources = require("../../reducers/sources");

var _editor = require("../../utils/editor/index");

var _Button = require("../shared/Button/index");

var _AccessibleImage = require("../shared/AccessibleImage");

var _AccessibleImage2 = _interopRequireDefault(_AccessibleImage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class SourceFooter extends _react.PureComponent {
  constructor() {
    super();

    this.onCursorChange = event => {
      const { line, ch } = event.doc.getCursor();
      this.setState({ cursorPosition: { line, column: ch } });
    };

    this.state = { cursorPosition: { line: 0, column: 0 } };
  }

  componentDidUpdate() {
    const eventDoc = document.querySelector(".editor-mount .CodeMirror");
    // querySelector can return null
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
    const { cx, selectedSourceWithContent, togglePrettyPrint } = this.props;

    if (!selectedSourceWithContent) {
      return;
    }

    if (!selectedSourceWithContent.content && selectedSourceWithContent.source.isPrettyPrinted) {
      return _react2.default.createElement(
        "div",
        { className: "loader", key: "pretty-loader" },
        _react2.default.createElement(_AccessibleImage2.default, { className: "loader" })
      );
    }

    const sourceContent = selectedSourceWithContent.content && (0, _asyncValue.isFulfilled)(selectedSourceWithContent.content) ? selectedSourceWithContent.content.value : null;
    if (!(0, _editor.shouldShowPrettyPrint)(selectedSourceWithContent.source, sourceContent || { type: "text", value: "", contentType: undefined })) {
      return;
    }

    const tooltip = L10N.getStr("sourceTabs.prettyPrint");
    const sourceLoaded = !!selectedSourceWithContent.content;

    const type = "prettyPrint";
    return _react2.default.createElement(
      "button",
      {
        onClick: () => togglePrettyPrint(cx, selectedSourceWithContent.source.id),
        className: (0, _classnames2.default)("action", type, {
          active: sourceLoaded,
          pretty: (0, _source.isPretty)(selectedSourceWithContent.source)
        }),
        key: type,
        title: tooltip,
        "aria-label": tooltip
      },
      _react2.default.createElement(_AccessibleImage2.default, { className: type })
    );
  }

  blackBoxButton() {
    const { cx, selectedSourceWithContent, toggleBlackBox } = this.props;
    const sourceLoaded = selectedSourceWithContent && selectedSourceWithContent.content;

    if (!selectedSourceWithContent) {
      return;
    }

    if (!(0, _source.shouldBlackbox)(selectedSourceWithContent.source)) {
      return;
    }

    const blackboxed = selectedSourceWithContent.source.isBlackBoxed;

    const tooltip = blackboxed ? L10N.getStr("sourceFooter.unblackbox") : L10N.getStr("sourceFooter.blackbox");

    const type = "black-box";

    return _react2.default.createElement(
      "button",
      {
        onClick: () => toggleBlackBox(cx, selectedSourceWithContent.source),
        className: (0, _classnames2.default)("action", type, {
          active: sourceLoaded,
          blackboxed: blackboxed
        }),
        key: type,
        title: tooltip,
        "aria-label": tooltip
      },
      _react2.default.createElement(_AccessibleImage2.default, { className: "blackBox" })
    );
  }

  renderToggleButton() {
    if (this.props.horizontal) {
      return;
    }

    return _react2.default.createElement(_Button.PaneToggleButton, {
      key: "toggle",
      collapsed: this.props.endPanelCollapsed,
      horizontal: this.props.horizontal,
      handleClick: this.props.togglePaneCollapse,
      position: "end"
    });
  }

  renderCommands() {
    const commands = [this.blackBoxButton(), this.prettyPrintButton()].filter(Boolean);

    return commands.length ? _react2.default.createElement(
      "div",
      { className: "commands" },
      commands
    ) : null;
  }

  renderSourceSummary() {
    const {
      cx,
      mappedSource,
      jumpToMappedLocation,
      selectedSourceWithContent
    } = this.props;

    if (!mappedSource || !selectedSourceWithContent || !(0, _source.isOriginal)(selectedSourceWithContent.source)) {
      return null;
    }

    const filename = (0, _source.getFilename)(mappedSource);
    const tooltip = L10N.getFormatStr("sourceFooter.mappedSourceTooltip", filename);
    const title = L10N.getFormatStr("sourceFooter.mappedSource", filename);
    const mappedSourceLocation = {
      sourceId: selectedSourceWithContent.source.id,
      line: 1,
      column: 1
    };
    return _react2.default.createElement(
      "button",
      {
        className: "mapped-source",
        onClick: () => jumpToMappedLocation(cx, mappedSourceLocation),
        title: tooltip
      },
      _react2.default.createElement(
        "span",
        null,
        title
      )
    );
  }

  renderCursorPosition() {
    if (!this.props.selectedSourceWithContent) {
      return null;
    }

    const { line, column } = this.state.cursorPosition;

    const text = L10N.getFormatStr("sourceFooter.currentCursorPosition", line + 1, column + 1);
    const title = L10N.getFormatStr("sourceFooter.currentCursorPosition.tooltip", line + 1, column + 1);
    return _react2.default.createElement(
      "div",
      { className: "cursor-position", title: title },
      text
    );
  }

  render() {
    return _react2.default.createElement(
      "div",
      { className: "source-footer" },
      _react2.default.createElement(
        "div",
        { className: "source-footer-start" },
        this.renderCommands()
      ),
      _react2.default.createElement(
        "div",
        { className: "source-footer-end" },
        this.renderSourceSummary(),
        this.renderCursorPosition(),
        this.renderToggleButton()
      )
    );
  }
} /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

const mapStateToProps = state => {
  const selectedSourceWithContent = (0, _selectors.getSelectedSourceWithContent)(state);

  return {
    cx: (0, _selectors.getContext)(state),
    selectedSourceWithContent,
    mappedSource: (0, _sources.getGeneratedSource)(state, selectedSourceWithContent && selectedSourceWithContent.source),
    prettySource: (0, _selectors.getPrettySource)(state, selectedSourceWithContent ? selectedSourceWithContent.source.id : null),
    endPanelCollapsed: (0, _selectors.getPaneCollapse)(state, "end")
  };
};

exports.default = (0, _connect.connect)(mapStateToProps, {
  togglePrettyPrint: _actions2.default.togglePrettyPrint,
  toggleBlackBox: _actions2.default.toggleBlackBox,
  jumpToMappedLocation: _actions2.default.jumpToMappedLocation,
  togglePaneCollapse: _actions2.default.togglePaneCollapse
})(SourceFooter);