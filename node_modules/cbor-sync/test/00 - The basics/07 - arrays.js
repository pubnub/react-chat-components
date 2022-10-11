var assert = require('chai').assert;

var api = require('../../main.js');

describe('Arrays:', function () {
	// From: https://tools.ietf.org/html/rfc7049#appendix-A
	var examples = [
		{data: [], encoded: Buffer.from('80', 'hex'), symmetric: true},
		{data: [1, 2, 3], encoded: Buffer.from('83010203', 'hex'), symmetric: true},
		{data: [1, [2, 3], [4, 5]], encoded: Buffer.from('8301820203820405', 'hex'), symmetric: true},
		{data: [1, 2, 3, 4, 5, 6, 7, 8, 9,
			10, 11, 12, 13, 14, 15, 16,
			17, 18, 19, 20, 21, 22, 23,
			24, 25], encoded: Buffer.from('98190102030405060708090a0b0c0d0e0f101112131415161718181819', 'hex'), symmetric: true},
		// Variable-length arrays
		{data: [1, [2, 3], [4, 5]], encoded: Buffer.from('9f018202039f0405ffff', 'hex'), symmetric: false},
		{data: [1, [2, 3], [4, 5]], encoded: Buffer.from('9f01820203820405ff', 'hex'), symmetric: false},
		{data: [1, [2, 3], [4, 5]], encoded: Buffer.from('83018202039f0405ff', 'hex'), symmetric: false},
		{data: [1, [2, 3], [4, 5]], encoded: Buffer.from('83019f0203ff820405', 'hex'), symmetric: false},
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