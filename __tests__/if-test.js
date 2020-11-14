const assert = require('assert');

/**
   * (if <cond>
   *     <conseq>
   *     <alter>)
   */

module.exports = evalik => {
    assert.strictEqual(evalik.eval(
        ['begin',
         ['var', 'x', 10],
         ['var', 'y', 0],
         ['if', ['>', 'x', 10],
          ['set', 'y', 20],
          ['set', 'y', 40]], 'y']), 40);
};

