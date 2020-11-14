const Evalik = require('../Evalik.js');
const Environment = require('../Environment.js');

const tests = [
    require('./self-eval-test.js'),
    require('./blocks-test.js'),
    require('./math-test.js'),
    require('./variables-test.js')
];

const evalik = new Evalik(new Environment({
    null: null,
    true: true,
    false: false,
    VERSION: '0.1',
}));

tests.forEach(test => test(evalik));

console.log("Assertions passed!");
