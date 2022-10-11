"use strict";

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/web.dom-collections.for-each.js");

require("core-js/modules/es.object.keys.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  EVENTS: true,
  instrument: true
};
Object.defineProperty(exports, "EVENTS", {
  enumerable: true,
  get: function get() {
    return _instrumenter.EVENTS;
  }
});
Object.defineProperty(exports, "instrument", {
  enumerable: true,
  get: function get() {
    return _instrumenter.instrument;
  }
});

var _instrumenter = require("./instrumenter");

var _types = require("./types");

Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _types[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _types[key];
    }
  });
});