# Encode/decode CBOR

[![Build Status](https://travis-ci.org/ARMmbed/cbor-sync.svg?branch=master)](https://travis-ci.org/ARMmbed/cbor-sync) [![NPM version](https://badge.fury.io/js/cbor-sync.png)](http://badge.fury.io/js/cbor-sync)

This package provides an extensible CBOR encoder/decoder.

## Usage

```javascript
var CBOR = require('cbor-sync');

var encodedBuffer = CBOR.encode({hello: 'world'});
var decodedObject = CBOR.decode(encodedBuffer);
```

## `toCBOR()`

Much like the `toJSON()` method, which allows objects to provide a replacement representation for encoding, this package checks for a `toCBOR()` method.

Note that this step happens *after* any semantic-tagging/-replacement step, so a custom semantic encoder will always override an objects built-in `toCBOR()` method.

## Semantic extensions

CBOR provides a limited set of basic types (similar to JSON), but provides semantic tagging (optional for both encoder/decoder) that lets you annotate parts of the data so they can be decoded appropriately.

Here is an example (from this module) for encoding Date objects as ISO strings:

```javascript
// 0 is the CBOR semantic tag number for date/time strings: https://tools.ietf.org/html/rfc7049#section-2.4
CBOR.addSemanticEncode(0, function (data) {
	if (data instanceof Date) {
		return data.toISOString();
	}
});
CBOR.addSemanticDecode(0, function (dateString) {
	return new Date(dateString);
});
```

## Known issues

* All floats encoded as 64-bit, regardless of whether they strictly need to be
