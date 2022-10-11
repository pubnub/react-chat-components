var assert = require('chai').assert;

var api = require('../../main.js');

describe('Objects:', function () {
	// From: https://tools.ietf.org/html/rfc7049#appendix-A
	var examples = [
		{data: {}, encoded: Buffer.from('a0', 'hex'), symmetric: true},
		{data: {"a": 1, "b": [2, 3]}, encoded: Buffer.from('a26161016162820203', 'hex'), symmetric: true},
		{data: ["a", {"b": "c"}], encoded: Buffer.from('826161a161626163', 'hex'), symmetric: true},
		{data: {"a": "A", "b": "B", "c": "C", "d": "D", "e": "E"}, encoded: Buffer.from('a56161614161626142616361436164614461656145', 'hex'), symmetric: true},
		// Variable-length objects
		{data: {"a": 1, "b": [2, 3]}, encoded: Buffer.from('bf61610161629f0203ffff', 'hex'), symmetric: false},
		{data: ["a", {"b": "c"}], encoded: Buffer.from('826161bf61626163ff', 'hex'), symmetric: false},
		{data: {"Fun": true, "Amt": -2}, encoded: Buffer.from('bf6346756ef563416d7421ff', 'hex'), symmetric: false},
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