"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.openLink = openLink;
exports.openWorkerToolbox = openWorkerToolbox;
exports.evaluateInConsole = evaluateInConsole;
exports.openElementInInspectorCommand = openElementInInspectorCommand;
exports.highlightDomElement = highlightDomElement;
exports.unHighlightDomElement = unHighlightDomElement;


/**
 * @memberof actions/toolbox
 * @static
 */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

function openLink(url) {
  return async function ({ panel }) {
    return panel.openLink(url);
  };
}

function openWorkerToolbox(worker) {
  return async function ({ getState, panel }) {
    return panel.openWorkerToolbox(worker);
  };
}

function evaluateInConsole(inputString) {
  return async ({ panel }) => {
    return panel.openConsoleAndEvaluate(inputString);
  };
}

function openElementInInspectorCommand(grip) {
  return async ({ panel }) => {
    return panel.openElementInInspector(grip);
  };
}

function highlightDomElement(grip) {
  return async ({ panel }) => {
    return panel.highlightDomElement(grip);
  };
}

function unHighlightDomElement(grip) {
  return async ({ panel }) => {
    return panel.unHighlightDomElement(grip);
  };
}