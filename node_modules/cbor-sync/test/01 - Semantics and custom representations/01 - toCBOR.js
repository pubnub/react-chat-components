var assert = require('chai').assert;

var api = require('../../main.js');

describe('toCBOR', function () {
	it('replaces data', function () {
		var data = {
			"a": "b",
			"toCBOR": function () {
				return ":)";
			}
		};
		
		var encoded = api.encode(data);
		var decoded = api.decode(encoded);
		
		assert.deepEqual(decoded, ":)");
	});
});