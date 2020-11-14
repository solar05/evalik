const assert = require('assert');

module.exports = evalik => {
    assert.strictEqual(evalik.eval(1), 1);
    assert.strictEqual(evalik.eval('"Hello, world!"'), 'Hello, world!');
};
