const assert = require('assert');

module.exports = evalik => {
    assert.strictEqual(evalik.eval(['+', 1, 5]), 6);
    assert.strictEqual(evalik.eval(['+', ['+', 6, 4], 5]), 15);
    assert.strictEqual(evalik.eval(['+', ['*', 6, 4], 5]), 29);
    assert.strictEqual(evalik.eval(['-', ['*', 6, 4], 5]), 19);
    assert.strictEqual(evalik.eval(['-', 5, ['*', 6, 4]]), -19);
    assert.strictEqual(evalik.eval(['/', 10, ['/', 6, 3]]), 5);
};
