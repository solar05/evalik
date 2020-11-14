const assert = require('assert');

/**
  * Evalik interpeter.
  */

class Evalik {
    eval(exp) {

        //Self-evaluating expressions
        if (isNumber(exp)) {
            return exp;
        }

        if (isString(exp)) {
            return exp.slice(1, -1);
        }

        // Math operations
        if (exp[0] === '+') {
            return this.eval(exp[1]) + this.eval(exp[2]);
        }

        if (exp[0] === '*') {
            return this.eval(exp[1]) * this.eval(exp[2]);
        }

        throw 'Not inplemented';
    }
}

function isNumber(exp) {
    return typeof exp === 'number';
}

function isString(exp) {
    return typeof exp === 'string' && exp[0] === '"' && exp.slice(-1) === '"';
}

const evalik = new Evalik();

assert.strictEqual(evalik.eval(1), 1);
assert.strictEqual(evalik.eval('"Hello, world!"'), 'Hello, world!');

assert.strictEqual(evalik.eval(['+', 1, 5]), 6);
assert.strictEqual(evalik.eval(['+', ['+', 6, 4], 5]), 15);
assert.strictEqual(evalik.eval(['+', ['*', 6, 4], 5]), 29);


console.log("Assertions passed!");
