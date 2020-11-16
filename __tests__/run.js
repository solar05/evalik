const Evalik = require('../Evalik.js');
const Environment = require('../Environment.js');
const evalikParser = require('../parser/evalikParser.js');

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
    require('./increment-test.js'),
    require('./decrement-test.js'),
    require('./increment-assign-test.js'),
    require('./decrement-assign-test.js'),
    require('./class-test.js'),
    require('./module-test.js'),
    require('./import-test.js')
];

const evalik = new Evalik();

function exec(code) {
    const exp = evalikParser.parse(code);
    return evalik.eval(exp);
}

tests.forEach(test => test(evalik));
