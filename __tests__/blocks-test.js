const assert = require('assert');
const testUtil = require('./test-util')

module.exports = evalik => {
    assert.strictEqual(evalik.eval(
        ['begin',
         ['var', 'x', 20],
         ['var', 'y', 40],
         ['+', ['*', 'x', 'y'], 10]
        ]), 810);

    assert.strictEqual(evalik.eval(
        ['begin',
         ['var', 'x', 20],
         ['begin',
          ['var', 'x', 30], 'x'], 'x']), 20);

    assert.strictEqual(evalik.eval(
        ['begin',
         ['var', 'value', 20],
         ['var', 'result',
          ['begin',
           ['var', 'x', ['+', 'value', 10]]
           , 'x']
         ], 'result']), 30);

    assert.strictEqual(evalik.eval(
        ['begin',
         ['var', 'data', 20],
         ['begin',
          ['set', 'data', 10]]
         , 'data']), 10);

    testUtil.test(evalik, `(begin (var x 20) (var y 30) (+ (* x 10) y))`, 230);
};
