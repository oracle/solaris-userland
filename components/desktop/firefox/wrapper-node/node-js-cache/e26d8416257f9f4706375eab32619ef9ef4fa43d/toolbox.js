"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.openLink = openLink;
exports.openSourceMap = openSourceMap;
exports.evaluateInConsole = evaluateInConsole;
exports.openElementInInspectorCommand = openElementInInspectorCommand;
exports.openInspector = openInspector;
exports.highlightDomElement = highlightDomElement;
exports.unHighlightDomElement = unHighlightDomElement;

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

/**
 * @memberof actions/toolbox
 * @static
 */
function openLink(url) {
  return async function ({
    panel
  }) {
    return panel.openLink(url);
  };
}

function openSourceMap(url, line, column) {
  return async function ({
    panel
  }) {
    return panel.toolbox.viewSource(url, line, column);
  };
}

function evaluateInConsole(inputString) {
  return async ({
    panel
  }) => {
    return panel.openConsoleAndEvaluate(inputString);
  };
}

function openElementInInspectorCommand(grip) {
  return async ({
    panel
  }) => {
    return panel.openElementInInspector(grip);
  };
}

function openInspector() {
  return async ({
    panel
  }) => {
    return panel.openInspector();
  };
}

function highlightDomElement(grip) {
  return async ({
    panel
  }) => {
    return panel.highlightDomElement(grip);
  };
}

function unHighlightDomElement(grip) {
  return async ({
    panel
  }) => {
    return panel.unHighlightDomElement(grip);
  };
}