"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("devtools/client/shared/vendor/react");

var _react2 = _interopRequireDefault(_react);

var _devtoolsSourceMap = require("devtools/client/shared/source-map/index.js");

var _connect = require("../../utils/connect");

var _immutable = require("devtools/client/shared/vendor/immutable");

var _actions = require("../../actions/index");

var _actions2 = _interopRequireDefault(_actions);

var _selectors = require("../../selectors/index");

var _AccessibleImage = require("../shared/AccessibleImage");

var _AccessibleImage2 = _interopRequireDefault(_AccessibleImage);

var _prefs = require("../../utils/prefs");

var _Breakpoints = require("./Breakpoints/index");

var _Breakpoints2 = _interopRequireDefault(_Breakpoints);

var _Expressions = require("./Expressions");

var _Expressions2 = _interopRequireDefault(_Expressions);

var _devtoolsSplitter = require("devtools/client/debugger/dist/vendors").vendored["devtools-splitter"];

var _devtoolsSplitter2 = _interopRequireDefault(_devtoolsSplitter);

var _Frames = require("./Frames/index");

var _Frames2 = _interopRequireDefault(_Frames);

var _Workers = require("./Workers");

var _Workers2 = _interopRequireDefault(_Workers);

var _Accordion = require("../shared/Accordion");

var _Accordion2 = _interopRequireDefault(_Accordion);

var _CommandBar = require("./CommandBar");

var _CommandBar2 = _interopRequireDefault(_CommandBar);

var _UtilsBar = require("./UtilsBar");

var _UtilsBar2 = _interopRequireDefault(_UtilsBar);

var _XHRBreakpoints = require("./XHRBreakpoints");

var _XHRBreakpoints2 = _interopRequireDefault(_XHRBreakpoints);

var _EventListeners = require("./EventListeners");

var _EventListeners2 = _interopRequireDefault(_EventListeners);

var _WhyPaused = require("./WhyPaused");

var _WhyPaused2 = _interopRequireDefault(_WhyPaused);

var _Scopes = require("./Scopes");

var _Scopes2 = _interopRequireDefault(_Scopes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

function debugBtn(onClick, type, className, tooltip) {
  return _react2.default.createElement(
    "button",
    {
      onClick: onClick,
      className: `${type} ${className}`,
      key: type,
      title: tooltip
    },
    _react2.default.createElement(_AccessibleImage2.default, { className: type, title: tooltip, "aria-label": tooltip })
  );
}

const mdnLink = "https://developer.mozilla.org/docs/Tools/Debugger/Using_the_Debugger_map_scopes_feature?utm_source=devtools&utm_medium=debugger-map-scopes";

class SecondaryPanes extends _react.Component {
  constructor(props) {
    super(props);

    this.onExpressionAdded = () => {
      this.setState({ showExpressionsInput: false });
    };

    this.onXHRAdded = () => {
      this.setState({ showXHRInput: false });
    };

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

    return _react2.default.createElement("input", inputProps);
  }

  watchExpressionHeaderButtons() {
    const { expressions } = this.props;

    const buttons = [];

    if (expressions.size) {
      buttons.push(debugBtn(evt => {
        evt.stopPropagation();
        this.props.evaluateExpressions(this.props.cx);
      }, "refresh", "refresh", L10N.getStr("watchExpressions.refreshButton")));
    }

    buttons.push(debugBtn(evt => {
      if (_prefs.prefs.expressionsVisible) {
        evt.stopPropagation();
      }
      this.setState({ showExpressionsInput: true });
    }, "plus", "plus", L10N.getStr("expressions.placeholder")));

    return buttons;
  }

  xhrBreakpointsHeaderButtons() {
    const buttons = [];

    buttons.push(debugBtn(evt => {
      if (_prefs.prefs.xhrBreakpointsVisible) {
        evt.stopPropagation();
      }
      this.setState({ showXHRInput: true });
    }, "plus", "plus", L10N.getStr("xhrBreakpoints.label")));

    return buttons;
  }

  getScopeItem() {
    return {
      header: L10N.getStr("scopes.header"),
      className: "scopes-pane",
      component: _react2.default.createElement(_Scopes2.default, null),
      opened: _prefs.prefs.scopesVisible,
      buttons: this.getScopesButtons(),
      onToggle: opened => {
        _prefs.prefs.scopesVisible = opened;
      }
    };
  }

  getScopesButtons() {
    const { selectedFrame, mapScopesEnabled } = this.props;

    if (!selectedFrame || (0, _devtoolsSourceMap.isGeneratedId)(selectedFrame.location.sourceId)) {
      return null;
    }

    return [_react2.default.createElement(
      "div",
      { key: "scopes-buttons" },
      _react2.default.createElement(
        "label",
        {
          className: "map-scopes-header",
          title: L10N.getStr("scopes.mapping.label"),
          onClick: e => e.stopPropagation()
        },
        _react2.default.createElement("input", {
          type: "checkbox",
          checked: mapScopesEnabled ? "checked" : "",
          onChange: e => this.props.toggleMapScopes()
        }),
        L10N.getStr("scopes.map.label")
      ),
      _react2.default.createElement(
        "a",
        {
          className: "mdn",
          target: "_blank",
          href: mdnLink,
          onClick: e => e.stopPropagation(),
          title: L10N.getStr("scopes.helpTooltip.label")
        },
        _react2.default.createElement(_AccessibleImage2.default, { className: "shortcuts" })
      )
    )];
  }

  getWatchItem() {
    return {
      header: L10N.getStr("watchExpressions.header"),
      className: "watch-expressions-pane",
      buttons: this.watchExpressionHeaderButtons(),
      component: _react2.default.createElement(_Expressions2.default, {
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
    return {
      header: L10N.getStr("xhrBreakpoints.header"),
      className: "xhr-breakpoints-pane",
      buttons: this.xhrBreakpointsHeaderButtons(),
      component: _react2.default.createElement(_XHRBreakpoints2.default, {
        showInput: this.state.showXHRInput,
        onXHRAdded: this.onXHRAdded
      }),
      opened: _prefs.prefs.xhrBreakpointsVisible,
      onToggle: opened => {
        _prefs.prefs.xhrBreakpointsVisible = opened;
      }
    };
  }

  getCallStackItem() {
    return {
      header: L10N.getStr("callStack.header"),
      className: "call-stack-pane",
      component: _react2.default.createElement(_Frames2.default, null),
      opened: _prefs.prefs.callStackVisible,
      onToggle: opened => {
        _prefs.prefs.callStackVisible = opened;
      }
    };
  }

  getWorkersItem() {
    return {
      header: _prefs.features.windowlessWorkers ? L10N.getStr("threadsHeader") : L10N.getStr("workersHeader"),
      className: "workers-pane",
      component: _react2.default.createElement(_Workers2.default, null),
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
      pauseOnExceptions
    } = this.props;

    return {
      header: L10N.getStr("breakpoints.header"),
      className: "breakpoints-pane",
      buttons: [this.renderBreakpointsToggle()],
      component: _react2.default.createElement(_Breakpoints2.default, {
        shouldPauseOnExceptions: shouldPauseOnExceptions,
        shouldPauseOnCaughtExceptions: shouldPauseOnCaughtExceptions,
        pauseOnExceptions: pauseOnExceptions
      }),
      opened: _prefs.prefs.breakpointsVisible,
      onToggle: opened => {
        _prefs.prefs.breakpointsVisible = opened;
      }
    };
  }

  getEventListenersItem() {
    return {
      header: L10N.getStr("eventListenersHeader"),
      className: "event-listeners-pane",
      buttons: [],
      component: _react2.default.createElement(_EventListeners2.default, null),
      opened: _prefs.prefs.eventListenersVisible,
      onToggle: opened => {
        _prefs.prefs.eventListenersVisible = opened;
      }
    };
  }

  getStartItems() {
    const items = [];
    const { horizontal, hasFrames } = this.props;

    if (horizontal) {
      if (_prefs.features.workers && this.props.workers.length > 0) {
        items.push(this.getWorkersItem());
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

    return items;
  }

  getEndItems() {
    if (this.props.horizontal) {
      return [];
    }

    const items = [];
    if (_prefs.features.workers && this.props.workers.length > 0) {
      items.push(this.getWorkersItem());
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
    const { renderWhyPauseDelay } = this.props;

    return _react2.default.createElement(
      "div",
      null,
      _react2.default.createElement(_WhyPaused2.default, { delay: renderWhyPauseDelay }),
      _react2.default.createElement(_Accordion2.default, { items: this.getItems() })
    );
  }

  renderVerticalLayout() {
    return _react2.default.createElement(_devtoolsSplitter2.default, {
      initialSize: "300px",
      minSize: 10,
      maxSize: "50%",
      splitterSize: 1,
      startPanel: _react2.default.createElement(
        "div",
        { style: { width: "inherit" } },
        _react2.default.createElement(_WhyPaused2.default, { delay: this.props.renderWhyPauseDelay }),
        _react2.default.createElement(_Accordion2.default, { items: this.getStartItems() })
      ),
      endPanel: _react2.default.createElement(_Accordion2.default, { items: this.getEndItems() })
    });
  }

  renderUtilsBar() {
    if (!_prefs.features.shortcuts) {
      return;
    }

    return _react2.default.createElement(_UtilsBar2.default, {
      horizontal: this.props.horizontal,
      toggleShortcutsModal: this.props.toggleShortcutsModal
    });
  }

  render() {
    return _react2.default.createElement(
      "div",
      { className: "secondary-panes-wrapper" },
      _react2.default.createElement(_CommandBar2.default, { horizontal: this.props.horizontal }),
      _react2.default.createElement(
        "div",
        { className: "secondary-panes" },
        this.props.horizontal ? this.renderHorizontalLayout() : this.renderVerticalLayout()
      ),
      this.renderUtilsBar()
    );
  }
}

// Checks if user is in debugging mode and adds a delay preventing
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

  return {
    cx: (0, _selectors.getThreadContext)(state),
    expressions: (0, _selectors.getExpressions)(state),
    hasFrames: !!(0, _selectors.getTopFrame)(state, thread),
    breakpoints: (0, _selectors.getBreakpointsList)(state),
    breakpointsDisabled: (0, _selectors.getBreakpointsDisabled)(state),
    isWaitingOnBreak: (0, _selectors.getIsWaitingOnBreak)(state, thread),
    renderWhyPauseDelay: getRenderWhyPauseDelay(state, thread),
    selectedFrame: (0, _selectors.getSelectedFrame)(state, thread),
    mapScopesEnabled: (0, _selectors.isMapScopesEnabled)(state),
    shouldPauseOnExceptions: (0, _selectors.getShouldPauseOnExceptions)(state),
    shouldPauseOnCaughtExceptions: (0, _selectors.getShouldPauseOnCaughtExceptions)(state),
    workers: (0, _selectors.getWorkers)(state)
  };
};

exports.default = (0, _connect.connect)(mapStateToProps, {
  toggleAllBreakpoints: _actions2.default.toggleAllBreakpoints,
  evaluateExpressions: _actions2.default.evaluateExpressions,
  pauseOnExceptions: _actions2.default.pauseOnExceptions,
  toggleMapScopes: _actions2.default.toggleMapScopes,
  breakOnNext: _actions2.default.breakOnNext
})(SecondaryPanes);