const assert = require('assert');
const evalikParser = require('../parser/evalikParser');

function test(evalik, code, expected) {
    const exp = evalikParser.parse(`(begin ${code})`);
    assert.strictEqual(evalik.evalGlobal(exp), expected);
}

module.exports = {
    test,
};
