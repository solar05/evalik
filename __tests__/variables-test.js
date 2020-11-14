const assert = require('assert');

module.exports = evalik => {
    assert.strictEqual(evalik.eval(['var', 'x', 5]), 5);
    assert.strictEqual(evalik.eval('x'), 5);
    assert.strictEqual(evalik.eval(['var', 'y', 15]), 15);
    assert.strictEqual(evalik.eval('y'), 15);
    assert.strictEqual(evalik.eval('VERSION'), '0.1');
    assert.strictEqual(evalik.eval(['var', 'isAdmin', 'true']), true);
    assert.strictEqual(evalik.eval(['var', 'z', ['*', 2, 5]]), 10);
};
