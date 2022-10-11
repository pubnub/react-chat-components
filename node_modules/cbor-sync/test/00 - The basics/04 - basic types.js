var assert = require('chai').assert;

var api = require('../../main.js');

describe('Basic types:', function () {
	// From: https://tools.ietf.org/html/rfc7049#appendix-A
	var examples = [
		{data: false, encoded: Buffer.from('f4', 'hex'), symmetric: true},
		{data: true, encoded: Buffer.from('f5', 'hex'), symmetric: true},
		{data: null, encoded: Buffer.from('f6', 'hex'), symmetric: true},
		{data: undefined, encoded: Buffer.from('f7', 'hex'), symmetric: true},
	];
	
	examples.forEach(function (example, index) {
		it('Example ' + index, function () {
			var decoded = api.decode(example.encoded);
			assert.deepEqual(decoded, example.data);
		})
		if (example.symmetric) {
			it('Example ' + index + " (encode)", function () {
				var encoded = api.encode(example.data);
				assert.deepEqual(encoded, example.encoded);
			})
		}
	})
});