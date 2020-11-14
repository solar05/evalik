const assert = require('assert');
const evalikParser = require('../parser/evalikParser');

function test(evalik, code, expected) {
    const exp = evalikParser.parse(code);
    assert.strictEqual(evalik.eval(exp), expected);
}

module.exports = {
    test,
};
