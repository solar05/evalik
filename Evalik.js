const assert = require('assert');

const Environment = require('./Environment.js');

/**
  * Evalik interpeter.
  */

class Evalik {
    /**
       * Creates Evalik instance with global env
       */
    constructor(global = new Environment()) {
        this.global = global;
    }


    /**
       * Evaluates an expression in given env
       */
    eval(exp, env = this.global) {
        //SELF-evaluating expressions
        if (isNumber(exp)) {
            return exp;
        }

        if (isString(exp)) {
            return exp.slice(1, -1);
        }

        // Math operations
        if (exp[0] === '+') {
            return this.eval(exp[1], env) + this.eval(exp[2], env);
        }

        if (exp[0] === '*') {
            return this.eval(exp[1], env) * this.eval(exp[2], env);
        }

        if (exp[0] === '-') {
            return this.eval(exp[1], env) - this.eval(exp[2], env);
        }

        if (exp[0] === '/') {
            return this.eval(exp[1], env) / this.eval(exp[2], env);
        }

        // Block: sequence of expr
        if (exp[0] === 'begin') {
            const blockEnv = new Environment({}, env);
            return this._evalBlock(exp, blockEnv);
        }

        // Variable declaration: (var foo 5)
        if (exp[0] === 'var') {
            const [_, name, value] = exp;
            return env.define(name, this.eval(value, env));
        }

        // Variable setting (update): (set foo 5)
        if (exp[0] === 'set') {
            const [_, name, value] = exp;
            return env.assign(name, this.eval(value, env));
        }


        // Variable access: foo
        if (isVariableName(exp)) {
            return env.lookup(exp);
        }

        throw `Not inplemented ${JSON.stringify(exp)}`;
    }

    _evalBlock(block, env) {
        let result;
        const [_tag, ...expressions] = block;

        expressions.forEach(exp => {
            result = this.eval(exp, env);
        });

        return result;
    }

}

function isNumber(exp) {
    return typeof exp === 'number';
}

function isString(exp) {
    return typeof exp === 'string' && exp[0] === '"' && exp.slice(-1) === '"';
}

function isVariableName(exp) {
    return typeof exp === 'string' && /^[a-zA-Z][a-zA-Z0-9_]*$/.test(exp);
}

const evalik = new Evalik(new Environment({
    null: null,
    true: true,
    false: false,
    VERSION: '0.1',
}));

// Types
assert.strictEqual(evalik.eval(1), 1);
assert.strictEqual(evalik.eval('"Hello, world!"'), 'Hello, world!');

// Math
assert.strictEqual(evalik.eval(['+', 1, 5]), 6);
assert.strictEqual(evalik.eval(['+', ['+', 6, 4], 5]), 15);
assert.strictEqual(evalik.eval(['+', ['*', 6, 4], 5]), 29);
assert.strictEqual(evalik.eval(['-', ['*', 6, 4], 5]), 19);
assert.strictEqual(evalik.eval(['-', 5, ['*', 6, 4]]), -19);
assert.strictEqual(evalik.eval(['/', 10, ['/', 6, 3]]), 5);

// Variables
assert.strictEqual(evalik.eval(['var', 'x', 5]), 5);
assert.strictEqual(evalik.eval('x'), 5);

assert.strictEqual(evalik.eval(['var', 'y', 15]), 15);
assert.strictEqual(evalik.eval('y'), 15);

assert.strictEqual(evalik.eval('VERSION'), '0.1');

assert.strictEqual(evalik.eval(['var', 'isAdmin', 'true']), true);

assert.strictEqual(evalik.eval(['var', 'z', ['*', 2, 5]]), 10);

// Blocks
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




console.log("Assertions passed!");
