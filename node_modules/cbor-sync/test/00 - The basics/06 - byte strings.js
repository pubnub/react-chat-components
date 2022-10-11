var assert = require('chai').assert;

var api = require('../../main.js');

describe('Byte Strings:', function () {
	// From: https://tools.ietf.org/html/rfc7049#appendix-A
	var examples = [
		{data: Buffer.from('0255333A83fB3f', 'hex'), encoded: Buffer.from('470255333A83fB3f', 'hex'), symmetric: true},
		{data: Buffer.alloc(0), encoded: Buffer.from('40', 'hex'), symmetric: true},
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
