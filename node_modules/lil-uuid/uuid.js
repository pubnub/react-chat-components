/*! lil-uuid - v0.1 - MIT License - https://github.com/lil-js/uuid */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports'], factory)
  } else if (typeof exports === 'object') {
    factory(exports)
    if (typeof module === 'object' && module !== null) {
      module.exports = exports.uuid
    }
  } else {
    factory((root.lil = root.lil || {}))
  }
}(this, function (exports) {
  var VERSION = '0.1.0'
  var uuidRegex = {
    '3': /^[0-9A-F]{8}-[0-9A-F]{4}-3[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
    '4': /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
    '5': /^[0-9A-F]{8}-[0-9A-F]{4}-5[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
    all: /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i
  }

  function uuid() {
    var uuid = '', i, random
    for (i = 0; i < 32; i++) {
      random = Math.random() * 16 | 0;
      if (i === 8 || i === 12 || i === 16 || i === 20) uuid += '-'
      uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16)
    }
    return uuid
  }

  function isUUID(str, version) {
    var pattern = uuidRegex[version || 'all']
    return pattern && pattern.test(str) || false
  }

  uuid.isUUID = isUUID
  uuid.VERSION = VERSION

  exports.uuid = uuid
  exports.isUUID = isUUID
}));
