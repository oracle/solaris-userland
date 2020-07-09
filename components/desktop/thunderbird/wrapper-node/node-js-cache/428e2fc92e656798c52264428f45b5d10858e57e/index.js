"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _classnames = _interopRequireDefault(require("devtools/client/debugger/dist/vendors").vendored["classnames"]);

var _devtoolsSourceMap = require("devtools/client/shared/source-map/index.js");

loader.lazyRequireGetter(this, "_connect", "devtools/client/debugger/src/utils/connect");

var _immutable = require("devtools/client/shared/vendor/immutable");

var _actions = _interopRequireDefault(require("../../actions/index"));

loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");

var _AccessibleImage = _interopRequireDefault(require("../shared/AccessibleImage"));

loader.lazyRequireGetter(this, "_prefs", "devtools/client/debugger/src/utils/prefs");

var _Breakpoints = _interopRequireDefault(require("./Breakpoints/index"));

var _Expressions = _interopRequireDefault(require("./Expressions"));

var _devtoolsSplitter = _interopRequireDefault(require("devtools/client/debugger/dist/vendors").vendored["devtools-splitter"]);

var _Frames = _interopRequireDefault(require("./Frames/index"));

var _Threads = _interopRequireDefault(require("./Threads"));

var _Accordion = _interopRequireDefault(require("../shared/Accordion"));

var _CommandBar = _interopRequireDefault(require("./CommandBar"));

var _XHRBreakpoints = _interopRequireDefault(require("./XHRBreakpoints"));

var _EventListeners = _interopRequireDefault(require("./EventListeners"));

var _DOMMutationBreakpoints = _interopRequireDefault(require("./DOMMutationBreakpoints"));

var _WhyPaused = _interopRequireDefault(require("./WhyPaused"));

var _Scopes = _interopRequireDefault(require("./Scopes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function debugBtn(onClick, type, className, tooltip) {
  return _react.default.createElement("button", {
    onClick: onClick,
    className: `${type} ${className}`,
    key: type,
    title: tooltip
  }, _react.default.createElement(_AccessibleImage.default, {
    className: type,
    title: tooltip,
    "aria-label": tooltip
  }));
}

const mdnLink = "https://developer.mozilla.org/docs/Tools/Debugger/Using_the_Debugger_map_scopes_feature?utm_source=devtools&utm_medium=debugger-map-scopes";

class SecondaryPanes extends _react.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "onExpressionAdded", () => {
      this.setState({
        showExpressionsInput: false
      });
    });

    _defineProperty(this, "onXHRAdded", () => {
      this.setState({
        showXHRInput: false
      });
    });

    this.state = {
      showExpressionsInput: false,
      showXHRInput: false
    };
  }

  renderBreakpointsToggle() {
    const {
      cx,
      toggleAllBreakpoints,
      breakpoints,
      breakpointsDisabled
    } = this.props;
    const isIndeterminate = !breakpointsDisabled && breakpoints.some(x => x.disabled);

    if (_prefs.features.skipPausing || breakpoints.length === 0) {
      return null;
    }

    const inputProps = {
      type: "checkbox",
      "aria-label": breakpointsDisabled ? L10N.getStr("breakpoints.enable") : L10N.getStr("breakpoints.disable"),
      className: "breakpoints-toggle",
      disabled: false,
      key: "breakpoints-toggle",
      onChange: e => {
        e.stopPropagation();
        toggleAllBreakpoints(cx, !breakpointsDisabled);
      },
      onClick: e => e.stopPropagation(),
      checked: !breakpointsDisabled && !isIndeterminate,
      ref: input => {
        if (input) {
          input.indeterminate = isIndeterminate;
        }
      },
      title: breakpointsDisabled ? L10N.getStr("breakpoints.enable") : L10N.getStr("breakpoints.disable")
    };
    return _react.default.createElement("input", inputProps);
  }

  watchExpressionHeaderButtons() {
    const {
      expressions
    } = this.props;
    const buttons = [];

    if (expressions.length) {
      buttons.push(debugBtn(evt => {
        evt.stopPropagation();
        this.props.evaluateExpressions(this.props.cx);
      }, "refresh", "refresh", L10N.getStr("watchExpressions.refreshButton")));
    }

    buttons.push(debugBtn(evt => {
      if (_prefs.prefs.expressionsVisible) {
        evt.stopPropagation();
      }

      this.setState({
        showExpressionsInput: true
      });
    }, "plus", "plus", L10N.getStr("expressions.placeholder")));
    return buttons;
  }

  xhrBreakpointsHeaderButtons() {
    const buttons = [];
    buttons.push(debugBtn(evt => {
      if (_prefs.prefs.xhrBreakpointsVisible) {
        evt.stopPropagation();
      }

      this.setState({
        showXHRInput: true
      });
    }, "plus", "plus", L10N.getStr("xhrBreakpoints.label")));
    return buttons;
  }

  getScopeItem() {
    return {
      header: L10N.getStr("scopes.header"),
      className: "scopes-pane",
      component: _react.default.createElement(_Scopes.default, null),
      opened: _prefs.prefs.scopesVisible,
      buttons: this.getScopesButtons(),
      onToggle: opened => {
        _prefs.prefs.scopesVisible = opened;
      }
    };
  }

  getScopesButtons() {
    const {
      selectedFrame,
      mapScopesEnabled,
      source
    } = this.props;

    if (!selectedFrame || (0, _devtoolsSourceMap.isGeneratedId)(selectedFrame.location.sourceId) || (source === null || source === void 0 ? void 0 : source.isPrettyPrinted)) {
      return null;
    }

    return [_react.default.createElement("div", {
      key: "scopes-buttons"
    }, _react.default.createElement("label", {
      className: "map-scopes-header",
      title: L10N.getStr("scopes.mapping.label"),
      onClick: e => e.stopPropagation()
    }, _react.default.createElement("input", {
      type: "checkbox",
      checked: mapScopesEnabled ? "checked" : "",
      onChange: e => this.props.toggleMapScopes()
    }), L10N.getStr("scopes.map.label")), _react.default.createElement("a", {
      className: "mdn",
      target: "_blank",
      href: mdnLink,
      onClick: e => e.stopPropagation(),
      title: L10N.getStr("scopes.helpTooltip.label")
    }, _react.default.createElement(_AccessibleImage.default, {
      className: "shortcuts"
    })))];
  }

  getEventButtons() {
    const {
      logEventBreakpoints
    } = this.props;
    return [_react.default.createElement("div", {
      key: "events-buttons"
    }, _react.default.createElement("label", {
      className: "events-header",
      title: L10N.getStr("eventlisteners.log.label"),
      onClick: e => e.stopPropagation()
    }, _react.default.createElement("input", {
      type: "checkbox",
      checked: logEventBreakpoints ? "checked" : "",
      onChange: e => this.props.toggleEventLogging(),
      onKeyDown: e => e.stopPropagation()
    }), L10N.getStr("eventlisteners.log")))];
  }

  getWatchItem() {
    return {
      header: L10N.getStr("watchExpressions.header"),
      className: "watch-expressions-pane",
      buttons: this.watchExpressionHeaderButtons(),
      component: _react.default.createElement(_Expressions.default, {
        showInput: this.state.showExpressionsInput,
        onExpressionAdded: this.onExpressionAdded
      }),
      opened: _prefs.prefs.expressionsVisible,
      onToggle: opened => {
        _prefs.prefs.expressionsVisible = opened;
      }
    };
  }

  getXHRItem() {
    const {
      pauseReason
    } = this.props;
    return {
      header: L10N.getStr("xhrBreakpoints.header"),
      className: "xhr-breakpoints-pane",
      buttons: this.xhrBreakpointsHeaderButtons(),
      component: _react.default.createElement(_XHRBreakpoints.default, {
        showInput: this.state.showXHRInput,
        onXHRAdded: this.onXHRAdded
      }),
      opened: _prefs.prefs.xhrBreakpointsVisible || pauseReason === "XHR",
      onToggle: opened => {
        _prefs.prefs.xhrBreakpointsVisible = opened;
      }
    };
  }

  getCallStackItem() {
    return {
      header: L10N.getStr("callStack.header"),
      className: "call-stack-pane",
      component: _react.default.createElement(_Frames.default, {
        panel: "debugger"
      }),
      opened: _prefs.prefs.callStackVisible,
      onToggle: opened => {
        _prefs.prefs.callStackVisible = opened;
      }
    };
  }

  getThreadsItem() {
    return {
      header: L10N.getStr("threadsHeader"),
      className: "threads-pane",
      component: _react.default.createElement(_Threads.default, null),
      opened: _prefs.prefs.workersVisible,
      onToggle: opened => {
        _prefs.prefs.workersVisible = opened;
      }
    };
  }

  getBreakpointsItem() {
    const {
      shouldPauseOnExceptions,
      shouldPauseOnCaughtExceptions,
      pauseOnExceptions,
      pauseReason
    } = this.props;
    return {
      header: L10N.getStr("breakpoints.header"),
      className: "breakpoints-pane",
      buttons: [this.renderBreakpointsToggle()],
      component: _react.default.createElement(_Breakpoints.default, {
        shouldPauseOnExceptions: shouldPauseOnExceptions,
        shouldPauseOnCaughtExceptions: shouldPauseOnCaughtExceptions,
        pauseOnExceptions: pauseOnExceptions
      }),
      opened: _prefs.prefs.breakpointsVisible || pauseReason === "breakpoint" || pauseReason === "resumeLimit",
      onToggle: opened => {
        _prefs.prefs.breakpointsVisible = opened;
      }
    };
  }

  getEventListenersItem() {
    const {
      pauseReason
    } = this.props;
    return {
      header: L10N.getStr("eventListenersHeader1"),
      className: "event-listeners-pane",
      buttons: this.getEventButtons(),
      component: _react.default.createElement(_EventListeners.default, null),
      opened: _prefs.prefs.eventListenersVisible || pauseReason === "eventBreakpoint",
      onToggle: opened => {
        _prefs.prefs.eventListenersVisible = opened;
      }
    };
  }

  getDOMMutationsItem() {
    const {
      pauseReason
    } = this.props;
    return {
      header: L10N.getStr("domMutationHeader"),
      className: "dom-mutations-pane",
      buttons: [],
      component: _react.default.createElement(_DOMMutationBreakpoints.default, null),
      opened: _prefs.prefs.domMutationBreakpointsVisible || pauseReason === "mutationBreakpoint",
      onToggle: opened => {
        _prefs.prefs.domMutationBreakpointsVisible = opened;
      }
    };
  }

  getStartItems() {
    const items = [];
    const {
      horizontal,
      hasFrames
    } = this.props;

    if (horizontal) {
      if (_prefs.features.workers && this.props.workers.length > 0) {
        items.push(this.getThreadsItem());
      }

      items.push(this.getWatchItem());
    }

    items.push(this.getBreakpointsItem());

    if (hasFrames) {
      items.push(this.getCallStackItem());

      if (horizontal) {
        items.push(this.getScopeItem());
      }
    }

    if (_prefs.features.xhrBreakpoints) {
      items.push(this.getXHRItem());
    }

    if (_prefs.features.eventListenersBreakpoints) {
      items.push(this.getEventListenersItem());
    }

    if (_prefs.features.domMutationBreakpoints) {
      items.push(this.getDOMMutationsItem());
    }

    return items;
  }

  getEndItems() {
    if (this.props.horizontal) {
      return [];
    }

    const items = [];

    if (_prefs.features.workers && this.props.workers.length > 0) {
      items.push(this.getThreadsItem());
    }

    items.push(this.getWatchItem());

    if (this.props.hasFrames) {
      items.push(this.getScopeItem());
    }

    return items;
  }

  getItems() {
    return [...this.getStartItems(), ...this.getEndItems()];
  }

  renderHorizontalLayout() {
    const {
      renderWhyPauseDelay
    } = this.props;
    return _react.default.createElement("div", null, _react.default.createElement(_WhyPaused.default, {
      delay: renderWhyPauseDelay
    }), _react.default.createElement(_Accordion.default, {
      items: this.getItems()
    }));
  }

  renderVerticalLayout() {
    return _react.default.createElement(_devtoolsSplitter.default, {
      initialSize: "300px",
      minSize: 10,
      maxSize: "50%",
      splitterSize: 1,
      startPanel: _react.default.createElement("div", {
        style: {
          width: "inherit"
        }
      }, _react.default.createElement(_WhyPaused.default, {
        delay: this.props.renderWhyPauseDelay
      }), _react.default.createElement(_Accordion.default, {
        items: this.getStartItems()
      })),
      endPanel: _react.default.createElement(_Accordion.default, {
        items: this.getEndItems()
      })
    });
  }

  render() {
    const {
      skipPausing
    } = this.props;
    return _react.default.createElement("div", {
      className: "secondary-panes-wrapper"
    }, _react.default.createElement(_CommandBar.default, {
      horizontal: this.props.horizontal
    }), _react.default.createElement("div", {
      className: (0, _classnames.default)("secondary-panes", skipPausing && "skip-pausing")
    }, this.props.horizontal ? this.renderHorizontalLayout() : this.renderVerticalLayout()));
  }

} // Checks if user is in debugging mode and adds a delay preventing
// excessive vertical 'jumpiness'


function getRenderWhyPauseDelay(state, thread) {
  const inPauseCommand = !!(0, _selectors.getPauseCommand)(state, thread);

  if (!inPauseCommand) {
    return 100;
  }

  return 0;
}

const mapStateToProps = state => {
  const thread = (0, _selectors.getCurrentThread)(state);
  const selectedFrame = (0, _selectors.getSelectedFrame)(state, thread);
  const pauseReason = (0, _selectors.getPauseReason)(state, thread);
  return {
    cx: (0, _selectors.getThreadContext)(state),
    expressions: (0, _selectors.getExpressions)(state),
    hasFrames: !!(0, _selectors.getTopFrame)(state, thread),
    breakpoints: (0, _selectors.getBreakpointsList)(state),
    breakpointsDisabled: (0, _selectors.getBreakpointsDisabled)(state),
    isWaitingOnBreak: (0, _selectors.getIsWaitingOnBreak)(state, thread),
    renderWhyPauseDelay: getRenderWhyPauseDelay(state, thread),
    selectedFrame,
    mapScopesEnabled: (0, _selectors.isMapScopesEnabled)(state),
    shouldPauseOnExceptions: (0, _selectors.getShouldPauseOnExceptions)(state),
    shouldPauseOnCaughtExceptions: (0, _selectors.getShouldPauseOnCaughtExceptions)(state),
    workers: (0, _selectors.getThreads)(state),
    skipPausing: (0, _selectors.getSkipPausing)(state),
    logEventBreakpoints: (0, _selectors.shouldLogEventBreakpoints)(state),
    source: selectedFrame && (0, _selectors.getSourceFromId)(state, selectedFrame.location.sourceId),
    pauseReason: (pauseReason === null || pauseReason === void 0 ? void 0 : pauseReason.type) ?? ""
  };
};

var _default = (0, _connect.connect)(mapStateToProps, {
  toggleAllBreakpoints: _actions.default.toggleAllBreakpoints,
  evaluateExpressions: _actions.default.evaluateExpressions,
  pauseOnExceptions: _actions.default.pauseOnExceptions,
  toggleMapScopes: _actions.default.toggleMapScopes,
  breakOnNext: _actions.default.breakOnNext,
  toggleEventLogging: _actions.default.toggleEventLogging
})(SecondaryPanes);

exports.default = _default;