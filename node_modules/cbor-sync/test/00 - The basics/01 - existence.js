var assert = require('chai').assert;

var api = require('../../main.js');

describe('Module exists', function () {
	it('is the right shape', function () {
		assert.isObject(api);
		assert.isFunction(api.encode);
		assert.isFunction(api.decode);
	});
});