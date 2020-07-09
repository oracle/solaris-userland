"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = require("devtools/client/shared/vendor/react");

var _classnames = _interopRequireDefault(require("devtools/client/debugger/dist/vendors").vendored["classnames"]);

loader.lazyRequireGetter(this, "_editor", "devtools/client/debugger/src/utils/editor/index");
loader.lazyRequireGetter(this, "_selectedLocation", "devtools/client/debugger/src/utils/selected-location");
loader.lazyRequireGetter(this, "_prefs", "devtools/client/debugger/src/utils/prefs");

var _devtoolsContextmenu = require("devtools/client/debugger/dist/vendors").vendored["devtools-contextmenu"];

loader.lazyRequireGetter(this, "_breakpoints", "devtools/client/debugger/src/components/Editor/menus/breakpoints");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const breakpointSvg = document.createElement("div");
breakpointSvg.innerHTML = '<svg viewBox="0 0 60 15" width="60" height="15"><path d="M53.07.5H1.5c-.54 0-1 .46-1 1v12c0 .54.46 1 1 1h51.57c.58 0 1.15-.26 1.53-.7l4.7-6.3-4.7-6.3c-.38-.44-.95-.7-1.53-.7z"/></svg>';

class Breakpoint extends _react.PureComponent {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "onClick", event => {
      const {
        cx,
        breakpointActions,
        editorActions,
        breakpoint,
        selectedSource
      } = this.props; // ignore right clicks

      if (event.ctrlKey && event.button === 0 || event.button === 2) {
        return;
      }

      event.stopPropagation();
      event.preventDefault();
      const selectedLocation = (0, _selectedLocation.getSelectedLocation)(breakpoint, selectedSource);

      if (event.metaKey) {
        return editorActions.continueToHere(cx, selectedLocation.line);
      }

      if (event.shiftKey) {
        if (_prefs.features.columnBreakpoints) {
          return breakpointActions.toggleBreakpointsAtLine(cx, !breakpoint.disabled, selectedLocation.line);
        }

        return breakpointActions.toggleDisabledBreakpoint(cx, breakpoint);
      }

      return breakpointActions.removeBreakpointsAtLine(cx, selectedLocation.sourceId, selectedLocation.line);
    });

    _defineProperty(this, "onContextMenu", event => {
      const {
        cx,
        breakpoint,
        selectedSource,
        breakpointActions
      } = this.props;
      event.stopPropagation();
      event.preventDefault();
      const selectedLocation = (0, _selectedLocation.getSelectedLocation)(breakpoint, selectedSource);
      (0, _devtoolsContextmenu.showMenu)(event, (0, _breakpoints.breakpointItems)(cx, breakpoint, selectedLocation, breakpointActions));
    });
  }

  componentDidMount() {
    this.addBreakpoint(this.props);
  }

  componentDidUpdate(prevProps) {
    this.removeBreakpoint(prevProps);
    this.addBreakpoint(this.props);
  }

  componentWillUnmount() {
    this.removeBreakpoint(this.props);
  }

  makeMarker() {
    const {
      breakpoint
    } = this.props;
    const bp = breakpointSvg.cloneNode(true);
    bp.className = (0, _classnames.default)("editor new-breakpoint", {
      "breakpoint-disabled": breakpoint.disabled,
      "folding-enabled": _prefs.features.codeFolding
    });
    bp.onmousedown = this.onClick;
    bp.oncontextmenu = this.onContextMenu;
    return bp;
  }

  addBreakpoint(props) {
    const {
      breakpoint,
      editor,
      selectedSource
    } = props;
    const selectedLocation = (0, _selectedLocation.getSelectedLocation)(breakpoint, selectedSource); // Hidden Breakpoints are never rendered on the client

    if (breakpoint.options.hidden) {
      return;
    }

    if (!selectedSource) {
      return;
    }

    const sourceId = selectedSource.id;
    const line = (0, _editor.toEditorLine)(sourceId, selectedLocation.line);
    const doc = (0, _editor.getDocument)(sourceId);
    doc.setGutterMarker(line, "breakpoints", this.makeMarker());
    editor.codeMirror.addLineClass(line, "wrapClass", "new-breakpoint");
    editor.codeMirror.removeLineClass(line, "wrapClass", "breakpoint-disabled");
    editor.codeMirror.removeLineClass(line, "wrapClass", "has-condition");
    editor.codeMirror.removeLineClass(line, "wrapClass", "has-log");

    if (breakpoint.disabled) {
      editor.codeMirror.addLineClass(line, "wrapClass", "breakpoint-disabled");
    }

    if (breakpoint.options.logValue) {
      editor.codeMirror.addLineClass(line, "wrapClass", "has-log");
    } else if (breakpoint.options.condition) {
      editor.codeMirror.addLineClass(line, "wrapClass", "has-condition");
    }
  }

  removeBreakpoint(props) {
    const {
      selectedSource,
      breakpoint
    } = props;

    if (!selectedSource) {
      return;
    }

    const sourceId = selectedSource.id;
    const doc = (0, _editor.getDocument)(sourceId);

    if (!doc) {
      return;
    }

    const selectedLocation = (0, _selectedLocation.getSelectedLocation)(breakpoint, selectedSource);
    const line = (0, _editor.toEditorLine)(sourceId, selectedLocation.line);
    doc.setGutterMarker(line, "breakpoints", null);
    doc.removeLineClass(line, "wrapClass", "new-breakpoint");
    doc.removeLineClass(line, "wrapClass", "breakpoint-disabled");
    doc.removeLineClass(line, "wrapClass", "has-condition");
    doc.removeLineClass(line, "wrapClass", "has-log");
  }

  render() {
    return null;
  }

}

var _default = Breakpoint;
exports.default = _default;