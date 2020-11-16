const assert = require('assert');
const {test} = require('./test-util');

module.exports = evalik => {
  test(evalik,
  `(begin
      (var result 0)
      (dec result)
      result
    )
  `,
  -1);

};