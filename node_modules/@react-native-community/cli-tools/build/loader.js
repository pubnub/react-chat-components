"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLoader = getLoader;
exports.NoopLoader = void 0;

function _ora() {
  const data = _interopRequireDefault(require("ora"));

  _ora = function () {
    return data;
  };

  return data;
}

var _logger = _interopRequireDefault(require("./logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class OraNoop {
  constructor() {
    _defineProperty(this, "spinner", {
      interval: 1,
      frames: []
    });

    _defineProperty(this, "indent", 0);

    _defineProperty(this, "isSpinning", false);

    _defineProperty(this, "text", '');

    _defineProperty(this, "prefixText", '');

    _defineProperty(this, "color", 'blue');
  }

  succeed(_text) {
    return this;
  }

  fail(_text) {
    return this;
  }

  start(_text) {
    return this;
  }

  stop() {
    return this;
  }

  warn(_text) {
    return this;
  }

  info(_text) {
    return this;
  }

  stopAndPersist() {
    return this;
  }

  clear() {
    return this;
  }

  render() {
    return this;
  }

  frame() {
    return this.text;
  }

}

function getLoader(options) {
  return _logger.default.isVerbose() ? new OraNoop() : (0, _ora().default)(options);
}

const NoopLoader = OraNoop;
exports.NoopLoader = NoopLoader;

//# sourceMappingURL=loader.js.map