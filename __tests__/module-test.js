const assert = require('assert');
const {test} = require('./test-util');

module.exports = evalik => {

  test(evalik,
  `
    (module Math
      (begin
        (def abs (value)
          (if (< value 0)
              (- value)
              value))
        (def square (x)
          (* x x))
        (var MAX_VALUE 999999)
      )
    )
    ((prop Math abs) (- 1))
  `,
  1);

  test(evalik,
  `
    (var abs (prop Math abs))
    (abs (- 1))
  `,
  1);

  test(evalik,
  `
    (prop Math MAX_VALUE)
  `,
  999999);

};
