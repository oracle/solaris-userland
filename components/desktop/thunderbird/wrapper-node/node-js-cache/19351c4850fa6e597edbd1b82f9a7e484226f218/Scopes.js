"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("devtools/client/shared/vendor/react");

var _react2 = _interopRequireDefault(_react);

var _connect = require("../../utils/connect");

var _actions = require("../../actions/index");

var _actions2 = _interopRequireDefault(_actions);

var _firefox = require("../../client/firefox");

var _selectors = require("../../selectors/index");

var _scopes = require("../../utils/pause/scopes/index");

var _devtoolsReps = require("devtools/client/shared/components/reps/reps.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const { ObjectInspector } = _devtoolsReps.objectInspector;

// eslint-disable-next-line import/named
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

class Scopes extends _react.PureComponent {
  constructor(props, ...args) {
    const {
      why,
      selectedFrame,
      originalFrameScopes,
      generatedFrameScopes
    } = props;

    super(props, ...args);

    this.onToggleMapScopes = () => {
      this.props.toggleMapScopes();
    };

    this.state = {
      originalScopes: (0, _scopes.getScopes)(why, selectedFrame, originalFrameScopes),
      generatedScopes: (0, _scopes.getScopes)(why, selectedFrame, generatedFrameScopes),
      showOriginal: true
    };
  }

  componentWillReceiveProps(nextProps) {
    const {
      isPaused,
      selectedFrame,
      originalFrameScopes,
      generatedFrameScopes
    } = this.props;
    const isPausedChanged = isPaused !== nextProps.isPaused;
    const selectedFrameChanged = selectedFrame !== nextProps.selectedFrame;
    const originalFrameScopesChanged = originalFrameScopes !== nextProps.originalFrameScopes;
    const generatedFrameScopesChanged = generatedFrameScopes !== nextProps.generatedFrameScopes;

    if (isPausedChanged || selectedFrameChanged || originalFrameScopesChanged || generatedFrameScopesChanged) {
      this.setState({
        originalScopes: (0, _scopes.getScopes)(nextProps.why, nextProps.selectedFrame, nextProps.originalFrameScopes),
        generatedScopes: (0, _scopes.getScopes)(nextProps.why, nextProps.selectedFrame, nextProps.generatedFrameScopes)
      });
    }
  }

  renderScopesList() {
    const {
      isPaused,
      isLoading,
      openLink,
      openElementInInspector,
      highlightDomElement,
      unHighlightDomElement,
      mapScopesEnabled
    } = this.props;
    const { originalScopes, generatedScopes, showOriginal } = this.state;

    const scopes = showOriginal && mapScopesEnabled && originalScopes || generatedScopes;

    if (scopes && scopes.length > 0 && !isLoading) {
      return _react2.default.createElement(
        "div",
        { className: "pane scopes-list" },
        _react2.default.createElement(ObjectInspector, {
          roots: scopes,
          autoExpandAll: false,
          autoExpandDepth: 1,
          disableWrap: true,
          dimTopLevelWindow: true,
          openLink: openLink,
          createObjectClient: grip => (0, _firefox.createObjectClient)(grip),
          onDOMNodeClick: grip => openElementInInspector(grip),
          onInspectIconClick: grip => openElementInInspector(grip),
          onDOMNodeMouseOver: grip => highlightDomElement(grip),
          onDOMNodeMouseOut: grip => unHighlightDomElement(grip)
        })
      );
    }

    let stateText = L10N.getStr("scopes.notPaused");
    if (isPaused) {
      if (isLoading) {
        stateText = L10N.getStr("loadingText");
      } else {
        stateText = L10N.getStr("scopes.notAvailable");
      }
    }

    return _react2.default.createElement(
      "div",
      { className: "pane scopes-list" },
      _react2.default.createElement(
        "div",
        { className: "pane-info" },
        stateText
      )
    );
  }

  render() {
    return _react2.default.createElement(
      "div",
      { className: "scopes-content" },
      this.renderScopesList()
    );
  }
}

const mapStateToProps = state => {
  const thread = (0, _selectors.getCurrentThread)(state);
  const selectedFrame = (0, _selectors.getSelectedFrame)(state, thread);
  const selectedSource = (0, _selectors.getSelectedSource)(state);

  const {
    scope: originalFrameScopes,
    pending: originalPending
  } = (0, _selectors.getOriginalFrameScope)(state, thread, selectedSource && selectedSource.id, selectedFrame && selectedFrame.id) || { scope: null, pending: false };

  const {
    scope: generatedFrameScopes,
    pending: generatedPending
  } = (0, _selectors.getGeneratedFrameScope)(state, thread, selectedFrame && selectedFrame.id) || {
    scope: null,
    pending: false
  };

  return {
    selectedFrame,
    mapScopesEnabled: (0, _selectors.isMapScopesEnabled)(state),
    isPaused: (0, _selectors.getIsPaused)(state, thread),
    isLoading: generatedPending || originalPending,
    why: (0, _selectors.getPauseReason)(state, thread),
    originalFrameScopes,
    generatedFrameScopes
  };
};

exports.default = (0, _connect.connect)(mapStateToProps, {
  openLink: _actions2.default.openLink,
  openElementInInspector: _actions2.default.openElementInInspectorCommand,
  highlightDomElement: _actions2.default.highlightDomElement,
  unHighlightDomElement: _actions2.default.unHighlightDomElement,
  toggleMapScopes: _actions2.default.toggleMapScopes
})(Scopes);