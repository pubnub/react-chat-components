"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _HermesASTAdapter = _interopRequireDefault(require("./HermesASTAdapter"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */

/*
This class does some very "javascripty" things in the name of
performance which are ultimately impossible to soundly type.

So instead of adding strict types and a large number of suppression
comments, instead it is left untyped and subclasses are strictly
typed via a separate flow declaration file.
*/
class HermesToESTreeAdapter extends _HermesASTAdapter.default {
  constructor(options, code) {
    super(options);
    this.code = void 0;
    this.code = code;
  }

  fixSourceLocation(node) {
    var _this$sourceFilename;

    const loc = node.loc;

    if (loc == null) {
      return;
    }

    node.loc = {
      source: (_this$sourceFilename = this.sourceFilename) != null ? _this$sourceFilename : null,
      start: loc.start,
      end: loc.end
    };
    node.range = [loc.rangeStart, loc.rangeEnd];
  }

  mapNode(node) {
    this.fixSourceLocation(node);

    switch (node.type) {
      case 'Program':
        return this.mapProgram(node);

      case 'NullLiteral':
        return this.mapNullLiteral(node);

      case 'BooleanLiteral':
      case 'StringLiteral':
      case 'NumericLiteral':
      case 'JSXStringLiteral':
        return this.mapSimpleLiteral(node);

      case 'BigIntLiteral':
        return this.mapBigIntLiteral(node);

      case 'RegExpLiteral':
        return this.mapRegExpLiteral(node);

      case 'Empty':
        return this.mapEmpty(node);

      case 'TemplateElement':
        return this.mapTemplateElement(node);

      case 'BigIntLiteralTypeAnnotation':
        return this.mapBigIntLiteralTypeAnnotation(node);

      case 'GenericTypeAnnotation':
        return this.mapGenericTypeAnnotation(node);

      case 'ImportDeclaration':
        return this.mapImportDeclaration(node);

      case 'ImportSpecifier':
        return this.mapImportSpecifier(node);

      case 'ExportDefaultDeclaration':
        return this.mapExportDefaultDeclaration(node);

      case 'ExportNamedDeclaration':
        return this.mapExportNamedDeclaration(node);

      case 'ExportAllDeclaration':
        return this.mapExportAllDeclaration(node);

      case 'PrivateName':
      case 'ClassPrivateProperty':
        return this.mapPrivateProperty(node);

      default:
        return this.mapNodeDefault(node);
    }
  }

  mapProgram(node) {
    node = this.mapNodeDefault(node);
    node.sourceType = this.getSourceType();
    return node;
  }

  mapSimpleLiteral(node) {
    return {
      type: 'Literal',
      loc: node.loc,
      range: node.range,
      value: node.value,
      raw: this.code.slice(node.range[0], node.range[1]),
      literalType: (() => {
        switch (node.type) {
          case 'NullLiteral':
            return 'null';

          case 'BooleanLiteral':
            return 'boolean';

          case 'StringLiteral':
          case 'JSXStringLiteral':
            return 'string';

          case 'NumericLiteral':
            return 'numeric';

          case 'BigIntLiteral':
            return 'bigint';

          case 'RegExpLiteral':
            return 'regexp';
        }

        return null;
      })()
    };
  }

  mapBigIntLiteral(node) {
    const newNode = this.mapSimpleLiteral(node);
    const bigint = node.bigint // estree spec is to not have a trailing `n` on this property
    // https://github.com/estree/estree/blob/db962bb417a97effcfe9892f87fbb93c81a68584/es2020.md#bigintliteral
    .replace(/n$/, '') // `BigInt` doesn't accept numeric separator and `bigint` property should not include numeric separator
    .replace(/_/, '');
    return { ...newNode,
      // coerce the string to a bigint value if supported by the environment
      value: typeof BigInt === 'function' ? BigInt(bigint) : null,
      bigint
    };
  }

  mapNullLiteral(node) {
    return { ...this.mapSimpleLiteral(node),
      value: null
    };
  }

  mapRegExpLiteral(node) {
    const {
      pattern,
      flags
    } = node; // Create RegExp value if possible. This can fail when the flags are invalid.

    let value;

    try {
      value = new RegExp(pattern, flags);
    } catch (e) {
      value = null;
    }

    return { ...this.mapSimpleLiteral(node),
      value,
      regex: {
        pattern,
        flags
      }
    };
  }

  mapBigIntLiteralTypeAnnotation(node) {
    node.value = null;
    return node;
  }

  mapTemplateElement(node) {
    return {
      type: 'TemplateElement',
      loc: node.loc,
      range: node.range,
      tail: node.tail,
      value: {
        cooked: node.cooked,
        raw: node.raw
      }
    };
  }

  mapGenericTypeAnnotation(node) {
    // Convert simple `this` generic type to ThisTypeAnnotation
    if (node.typeParameters == null && node.id.type === 'Identifier' && node.id.name === 'this') {
      return {
        type: 'ThisTypeAnnotation',
        loc: node.loc,
        range: node.range
      };
    }

    return this.mapNodeDefault(node);
  }

  mapComment(node) {
    if (node.type === 'CommentBlock') {
      node.type = 'Block';
    } else if (node.type === 'CommentLine') {
      node.type = 'Line';
    }

    return node;
  }

}

exports.default = HermesToESTreeAdapter;