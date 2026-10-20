"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.TracePanel = void 0;

var _react = require("devtools/client/shared/vendor/react");

var _reactDomFactories = require("devtools/client/shared/vendor/react-dom-factories");

var _reactDom = _interopRequireDefault(require("devtools/client/shared/vendor/react-dom"));

var _reactPropTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

var _reactRedux = require("devtools/client/shared/vendor/react-redux");

loader.lazyRequireGetter(this, "_index", "devtools/client/debugger/src/utils/editor/index");

var _index2 = _interopRequireDefault(require("../../actions/index"));

loader.lazyRequireGetter(this, "_index3", "devtools/client/debugger/src/selectors/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
class TracePanel extends _react.Component {
  constructor() {
    super();
  }

  static get propTypes() {
    return {
      editor: _reactPropTypes.default.object.isRequired,
      selectedTraceLocation: _reactPropTypes.default.any.isRequired
    };
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.selectedTraceLocation.source.id != this.props.selectedTraceLocation.source.id || nextProps.selectedTraceLocation.line != this.props.selectedTraceLocation.line || nextProps.allTraces.length != this.props.allTraces.length || nextProps.selectedTraceLocationTraces !== this.props.selectedTraceLocationTraces || nextProps.selectedTraceIndex != this.props.selectedTraceIndex;
  } // FIXME: https://bugzilla.mozilla.org/show_bug.cgi?id=1774507


  UNSAFE_componentWillMount() {
    return this.renderToWidget(this.props);
  } // FIXME: https://bugzilla.mozilla.org/show_bug.cgi?id=1774507


  UNSAFE_componentWillUpdate() {}

  componentDidUpdate() {
    this.renderToWidget(this.props);
  }

  componentWillUnmount() {
    const {
      editor
    } = this.props;
    editor.removeLineContentMarker(editor.markerTypes.TRACE_MARKER);
  }

  renderToWidget(props) {
    const {
      selectedTraceLocation,
      editor
    } = props;
    editor.removeLineContentMarker(editor.markerTypes.TRACE_MARKER);

    if (!selectedTraceLocation || !this.props.selectedTraceLocationTraces) {
      return;
    }

    const editorLine = (0, _index.toEditorLine)(selectedTraceLocation.source.id, selectedTraceLocation.line || 0);
    editor.setLineContentMarker({
      id: editor.markerTypes.TRACE_MARKER,
      lines: [{
        line: editorLine
      }],
      renderAsBlock: true,
      createLineElementNode: () => {
        return this.renderTracePanel(this.props);
      }
    });
  }

  renderTracePanel() {
    const panel = document.createElement("aside");
    panel.className = "trace-inline-panel-container";
    const {
      allTraces,
      selectedTraceLocationTraces,
      selectedTraceIndex
    } = this.props;
    const traceButtons = [];
    const selectedIndex = selectedTraceLocationTraces.indexOf(allTraces[selectedTraceIndex]);
    const startIndex = selectedIndex == -1 ? 0 : Math.max(0, selectedIndex - 5);
    const lastIndex = Math.min(selectedTraceLocationTraces.length, startIndex + 10);

    for (let traceIndex = startIndex; traceIndex < lastIndex; traceIndex++) {
      const selected = traceIndex === selectedIndex;
      traceButtons.push((0, _reactDomFactories.button)({
        key: `${traceIndex}-${selected}`,
        className: `trace-item${selected ? " selected" : ""}`,
        onClick: () => {
          this.props.selectTrace(allTraces.indexOf(selectedTraceLocationTraces[traceIndex]));
        }
      }, traceIndex + 1));
    }

    const traceCount = this.props.selectedTraceLocationTraces.length;

    _reactDom.default.render((0, _reactDomFactories.div)({
      className: "trace-panel"
    }, (0, _reactDomFactories.span)(null, `${traceCount} execution${traceCount > 1 ? "s" : ""}: `), traceButtons), panel);

    return panel;
  }

  render() {
    return null;
  }

}

exports.TracePanel = TracePanel;

const mapStateToProps = state => {
  const selectedTraceLocation = (0, _index3.getSelectedTraceLocation)(state);
  const allTraces = (0, _index3.getAllTraces)(state);
  const selectedTraceIndex = (0, _index3.getSelectedTraceIndex)(state);
  const selectedTraceLocationTraces = (0, _index3.getSelectedLocationTraces)(state);
  return {
    selectedTraceLocation,
    allTraces,
    selectedTraceLocationTraces,
    selectedTraceIndex
  };
};

const mapDispatchToProps = {
  selectTrace: _index2.default.selectTrace
};

var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(TracePanel);

exports.default = _default;