const Evalik = require('../Evalik.js');
const Environment = require('../Environment.js');

const tests = [
    require('./self-eval-test.js'),
    require('./blocks-test.js'),
    require('./math-test.js'),
    require('./variables-test.js'),
    require('./if-test.js'),
    require('./while-test.js'),
    require('./built-in-func-test.js'),
    require('./user-defined-function-test.js'),
    require('./lambda-func-test.js'),
    require('./switch-test.js'),
    require('./increment-test.js')
];

const evalik = new Evalik();

evalik.eval(['print', '"Tests"', '"started!"']);

tests.forEach(test => test(evalik));

console.log("Assertions passed!");
