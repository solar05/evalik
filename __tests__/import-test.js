const assert = require('assert');
const {test} = require('./test-util');

module.exports = evalik => {

  test(evalik,
  `
    (import Math)
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
    (var square (prop Math square))
    (square 3)
  `, 9);

  test(evalik,
  `
    (prop Math MAX_VALUE)
  `,
  999999);

};
