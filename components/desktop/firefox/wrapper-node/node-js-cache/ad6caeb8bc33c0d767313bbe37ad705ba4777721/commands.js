"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toggleJavaScriptEnabled = toggleJavaScriptEnabled;
exports.setupCommands = setupCommands;
exports.clientCommands = void 0;
loader.lazyRequireGetter(this, "_create", "devtools/client/debugger/src/client/firefox/create");
loader.lazyRequireGetter(this, "_index", "devtools/client/debugger/src/utils/breakpoint/index");

var objectInspector = _interopRequireWildcard(require("resource://devtools/client/shared/components/object-inspector/index.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
let commands;
let breakpoints; // The maximal number of stackframes to retrieve when pausing

const CALL_STACK_PAGE_SIZE = 1000;

function setupCommands(innerCommands) {
  commands = innerCommands;
  breakpoints = {};
}

function currentTarget() {
  return commands.targetCommand.targetFront;
}

function currentThreadFront() {
  return currentTarget().threadFront;
}
/**
 * Create an object front for the passed grip
 *
 * @param {Object} grip
 * @param {Object} frame: An optional frame that will manage the created object front.
 *                        if not passed, the current thread front will manage the object.
 * @returns {ObjectFront}
 */


function createObjectFront(grip, frame) {
  if (!grip.actor) {
    throw new Error("Actor is missing");
  }

  const threadFront = frame?.thread ? lookupThreadFront(frame.thread) : currentThreadFront();
  const frameFront = frame ? threadFront.getActorByID(frame.id) : null;
  return commands.client.createObjectFront(grip, threadFront, frameFront);
}

async function loadObjectProperties(root, threadActorID) {
  const {
    utils
  } = objectInspector;
  const properties = await utils.loadProperties.loadItemProperties(root, commands.client, undefined, threadActorID);
  return utils.node.getChildren({
    item: root,
    loadedProperties: new Map([[root.path, properties]])
  });
}

function releaseActor(actor) {
  if (!actor) {
    return Promise.resolve();
  }

  const objFront = commands.client.getFrontByID(actor);

  if (!objFront) {
    return Promise.resolve();
  }

  return objFront.release().catch(() => {});
}

function lookupTarget(thread) {
  if (thread == currentThreadFront().actor) {
    return currentTarget();
  }

  const targets = commands.targetCommand.getAllTargets(commands.targetCommand.ALL_TYPES);
  return targets.find(target => target.targetForm.threadActor == thread);
}

function lookupThreadFront(thread) {
  const target = lookupTarget(thread);
  return target.threadFront;
}

function listThreadFronts() {
  const targets = commands.targetCommand.getAllTargets(commands.targetCommand.ALL_TYPES);
  return targets.map(target => target.threadFront).filter(front => !!front);
}

function forEachThread(iteratee) {
  // We have to be careful here to atomically initiate the operation on every
  // thread, with no intervening await. Otherwise, other code could run and
  // trigger additional thread operations. Requests on server threads will
  // resolve in FIFO order, and this could result in client and server state
  // going out of sync.
  const promises = listThreadFronts().map( // If a thread shuts down while sending the message then it will
  // throw. Ignore these exceptions.
  t => iteratee(t).catch(e => console.log(e)));
  return Promise.all(promises);
}

function resume(thread) {
  return lookupThreadFront(thread).resume();
}

function stepIn(thread, frameId) {
  return lookupThreadFront(thread).stepIn(frameId);
}

function stepOver(thread, frameId) {
  return lookupThreadFront(thread).stepOver(frameId);
}

function stepOut(thread, frameId) {
  return lookupThreadFront(thread).stepOut(frameId);
}

function restart(thread, frameId) {
  return lookupThreadFront(thread).restart(frameId);
}

function breakOnNext(thread) {
  return lookupThreadFront(thread).breakOnNext();
}

async function sourceContents({
  actor,
  thread
}) {
  const sourceThreadFront = lookupThreadFront(thread);
  const sourceFront = sourceThreadFront.source({
    actor
  });
  const {
    source,
    contentType
  } = await sourceFront.source();
  return {
    source,
    contentType
  };
}

async function setXHRBreakpoint(path, method) {
  const hasWatcherSupport = commands.targetCommand.hasTargetWatcherSupport();

  if (!hasWatcherSupport) {
    // Without watcher support, forward setXHRBreakpoint to all threads.
    await forEachThread(thread => thread.setXHRBreakpoint(path, method));
    return;
  }

  const breakpointsFront = await commands.targetCommand.watcherFront.getBreakpointListActor();
  await breakpointsFront.setXHRBreakpoint(path, method);
}

async function removeXHRBreakpoint(path, method) {
  const hasWatcherSupport = commands.targetCommand.hasTargetWatcherSupport();

  if (!hasWatcherSupport) {
    // Without watcher support, forward removeXHRBreakpoint to all threads.
    await forEachThread(thread => thread.removeXHRBreakpoint(path, method));
    return;
  }

  const breakpointsFront = await commands.targetCommand.watcherFront.getBreakpointListActor();
  await breakpointsFront.removeXHRBreakpoint(path, method);
}

function toggleJavaScriptEnabled(enabled) {
  return commands.targetConfigurationCommand.updateConfiguration({
    javascriptEnabled: enabled
  });
}

async function addWatchpoint(object, property, label, watchpointType) {
  if (!currentTarget().getTrait("watchpoints")) {
    return;
  }

  const objectFront = createObjectFront(object);
  await objectFront.addWatchpoint(property, label, watchpointType);
}

async function removeWatchpoint(object, property) {
  if (!currentTarget().getTrait("watchpoints")) {
    return;
  }

  const objectFront = createObjectFront(object);
  await objectFront.removeWatchpoint(property);
}

function hasBreakpoint(location) {
  return !!breakpoints[(0, _index.makeBreakpointServerLocationId)(location)];
}

function getServerBreakpointsList() {
  return Object.values(breakpoints);
}

async function setBreakpoint(location, options) {
  const breakpoint = breakpoints[(0, _index.makeBreakpointServerLocationId)(location)];

  if (breakpoint && JSON.stringify(breakpoint.options) == JSON.stringify(options)) {
    return null;
  }

  breakpoints[(0, _index.makeBreakpointServerLocationId)(location)] = {
    location,
    options
  }; // Map frontend options to a more restricted subset of what
  // the server supports. For example frontend uses `hidden` attribute
  // which isn't meant to be passed to the server.
  // (note that protocol.js specification isn't enough to filter attributes,
  //  all primitive attributes will be passed as-is)

  const serverOptions = {
    condition: options.condition,
    logValue: options.logValue
  };
  const hasWatcherSupport = commands.targetCommand.hasTargetWatcherSupport();

  if (!hasWatcherSupport) {
    // Without watcher support, unconditionally forward setBreakpoint to all threads.
    return forEachThread(async thread => thread.setBreakpoint(location, serverOptions));
  }

  const breakpointsFront = await commands.targetCommand.watcherFront.getBreakpointListActor();
  await breakpointsFront.setBreakpoint(location, serverOptions); // Call setBreakpoint for threads linked to targets
  // not managed by the watcher.

  return forEachThread(async thread => {
    if (!commands.targetCommand.hasTargetWatcherSupport(thread.targetFront.targetType)) {
      return thread.setBreakpoint(location, serverOptions);
    }

    return Promise.resolve();
  });
}

async function removeBreakpoint(location) {
  delete breakpoints[(0, _index.makeBreakpointServerLocationId)(location)];
  const hasWatcherSupport = commands.targetCommand.hasTargetWatcherSupport();

  if (!hasWatcherSupport) {
    // Without watcher support, unconditionally forward removeBreakpoint to all threads.
    return forEachThread(async thread => thread.removeBreakpoint(location));
  }

  const breakpointsFront = await commands.targetCommand.watcherFront.getBreakpointListActor();
  await breakpointsFront.removeBreakpoint(location); // Call removeBreakpoint for threads linked to targets
  // not managed by the watcher.

  return forEachThread(async thread => {
    if (!commands.targetCommand.hasTargetWatcherSupport(thread.targetFront.targetType)) {
      return thread.removeBreakpoint(location);
    }

    return Promise.resolve();
  });
}

async function evaluateExpressions(expressions, options) {
  return Promise.all(expressions.map(expression => evaluate(expression, options)));
}
/**
 * Evaluate some JS expression in a given thread.
 *
 * @param {String} expression
 * @param {Object} options
 * @param {String} options.frameId
 *                 Optional frame actor ID into which the expression should be evaluated.
 * @param {String} options.threadId
 *                 Optional thread actor ID into which the expression should be evaluated.
 * @param {String} options.selectedNodeActor
 *                 Optional node actor ID which related to "$0" in the evaluated expression.
 * @param {Boolean} options.evalInTracer
 *                 To be set to true, if the object actors created during the evaluation
 *                 should be registered in the tracer actor Pool.
 * @return {Object}
 *                 See ScriptCommand.execute JS Doc.
 */


async function evaluate(expression, {
  frameId,
  threadId,
  selectedNodeActor,
  evalInTracer
} = {}) {
  if (!currentTarget() || !expression) {
    return {
      result: null
    };
  }

  const selectedTargetFront = threadId ? lookupTarget(threadId) : null;
  return commands.scriptCommand.execute(expression, {
    frameActor: frameId,
    selectedTargetFront,
    disableBreaks: true,
    selectedNodeActor,
    evalInTracer
  });
}

async function autocomplete(input, cursor, frameId) {
  if (!currentTarget() || !input) {
    return {};
  }

  const consoleFront = await currentTarget().getFront("console");

  if (!consoleFront) {
    return {};
  }

  return new Promise(resolve => {
    consoleFront.autocomplete(input, cursor, result => resolve(result), frameId);
  });
}

async function getFrames(thread) {
  const threadFront = lookupThreadFront(thread);
  const response = await threadFront.getFrames(0, CALL_STACK_PAGE_SIZE);
  return Promise.all(response.frames.map((frame, i) => (0, _create.createFrame)(thread, frame, i)));
}

async function getFrameScopes(frame) {
  const frameFront = lookupThreadFront(frame.thread).getActorByID(frame.id);
  return frameFront.getEnvironment();
}

async function pauseOnDebuggerStatement(shouldPauseOnDebuggerStatement) {
  await commands.threadConfigurationCommand.updateConfiguration({
    shouldPauseOnDebuggerStatement
  });
}

async function pauseOnExceptions(shouldPauseOnExceptions, shouldPauseOnCaughtExceptions) {
  await commands.threadConfigurationCommand.updateConfiguration({
    pauseOnExceptions: shouldPauseOnExceptions,
    ignoreCaughtExceptions: !shouldPauseOnCaughtExceptions
  });
}

async function blackBox(sourceActor, shouldBlackBox, ranges) {
  const hasWatcherSupport = commands.targetCommand.hasTargetWatcherSupport();

  if (hasWatcherSupport) {
    const blackboxingFront = await commands.targetCommand.watcherFront.getBlackboxingActor();

    if (shouldBlackBox) {
      await blackboxingFront.blackbox(sourceActor.url, ranges);
    } else {
      await blackboxingFront.unblackbox(sourceActor.url, ranges);
    }
  } else {
    const sourceFront = currentThreadFront().source({
      actor: sourceActor.actor
    }); // If there are no ranges, the whole source is being blackboxed

    if (!ranges.length) {
      await toggleBlackBoxSourceFront(sourceFront, shouldBlackBox);
      return;
    } // Blackbox the specific ranges


    for (const range of ranges) {
      await toggleBlackBoxSourceFront(sourceFront, shouldBlackBox, range);
    }
  }
}

async function toggleBlackBoxSourceFront(sourceFront, shouldBlackBox, range) {
  if (shouldBlackBox) {
    await sourceFront.blackBox(range);
  } else {
    await sourceFront.unblackBox(range);
  }
}

async function setSkipPausing(shouldSkip) {
  await commands.threadConfigurationCommand.updateConfiguration({
    skipBreakpoints: shouldSkip
  });
}

async function setEventListenerBreakpoints(ids) {
  const hasWatcherSupport = commands.targetCommand.hasTargetWatcherSupport();

  if (!hasWatcherSupport) {
    await forEachThread(thread => thread.setActiveEventBreakpoints(ids));
    return;
  }

  const breakpointListFront = await commands.targetCommand.watcherFront.getBreakpointListActor();
  await breakpointListFront.setActiveEventBreakpoints(ids);
}

async function getEventListenerBreakpointTypes() {
  return currentThreadFront().getAvailableEventBreakpoints();
}

async function toggleEventLogging(logEventBreakpoints) {
  await commands.threadConfigurationCommand.updateConfiguration({
    logEventBreakpoints
  });
}

function getMainThread() {
  return currentThreadFront().actor;
}

async function getSourceActorBreakpointPositions({
  thread,
  actor
}, range) {
  const sourceThreadFront = lookupThreadFront(thread);
  const sourceFront = sourceThreadFront.source({
    actor
  });
  return sourceFront.getBreakpointPositionsCompressed(range);
}

async function getSourceActorBreakableLines({
  thread,
  actor
}) {
  let actorLines = [];

  try {
    const sourceThreadFront = lookupThreadFront(thread);
    const sourceFront = sourceThreadFront.source({
      actor
    });
    actorLines = await sourceFront.getBreakableLines();
  } catch (e) {
    // Exceptions could be due to the target thread being shut down.
    console.warn(`getSourceActorBreakableLines failed: ${e}`);
  }

  return actorLines;
}

function getFrontByID(actorID) {
  return commands.client.getFrontByID(actorID);
}

function fetchAncestorFramePositions(index) {
  currentThreadFront().fetchAncestorFramePositions(index);
}

const clientCommands = {
  autocomplete,
  blackBox,
  createObjectFront,
  loadObjectProperties,
  releaseActor,
  resume,
  stepIn,
  stepOut,
  stepOver,
  restart,
  breakOnNext,
  sourceContents,
  getSourceActorBreakpointPositions,
  getSourceActorBreakableLines,
  hasBreakpoint,
  getServerBreakpointsList,
  setBreakpoint,
  setXHRBreakpoint,
  removeXHRBreakpoint,
  addWatchpoint,
  removeWatchpoint,
  removeBreakpoint,
  evaluate,
  evaluateExpressions,
  getFrameScopes,
  getFrames,
  pauseOnDebuggerStatement,
  pauseOnExceptions,
  toggleEventLogging,
  getMainThread,
  setSkipPausing,
  setEventListenerBreakpoints,
  getEventListenerBreakpointTypes,
  getFrontByID,
  fetchAncestorFramePositions,
  toggleJavaScriptEnabled
};
exports.clientCommands = clientCommands;