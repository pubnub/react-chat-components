"use strict";
it(`can be required with CommonJS`, () => {
    const spawnAsync = require('../..');
    expect(spawnAsync).toBeDefined();
    expect(typeof spawnAsync).toBe('function');
});
//# sourceMappingURL=import-test.js.map