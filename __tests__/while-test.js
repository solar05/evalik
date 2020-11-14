const assert = require('assert');

module.exports = evalik => {
    assert.strictEqual(evalik.eval(
        ['begin',

         ['var', 'counter', 0],

         ['while', ['<', 'counter', 10],
          ['set', 'counter', ['+', 'counter', 1]],
         ],
         'counter'
        ]),
                       10);
};
