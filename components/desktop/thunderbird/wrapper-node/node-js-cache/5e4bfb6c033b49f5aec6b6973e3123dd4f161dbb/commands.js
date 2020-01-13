"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clientCommands = exports.setupCommands = undefined;

var _create = require("./create");

var _workers = require("./workers");

var _prefs = require("../../utils/prefs");

var _devtoolsReps = require("devtools/client/shared/components/reps/reps.js");

var _devtoolsReps2 = _interopRequireDefault(_devtoolsReps);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

let workerClients;
let threadClient;
let tabTarget;
let debuggerClient;
let sourceActors;
let breakpoints;
let supportsWasm;

let shouldWaitForWorkers = false;

function setupCommands(dependencies) {
  threadClient = dependencies.threadClient;
  tabTarget = dependencies.tabTarget;
  debuggerClient = dependencies.debuggerClient;
  supportsWasm = dependencies.supportsWasm;
  workerClients = {};
  sourceActors = {};
  breakpoints = {};
}

function hasWasmSupport() {
  return supportsWasm;
}

function createObjectClient(grip) {
  return debuggerClient.createObjectClient(grip);
}

async function loadObjectProperties(root) {
  const utils = _devtoolsReps2.default.objectInspector.utils;
  const properties = await utils.loadProperties.loadItemProperties(root, createObjectClient);
  return utils.node.getChildren({
    item: root,
    loadedProperties: new Map([[root.path, properties]])
  });
}

function releaseActor(actor) {
  if (!actor) {
    return;
  }

  return debuggerClient.release(actor);
}

function sendPacket(packet) {
  return debuggerClient.request(packet);
}

function lookupThreadClient(thread) {
  if (thread == threadClient.actor) {
    return threadClient;
  }
  if (!workerClients[thread]) {
    throw new Error(`Unknown thread client: ${thread}`);
  }
  return workerClients[thread].thread;
}

function lookupConsoleClient(thread) {
  if (thread == threadClient.actor) {
    return tabTarget.activeConsole;
  }
  return workerClients[thread].console;
}

function listWorkerThreadClients() {
  return Object.values(workerClients).map(({ thread }) => thread);
}

function forEachWorkerThread(iteratee) {
  const promises = listWorkerThreadClients().map(thread => iteratee(thread));

  // Do not return promises for the caller to wait on unless a flag is set.
  // Currently, worker threads are not guaranteed to respond to all requests,
  // if we send a request while they are shutting down. See bug 1529163.
  if (shouldWaitForWorkers) {
    return Promise.all(promises);
  }
}

function resume(thread) {
  return lookupThreadClient(thread).resume();
}

function stepIn(thread) {
  return lookupThreadClient(thread).stepIn();
}

function stepOver(thread) {
  return lookupThreadClient(thread).stepOver();
}

function stepOut(thread) {
  return lookupThreadClient(thread).stepOut();
}

function rewind(thread) {
  return lookupThreadClient(thread).rewind();
}

function reverseStepOver(thread) {
  return lookupThreadClient(thread).reverseStepOver();
}

function breakOnNext(thread) {
  return lookupThreadClient(thread).breakOnNext();
}

async function sourceContents({
  actor,
  thread
}) {
  const sourceThreadClient = lookupThreadClient(thread);
  const sourceFront = sourceThreadClient.source({ actor });
  const { source, contentType } = await sourceFront.source();
  return { source, contentType };
}

function setXHRBreakpoint(path, method) {
  return threadClient.setXHRBreakpoint(path, method);
}

function removeXHRBreakpoint(path, method) {
  return threadClient.removeXHRBreakpoint(path, method);
}

// Get the string key to use for a breakpoint location.
// See also duplicate code in breakpoint-actor-map.js :(
function locationKey(location) {
  const { sourceUrl, line, column } = location;
  const sourceId = location.sourceId || "";
  return `${sourceUrl}:${sourceId}:${line}:${column}`;
}

function waitForWorkers(shouldWait) {
  shouldWaitForWorkers = shouldWait;
}

function detachWorkers() {
  for (const thread of listWorkerThreadClients()) {
    thread.detach();
  }
}

function maybeGenerateLogGroupId(options) {
  if (options.logValue && tabTarget.traits && tabTarget.traits.canRewind) {
    return { ...options, logGroupId: `logGroup-${Math.random()}` };
  }
  return options;
}

function maybeClearLogpoint(location) {
  const bp = breakpoints[locationKey(location)];
  if (bp && bp.options.logGroupId && tabTarget.activeConsole) {
    tabTarget.activeConsole.emit("clearLogpointMessages", bp.options.logGroupId);
  }
}

function hasBreakpoint(location) {
  return !!breakpoints[locationKey(location)];
}

async function setBreakpoint(location, options) {
  maybeClearLogpoint(location);
  options = maybeGenerateLogGroupId(options);
  breakpoints[locationKey(location)] = { location, options };

  // We have to be careful here to atomically initiate the setBreakpoint() call
  // on every thread, with no intervening await. Otherwise, other code could run
  // and change or remove the breakpoint before we finish calling setBreakpoint
  // on all threads. Requests on server threads will resolve in FIFO order, and
  // this could result in the breakpoint state here being out of sync with the
  // breakpoints that are installed in the server.
  const mainThreadPromise = threadClient.setBreakpoint(location, options);

  await forEachWorkerThread(thread => thread.setBreakpoint(location, options));
  await mainThreadPromise;
}

async function removeBreakpoint(location) {
  maybeClearLogpoint(location);
  delete breakpoints[locationKey(location)];

  // Delay waiting on this promise, for the same reason as in setBreakpoint.
  const mainThreadPromise = threadClient.removeBreakpoint(location);

  await forEachWorkerThread(thread => thread.removeBreakpoint(location));
  await mainThreadPromise;
}

async function evaluateInFrame(script, options) {
  return evaluate(script, options);
}

async function evaluateExpressions(scripts, options) {
  return Promise.all(scripts.map(script => evaluate(script, options)));
}

function evaluate(script, { thread, frameId } = {}) {
  const params = { thread, frameActor: frameId };
  if (!tabTarget || !script) {
    return Promise.resolve({ result: null });
  }

  const console = thread ? lookupConsoleClient(thread) : tabTarget.activeConsole;
  if (!console) {
    return Promise.resolve({ result: null });
  }

  return console.evaluateJSAsync(script, params);
}

function autocomplete(input, cursor, frameId) {
  if (!tabTarget || !tabTarget.activeConsole || !input) {
    return Promise.resolve({});
  }
  return new Promise(resolve => {
    tabTarget.activeConsole.autocomplete(input, cursor, result => resolve(result), frameId);
  });
}

function navigate(url) {
  return tabTarget.navigateTo({ url });
}

function reload() {
  return tabTarget.reload();
}

function getProperties(thread, grip) {
  const objClient = lookupThreadClient(thread).pauseGrip(grip);

  return objClient.getPrototypeAndProperties().then(resp => {
    const { ownProperties, safeGetterValues } = resp;
    for (const name in safeGetterValues) {
      const { enumerable, writable, getterValue } = safeGetterValues[name];
      ownProperties[name] = { enumerable, writable, value: getterValue };
    }
    return resp;
  });
}

async function getFrameScopes(frame) {
  if (frame.scope) {
    return frame.scope;
  }

  const sourceThreadClient = lookupThreadClient(frame.thread);
  return sourceThreadClient.getEnvironment(frame.id);
}

async function pauseOnExceptions(shouldPauseOnExceptions, shouldPauseOnCaughtExceptions) {
  await threadClient.pauseOnExceptions(shouldPauseOnExceptions,
  // Providing opposite value because server
  // uses "shouldIgnoreCaughtExceptions"
  !shouldPauseOnCaughtExceptions);

  await forEachWorkerThread(thread => thread.pauseOnExceptions(shouldPauseOnExceptions, !shouldPauseOnCaughtExceptions));
}

async function blackBox(sourceActor, isBlackBoxed, range) {
  const sourceFront = threadClient.source({ actor: sourceActor.actor });
  if (isBlackBoxed) {
    await sourceFront.unblackBox(range);
  } else {
    await sourceFront.blackBox(range);
  }
}

async function setSkipPausing(shouldSkip) {
  await threadClient.skipBreakpoints(shouldSkip);
  await forEachWorkerThread(thread => thread.skipBreakpoints(shouldSkip));
}

function interrupt(thread) {
  return lookupThreadClient(thread).interrupt();
}

function setEventListenerBreakpoints(eventTypes) {
  // TODO: Figure out what sendpoint we want to hit
}

function pauseGrip(thread, func) {
  return lookupThreadClient(thread).pauseGrip(func);
}

function registerSourceActor(sourceActorId, sourceId) {
  sourceActors[sourceActorId] = sourceId;
}

async function getSources(client) {
  const { sources } = await client.getSources();

  return sources.map(source => (0, _create.prepareSourcePayload)(client, source));
}

async function fetchSources() {
  return getSources(threadClient);
}

function getSourceForActor(actor) {
  if (!sourceActors[actor]) {
    throw new Error(`Unknown source actor: ${actor}`);
  }
  return sourceActors[actor];
}

async function fetchWorkers() {
  if (_prefs.features.windowlessWorkers) {
    const options = {
      breakpoints,
      observeAsmJS: true
    };

    const newWorkerClients = await (0, _workers.updateWorkerClients)({
      tabTarget,
      debuggerClient,
      threadClient,
      workerClients,
      options
    });

    // Fetch the sources and install breakpoints on any new workers.
    const workerNames = Object.getOwnPropertyNames(newWorkerClients);
    for (const actor of workerNames) {
      if (!workerClients[actor]) {
        const client = newWorkerClients[actor].thread;
        getSources(client);
      }
    }

    workerClients = newWorkerClients;

    return workerNames.map(actor => (0, _create.createWorker)(actor, workerClients[actor].url));
  }

  if (!(0, _workers.supportsWorkers)(tabTarget)) {
    return Promise.resolve([]);
  }

  const { workers } = await tabTarget.listWorkers();
  return workers;
}

function getMainThread() {
  return threadClient.actor;
}

async function getBreakpointPositions(actors, range) {
  const sourcePositions = {};

  for (const { thread, actor } of actors) {
    const sourceThreadClient = lookupThreadClient(thread);
    const sourceFront = sourceThreadClient.source({ actor });
    const positions = await sourceFront.getBreakpointPositionsCompressed(range);

    for (const line of Object.keys(positions)) {
      let columns = positions[line];
      const existing = sourcePositions[line];
      if (existing) {
        columns = [...new Set([...existing, ...columns])];
      }

      sourcePositions[line] = columns;
    }
  }
  return sourcePositions;
}

async function getBreakableLines(actors) {
  let lines = [];
  for (const { thread, actor } of actors) {
    const sourceThreadClient = lookupThreadClient(thread);
    const sourceFront = sourceThreadClient.source({ actor });
    let actorLines = [];
    try {
      actorLines = await sourceFront.getBreakableLines();
    } catch (e) {
      // Handle backward compatibility
      if (e.message && e.message.match(/does not recognize the packet type getBreakableLines/)) {
        const pos = await sourceFront.getBreakpointPositionsCompressed();
        actorLines = Object.keys(pos).map(line => Number(line));
      } else if (!e.message || !e.message.match(/Connection closed/)) {
        throw e;
      }
    }

    lines = [...new Set([...lines, ...actorLines])];
  }

  return lines;
}

const clientCommands = {
  autocomplete,
  blackBox,
  createObjectClient,
  loadObjectProperties,
  releaseActor,
  interrupt,
  pauseGrip,
  resume,
  stepIn,
  stepOut,
  stepOver,
  rewind,
  reverseStepOver,
  breakOnNext,
  sourceContents,
  getSourceForActor,
  getBreakpointPositions,
  getBreakableLines,
  hasBreakpoint,
  setBreakpoint,
  setXHRBreakpoint,
  removeXHRBreakpoint,
  removeBreakpoint,
  evaluate,
  evaluateInFrame,
  evaluateExpressions,
  navigate,
  reload,
  getProperties,
  getFrameScopes,
  pauseOnExceptions,
  fetchSources,
  registerSourceActor,
  fetchWorkers,
  getMainThread,
  sendPacket,
  setSkipPausing,
  setEventListenerBreakpoints,
  waitForWorkers,
  detachWorkers,
  hasWasmSupport,
  lookupConsoleClient
};

exports.setupCommands = setupCommands;
exports.clientCommands = clientCommands;