"use strict";

require("core-js/modules/es.symbol.js");

require("core-js/modules/es.symbol.description.js");

require("core-js/modules/es.symbol.iterator.js");

require("core-js/modules/es.symbol.to-primitive.js");

require("core-js/modules/es.date.to-primitive.js");

require("core-js/modules/es.number.constructor.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Instrumenter = exports.EVENTS = void 0;
exports.instrument = instrument;

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.array.iterator.js");

require("core-js/modules/es.map.js");

require("core-js/modules/es.string.iterator.js");

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.set.js");

require("core-js/modules/es.array.filter.js");

require("core-js/modules/es.array.from.js");

require("core-js/modules/es.object.assign.js");

require("core-js/modules/es.array.map.js");

require("core-js/modules/es.array.find-index.js");

require("core-js/modules/es.array.slice.js");

require("core-js/modules/es.array.find.js");

require("core-js/modules/es.object.values.js");

require("core-js/modules/web.dom-collections.for-each.js");

require("core-js/modules/es.object.entries.js");

require("core-js/modules/es.object.keys.js");

require("core-js/modules/es.array.concat.js");

require("core-js/modules/es.promise.js");

require("core-js/modules/es.function.name.js");

require("core-js/modules/es.array.includes.js");

require("core-js/modules/es.array.sort.js");

require("core-js/modules/es.string.includes.js");

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.string.search.js");

var _addons = require("@storybook/addons");

var _clientLogger = require("@storybook/client-logger");

var _coreEvents = require("@storybook/core-events");

var _global = _interopRequireDefault(require("global"));

var _types = require("./types");

var _global$FEATURES;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }

function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var EVENTS = {
  CALL: 'instrumenter/call',
  SYNC: 'instrumenter/sync',
  START: 'instrumenter/start',
  BACK: 'instrumenter/back',
  GOTO: 'instrumenter/goto',
  NEXT: 'instrumenter/next',
  END: 'instrumenter/end'
};
exports.EVENTS = EVENTS;
var debuggerDisabled = ((_global$FEATURES = _global.default.FEATURES) === null || _global$FEATURES === void 0 ? void 0 : _global$FEATURES.interactionsDebugger) !== true;
var controlsDisabled = {
  debugger: !debuggerDisabled,
  start: false,
  back: false,
  goto: false,
  next: false,
  end: false
};
var alreadyCompletedException = new Error("This function ran after the play function completed. Did you forget to `await` it?");

var isObject = function isObject(o) {
  return Object.prototype.toString.call(o) === '[object Object]';
};

var isModule = function isModule(o) {
  return Object.prototype.toString.call(o) === '[object Module]';
};

var isInstrumentable = function isInstrumentable(o) {
  if (!isObject(o) && !isModule(o)) return false;
  if (o.constructor === undefined) return true;
  var proto = o.constructor.prototype;
  if (!isObject(proto)) return false;
  if (Object.prototype.hasOwnProperty.call(proto, 'isPrototypeOf') === false) return false;
  return true;
};

var construct = function construct(obj) {
  try {
    return new obj.constructor();
  } catch (e) {
    return {};
  }
};

var getInitialState = function getInitialState() {
  return {
    renderPhase: undefined,
    isDebugging: false,
    isPlaying: false,
    isLocked: false,
    cursor: 0,
    calls: [],
    shadowCalls: [],
    callRefsByResult: new Map(),
    chainedCallIds: new Set(),
    parentId: undefined,
    playUntil: undefined,
    resolvers: {},
    syncTimeout: undefined,
    forwardedException: undefined
  };
};

var getRetainedState = function getRetainedState(state) {
  var isDebugging = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var calls = (isDebugging ? state.shadowCalls : state.calls).filter(function (call) {
    return call.retain;
  });
  if (!calls.length) return undefined;
  var callRefsByResult = new Map(Array.from(state.callRefsByResult.entries()).filter(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        ref = _ref2[1];

    return ref.retain;
  }));
  return {
    cursor: calls.length,
    calls: calls,
    callRefsByResult: callRefsByResult
  };
};
/**
 * This class is not supposed to be used directly. Use the `instrument` function below instead.
 */


var Instrumenter = /*#__PURE__*/function () {
  // State is tracked per story to deal with multiple stories on the same canvas (i.e. docs mode)
  function Instrumenter() {
    var _this = this;

    _classCallCheck(this, Instrumenter);

    this.channel = void 0;
    this.initialized = false;
    this.state = void 0;
    this.channel = _addons.addons.getChannel(); // Restore state from the parent window in case the iframe was reloaded.

    this.state = _global.default.window.parent.__STORYBOOK_ADDON_INTERACTIONS_INSTRUMENTER_STATE__ || {}; // When called from `start`, isDebugging will be true

    var resetState = function resetState(_ref3) {
      var storyId = _ref3.storyId,
          _ref3$isPlaying = _ref3.isPlaying,
          isPlaying = _ref3$isPlaying === void 0 ? true : _ref3$isPlaying,
          _ref3$isDebugging = _ref3.isDebugging,
          isDebugging = _ref3$isDebugging === void 0 ? false : _ref3$isDebugging;

      var state = _this.getState(storyId);

      _this.setState(storyId, Object.assign({}, getInitialState(), getRetainedState(state, isDebugging), {
        shadowCalls: isDebugging ? state.shadowCalls : [],
        chainedCallIds: isDebugging ? state.chainedCallIds : new Set(),
        playUntil: isDebugging ? state.playUntil : undefined,
        isPlaying: isPlaying,
        isDebugging: isDebugging
      })); // Don't sync while debugging, as it'll cause flicker.


      if (!isDebugging) _this.sync(storyId);
    }; // A forceRemount might be triggered for debugging (on `start`), or elsewhere in Storybook.


    this.channel.on(_coreEvents.FORCE_REMOUNT, resetState); // Start with a clean slate before playing after a remount, and stop debugging when done.

    this.channel.on(_coreEvents.STORY_RENDER_PHASE_CHANGED, function (_ref4) {
      var storyId = _ref4.storyId,
          newPhase = _ref4.newPhase;

      var _this$getState = _this.getState(storyId),
          isDebugging = _this$getState.isDebugging,
          forwardedException = _this$getState.forwardedException;

      _this.setState(storyId, {
        renderPhase: newPhase
      });

      if (newPhase === 'playing') {
        resetState({
          storyId: storyId,
          isDebugging: isDebugging
        });
      }

      if (newPhase === 'played') {
        _this.setState(storyId, {
          isLocked: false,
          isPlaying: false,
          isDebugging: false,
          forwardedException: undefined
        }); // Rethrow any unhandled forwarded exception so it doesn't go unnoticed.


        if (forwardedException) throw forwardedException;
      }
    }); // Trash non-retained state and clear the log when switching stories, but not on initial boot.

    this.channel.on(_coreEvents.SET_CURRENT_STORY, function () {
      if (_this.initialized) _this.cleanup();else _this.initialized = true;
    });

    var start = function start(_ref5) {
      var storyId = _ref5.storyId,
          playUntil = _ref5.playUntil;

      if (!_this.getState(storyId).isDebugging) {
        _this.setState(storyId, function (_ref6) {
          var calls = _ref6.calls;
          return {
            calls: [],
            shadowCalls: calls.map(function (call) {
              return Object.assign({}, call, {
                status: _types.CallStates.WAITING
              });
            }),
            isDebugging: true
          };
        });
      }

      var log = _this.getLog(storyId);

      _this.setState(storyId, function (_ref7) {
        var _shadowCalls$slice$fi;

        var shadowCalls = _ref7.shadowCalls;
        var firstRowIndex = shadowCalls.findIndex(function (call) {
          return call.id === log[0].callId;
        });
        return {
          playUntil: playUntil || ((_shadowCalls$slice$fi = shadowCalls.slice(0, firstRowIndex).filter(function (call) {
            return call.interceptable;
          }).slice(-1)[0]) === null || _shadowCalls$slice$fi === void 0 ? void 0 : _shadowCalls$slice$fi.id)
        };
      }); // Force remount may trigger a page reload if the play function can't be aborted.


      _this.channel.emit(_coreEvents.FORCE_REMOUNT, {
        storyId: storyId,
        isDebugging: true
      });
    };

    var back = function back(_ref8) {
      var _log;

      var storyId = _ref8.storyId;

      var _this$getState2 = _this.getState(storyId),
          isDebugging = _this$getState2.isDebugging;

      var log = _this.getLog(storyId);

      var next = isDebugging ? log.findIndex(function (_ref9) {
        var status = _ref9.status;
        return status === _types.CallStates.WAITING;
      }) : log.length;
      start({
        storyId: storyId,
        playUntil: (_log = log[next - 2]) === null || _log === void 0 ? void 0 : _log.callId
      });
    };

    var goto = function goto(_ref10) {
      var storyId = _ref10.storyId,
          callId = _ref10.callId;

      var _this$getState3 = _this.getState(storyId),
          calls = _this$getState3.calls,
          shadowCalls = _this$getState3.shadowCalls,
          resolvers = _this$getState3.resolvers;

      var call = calls.find(function (_ref11) {
        var id = _ref11.id;
        return id === callId;
      });
      var shadowCall = shadowCalls.find(function (_ref12) {
        var id = _ref12.id;
        return id === callId;
      });

      if (!call && shadowCall && Object.values(resolvers).length > 0) {
        var _this$getLog$find;

        var nextId = (_this$getLog$find = _this.getLog(storyId).find(function (c) {
          return c.status === _types.CallStates.WAITING;
        })) === null || _this$getLog$find === void 0 ? void 0 : _this$getLog$find.callId;
        if (shadowCall.id !== nextId) _this.setState(storyId, {
          playUntil: shadowCall.id
        });
        Object.values(resolvers).forEach(function (resolve) {
          return resolve();
        });
      } else {
        start({
          storyId: storyId,
          playUntil: callId
        });
      }
    };

    var next = function next(_ref13) {
      var storyId = _ref13.storyId;

      var _this$getState4 = _this.getState(storyId),
          resolvers = _this$getState4.resolvers;

      if (Object.values(resolvers).length > 0) {
        Object.values(resolvers).forEach(function (resolve) {
          return resolve();
        });
      } else {
        var _this$getLog$find2;

        var nextId = (_this$getLog$find2 = _this.getLog(storyId).find(function (c) {
          return c.status === _types.CallStates.WAITING;
        })) === null || _this$getLog$find2 === void 0 ? void 0 : _this$getLog$find2.callId;
        if (nextId) start({
          storyId: storyId,
          playUntil: nextId
        });else end({
          storyId: storyId
        });
      }
    };

    var end = function end(_ref14) {
      var storyId = _ref14.storyId;

      _this.setState(storyId, {
        playUntil: undefined,
        isDebugging: false
      });

      Object.values(_this.getState(storyId).resolvers).forEach(function (resolve) {
        return resolve();
      });
    };

    this.channel.on(EVENTS.START, start);
    this.channel.on(EVENTS.BACK, back);
    this.channel.on(EVENTS.GOTO, goto);
    this.channel.on(EVENTS.NEXT, next);
    this.channel.on(EVENTS.END, end);
  }

  _createClass(Instrumenter, [{
    key: "getState",
    value: function getState(storyId) {
      return this.state[storyId] || getInitialState();
    }
  }, {
    key: "setState",
    value: function setState(storyId, update) {
      var state = this.getState(storyId);
      var patch = typeof update === 'function' ? update(state) : update;
      this.state = Object.assign({}, this.state, _defineProperty({}, storyId, Object.assign({}, state, patch))); // Track state on the parent window so we can reload the iframe without losing state.

      _global.default.window.parent.__STORYBOOK_ADDON_INTERACTIONS_INSTRUMENTER_STATE__ = this.state;
    }
  }, {
    key: "cleanup",
    value: function cleanup() {
      // Reset stories with retained state to their initial state, and drop the rest.
      this.state = Object.entries(this.state).reduce(function (acc, _ref15) {
        var _ref16 = _slicedToArray(_ref15, 2),
            storyId = _ref16[0],
            state = _ref16[1];

        var retainedState = getRetainedState(state);
        if (!retainedState) return acc;
        acc[storyId] = Object.assign(getInitialState(), retainedState);
        return acc;
      }, {});
      this.channel.emit(EVENTS.SYNC, {
        controlStates: controlsDisabled,
        logItems: []
      });
      _global.default.window.parent.__STORYBOOK_ADDON_INTERACTIONS_INSTRUMENTER_STATE__ = this.state;
    }
  }, {
    key: "getLog",
    value: function getLog(storyId) {
      var _this$getState5 = this.getState(storyId),
          calls = _this$getState5.calls,
          shadowCalls = _this$getState5.shadowCalls;

      var merged = _toConsumableArray(shadowCalls);

      calls.forEach(function (call, index) {
        merged[index] = call;
      });
      var seen = new Set();
      return merged.reduceRight(function (acc, call) {
        call.args.forEach(function (arg) {
          if (arg !== null && arg !== void 0 && arg.__callId__) {
            seen.add(arg.__callId__);
          }
        });
        call.path.forEach(function (node) {
          if (node.__callId__) {
            seen.add(node.__callId__);
          }
        });

        if (call.interceptable && !seen.has(call.id)) {
          acc.unshift({
            callId: call.id,
            status: call.status
          });
          seen.add(call.id);
        }

        return acc;
      }, []);
    } // Traverses the object structure to recursively patch all function properties.
    // Returns the original object, or a new object with the same constructor,
    // depending on whether it should mutate.

  }, {
    key: "instrument",
    value: function instrument(obj, options) {
      var _this2 = this;

      if (!isInstrumentable(obj)) return obj;
      var _options$mutate = options.mutate,
          mutate = _options$mutate === void 0 ? false : _options$mutate,
          _options$path = options.path,
          path = _options$path === void 0 ? [] : _options$path;
      return Object.keys(obj).reduce(function (acc, key) {
        var value = obj[key]; // Nothing to patch, but might be instrumentable, so we recurse

        if (typeof value !== 'function') {
          acc[key] = _this2.instrument(value, Object.assign({}, options, {
            path: path.concat(key)
          }));
          return acc;
        } // Already patched, so we pass through unchanged


        if (typeof value.__originalFn__ === 'function') {
          acc[key] = value;
          return acc;
        } // Patch the function and mark it "patched" by adding a reference to the original function


        acc[key] = function () {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          return _this2.track(key, value, args, options);
        };

        acc[key].__originalFn__ = value; // Reuse the original name as the patched function's name

        Object.defineProperty(acc[key], 'name', {
          value: key,
          writable: false
        }); // Deal with functions that also act like an object

        if (Object.keys(value).length > 0) {
          Object.assign(acc[key], _this2.instrument(Object.assign({}, value), Object.assign({}, options, {
            path: path.concat(key)
          })));
        }

        return acc;
      }, mutate ? obj : construct(obj));
    } // Monkey patch an object method to record calls.
    // Returns a function that invokes the original function, records the invocation ("call") and
    // returns the original result.

  }, {
    key: "track",
    value: function track(method, fn, args, options) {
      var _args$, _global$window$__STOR, _global$window$__STOR2, _global$window$__STOR3;

      var storyId = (args === null || args === void 0 ? void 0 : (_args$ = args[0]) === null || _args$ === void 0 ? void 0 : _args$.__storyId__) || ((_global$window$__STOR = _global.default.window.__STORYBOOK_PREVIEW__) === null || _global$window$__STOR === void 0 ? void 0 : (_global$window$__STOR2 = _global$window$__STOR.urlStore) === null || _global$window$__STOR2 === void 0 ? void 0 : (_global$window$__STOR3 = _global$window$__STOR2.selection) === null || _global$window$__STOR3 === void 0 ? void 0 : _global$window$__STOR3.storyId);

      var _this$getState6 = this.getState(storyId),
          cursor = _this$getState6.cursor,
          parentId = _this$getState6.parentId;

      this.setState(storyId, {
        cursor: cursor + 1
      });
      var id = "".concat(parentId || storyId, " [").concat(cursor, "] ").concat(method);
      var _options$path2 = options.path,
          path = _options$path2 === void 0 ? [] : _options$path2,
          _options$intercept = options.intercept,
          intercept = _options$intercept === void 0 ? false : _options$intercept,
          _options$retain = options.retain,
          retain = _options$retain === void 0 ? false : _options$retain;
      var interceptable = typeof intercept === 'function' ? intercept(method, path) : intercept;
      var call = {
        id: id,
        parentId: parentId,
        storyId: storyId,
        cursor: cursor,
        path: path,
        method: method,
        args: args,
        interceptable: interceptable,
        retain: retain
      };
      var result = (interceptable ? this.intercept : this.invoke).call(this, fn, call, options);
      return this.instrument(result, Object.assign({}, options, {
        mutate: true,
        path: [{
          __callId__: call.id
        }]
      }));
    }
  }, {
    key: "intercept",
    value: function intercept(fn, call, options) {
      var _this3 = this;

      var _this$getState7 = this.getState(call.storyId),
          chainedCallIds = _this$getState7.chainedCallIds,
          isDebugging = _this$getState7.isDebugging,
          playUntil = _this$getState7.playUntil; // For a "jump to step" action, continue playing until we hit a call by that ID.
      // For chained calls, we can only return a Promise for the last call in the chain.


      var isChainedUpon = chainedCallIds.has(call.id);

      if (!isDebugging || isChainedUpon || playUntil) {
        if (playUntil === call.id) {
          this.setState(call.storyId, {
            playUntil: undefined
          });
        }

        return this.invoke(fn, call, options);
      } // Instead of invoking the function, defer the function call until we continue playing.


      return new Promise(function (resolve) {
        _this3.setState(call.storyId, function (_ref17) {
          var resolvers = _ref17.resolvers;
          return {
            isLocked: false,
            resolvers: Object.assign({}, resolvers, _defineProperty({}, call.id, resolve))
          };
        });
      }).then(function () {
        _this3.setState(call.storyId, function (state) {
          var _state$resolvers = state.resolvers,
              _call$id = call.id,
              _ = _state$resolvers[_call$id],
              resolvers = _objectWithoutProperties(_state$resolvers, [_call$id].map(_toPropertyKey));

          return {
            isLocked: true,
            resolvers: resolvers
          };
        });

        return _this3.invoke(fn, call, options);
      });
    }
  }, {
    key: "invoke",
    value: function invoke(fn, call, options) {
      var _this4 = this;

      // TODO this doesnt work because the abortSignal we have here is the newly created one
      // const { abortSignal } = global.window.__STORYBOOK_PREVIEW__ || {};
      // if (abortSignal && abortSignal.aborted) throw IGNORED_EXCEPTION;
      var _this$getState8 = this.getState(call.storyId),
          callRefsByResult = _this$getState8.callRefsByResult,
          forwardedException = _this$getState8.forwardedException,
          renderPhase = _this$getState8.renderPhase;

      var info = Object.assign({}, call, {
        // Map args that originate from a tracked function call to a call reference to enable nesting.
        // These values are often not fully serializable anyway (e.g. HTML elements).
        args: call.args.map(function (arg) {
          if (callRefsByResult.has(arg)) {
            return callRefsByResult.get(arg);
          }

          if (arg instanceof _global.default.window.HTMLElement) {
            var prefix = arg.prefix,
                localName = arg.localName,
                id = arg.id,
                classList = arg.classList,
                innerText = arg.innerText;
            var classNames = Array.from(classList);
            return {
              __element__: {
                prefix: prefix,
                localName: localName,
                id: id,
                classNames: classNames,
                innerText: innerText
              }
            };
          }

          return arg;
        })
      }); // Mark any ancestor calls as "chained upon" so we won't attempt to defer it later.

      call.path.forEach(function (ref) {
        if (ref !== null && ref !== void 0 && ref.__callId__) {
          _this4.setState(call.storyId, function (_ref18) {
            var chainedCallIds = _ref18.chainedCallIds;
            return {
              chainedCallIds: new Set(Array.from(chainedCallIds).concat(ref.__callId__))
            };
          });
        }
      });

      var handleException = function handleException(e) {
        if (e instanceof Error) {
          var name = e.name,
              message = e.message,
              stack = e.stack;
          var exception = {
            name: name,
            message: message,
            stack: stack
          };

          _this4.update(Object.assign({}, info, {
            status: _types.CallStates.ERROR,
            exception: exception
          })); // Always track errors to their originating call.


          _this4.setState(call.storyId, function (state) {
            return {
              callRefsByResult: new Map([].concat(_toConsumableArray(Array.from(state.callRefsByResult.entries())), [[e, {
                __callId__: call.id,
                retain: call.retain
              }]]))
            };
          }); // We need to throw to break out of the play function, but we don't want to trigger a redbox
          // so we throw an ignoredException, which is caught and silently ignored by Storybook.


          if (call.interceptable && e !== alreadyCompletedException) {
            throw _coreEvents.IGNORED_EXCEPTION;
          } // Non-interceptable calls need their exceptions forwarded to the next interceptable call.
          // In case no interceptable call picks it up, it'll get rethrown in the "completed" phase.


          _this4.setState(call.storyId, {
            forwardedException: e
          });

          return e;
        }

        throw e;
      };

      try {
        // An earlier, non-interceptable call might have forwarded an exception.
        if (forwardedException) {
          this.setState(call.storyId, {
            forwardedException: undefined
          });
          throw forwardedException;
        }

        if (renderPhase === 'played' && !call.retain) {
          throw alreadyCompletedException;
        }

        var finalArgs = options.getArgs ? options.getArgs(call, this.getState(call.storyId)) : call.args;
        var result = fn.apply(void 0, _toConsumableArray(finalArgs.map(function (arg) {
          if (typeof arg !== 'function' || Object.keys(arg).length) return arg;
          return function () {
            var _this4$getState = _this4.getState(call.storyId),
                cursor = _this4$getState.cursor,
                parentId = _this4$getState.parentId;

            _this4.setState(call.storyId, {
              cursor: 0,
              parentId: call.id
            });

            var restore = function restore() {
              return _this4.setState(call.storyId, {
                cursor: cursor,
                parentId: parentId
              });
            };

            var res = arg.apply(void 0, arguments);
            if (res instanceof Promise) res.then(restore, restore);else restore();
            return res;
          };
        }))); // Track the result so we can trace later uses of it back to the originating call.
        // Primitive results (undefined, null, boolean, string, number, BigInt) are ignored.

        if (result && ['object', 'function', 'symbol'].includes(_typeof(result))) {
          this.setState(call.storyId, function (state) {
            return {
              callRefsByResult: new Map([].concat(_toConsumableArray(Array.from(state.callRefsByResult.entries())), [[result, {
                __callId__: call.id,
                retain: call.retain
              }]]))
            };
          });
        }

        this.update(Object.assign({}, info, {
          status: result instanceof Promise ? _types.CallStates.ACTIVE : _types.CallStates.DONE
        }));

        if (result instanceof Promise) {
          return result.then(function (value) {
            _this4.update(Object.assign({}, info, {
              status: _types.CallStates.DONE
            }));

            return value;
          }, handleException);
        }

        return result;
      } catch (e) {
        return handleException(e);
      }
    } // Sends the call info and log to the manager.
    // Uses a 0ms debounce because this might get called many times in one tick.

  }, {
    key: "update",
    value: function update(call) {
      var _this5 = this;

      clearTimeout(this.getState(call.storyId).syncTimeout);
      this.channel.emit(EVENTS.CALL, call);
      this.setState(call.storyId, function (_ref19) {
        var calls = _ref19.calls;
        // Omit earlier calls for the same ID, which may have been superceded by a later invocation.
        // This typically happens when calls are part of a callback which runs multiple times.
        var callsById = calls.concat(call).reduce(function (a, c) {
          return Object.assign(a, _defineProperty({}, c.id, c));
        }, {});
        return {
          // Calls are sorted to ensure parent calls always come before calls in their callback.
          calls: Object.values(callsById).sort(function (a, b) {
            return a.id.localeCompare(b.id, undefined, {
              numeric: true
            });
          }),
          syncTimeout: setTimeout(function () {
            return _this5.sync(call.storyId);
          }, 0)
        };
      });
    }
  }, {
    key: "sync",
    value: function sync(storyId) {
      var _this$getState9 = this.getState(storyId),
          isLocked = _this$getState9.isLocked,
          isPlaying = _this$getState9.isPlaying;

      var logItems = this.getLog(storyId);
      var hasActive = logItems.some(function (item) {
        return item.status === _types.CallStates.ACTIVE;
      });

      if (debuggerDisabled || isLocked || hasActive || logItems.length === 0) {
        this.channel.emit(EVENTS.SYNC, {
          controlStates: controlsDisabled,
          logItems: logItems
        });
        return;
      }

      var hasPrevious = logItems.some(function (item) {
        return [_types.CallStates.DONE, _types.CallStates.ERROR].includes(item.status);
      });
      var controlStates = {
        debugger: true,
        start: hasPrevious,
        back: hasPrevious,
        goto: true,
        next: isPlaying,
        end: isPlaying
      };
      this.channel.emit(EVENTS.SYNC, {
        controlStates: controlStates,
        logItems: logItems
      });
    }
  }]);

  return Instrumenter;
}();
/**
 * Instruments an object or module by traversing its properties, patching any functions (methods)
 * to enable debugging. Patched functions will emit a `call` event when invoked.
 * When intercept = true, patched functions will return a Promise when the debugger stops before
 * this function. As such, "interceptable" functions will have to be `await`-ed.
 */


exports.Instrumenter = Instrumenter;

function instrument(obj) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  try {
    var _global$window$locati, _global$window$locati2, _global$window$locati3, _global$window$locati4;

    var forceInstrument = false;
    var skipInstrument = false;

    if (((_global$window$locati = _global.default.window.location) === null || _global$window$locati === void 0 ? void 0 : (_global$window$locati2 = _global$window$locati.search) === null || _global$window$locati2 === void 0 ? void 0 : _global$window$locati2.indexOf('instrument=true')) !== -1) {
      forceInstrument = true;
    } else if (((_global$window$locati3 = _global.default.window.location) === null || _global$window$locati3 === void 0 ? void 0 : (_global$window$locati4 = _global$window$locati3.search) === null || _global$window$locati4 === void 0 ? void 0 : _global$window$locati4.indexOf('instrument=false')) !== -1) {
      skipInstrument = true;
    } // Don't do any instrumentation if not loaded in an iframe unless it's forced - instrumentation can also be skipped.


    if (_global.default.window.parent === _global.default.window && !forceInstrument || skipInstrument) {
      return obj;
    } // Only create an instance if we don't have one (singleton) yet.


    if (!_global.default.window.__STORYBOOK_ADDON_INTERACTIONS_INSTRUMENTER__) {
      _global.default.window.__STORYBOOK_ADDON_INTERACTIONS_INSTRUMENTER__ = new Instrumenter();
    }

    var instrumenter = _global.default.window.__STORYBOOK_ADDON_INTERACTIONS_INSTRUMENTER__;
    return instrumenter.instrument(obj, options);
  } catch (e) {
    // Access to the parent window might fail due to CORS restrictions.
    _clientLogger.once.warn(e);

    return obj;
  }
}