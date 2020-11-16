const assert = require('assert');

const Environment = require('./Environment.js');

/**
  * Evalik interpeter.
  */

class Evalik {
    /**
       * Creates Evalik instance with global env
       */
    constructor(global = GlobalEnv) {
        this.global = global;
    }


    /**
       * Evaluates an expression in given env
       */
    eval(exp, env = this.global) {
        //SELF-evaluating expressions
        if (this._isNumber(exp)) {
            return exp;
        }

        if (this._isString(exp)) {
            return exp.slice(1, -1);
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
        if (this._isVariableName(exp)) {
            return env.lookup(exp);
        }

        // if-expression
        if (exp[0] === 'if') {
            const [_tag, cond, conseq, alter] = exp;
            if (this.eval(cond, env)) {
                return this.eval(conseq, env);
            }
            return this.eval(alter, env);
        }

        //while-expression
        if (exp[0] === 'while') {
            const [_tag, cond, body] = exp;
            let result;
            while (this.eval(cond, env)) {
                result = this.eval(body, env);
            }
            return result;
        }

        //Func declaration
        // (def square (x) (* x x))
        if (exp[0] === 'def') {
            const [_tag, name, params, body] = exp;

            const fn = {
                params,
                body,
                env //Closure
            };

            return env.define(name, fn);
        }

        //Lambda func (lambda (x) (* x x))
        if (exp[0] === 'lambda') {
            const [_tag, params, body] = exp;

            return {
                params,
                body,
                env //Closure
            };
        }

        //Func calls
        // (print "Hello, world!")
        // (+ x 5)
        // (> foo bar)
        if (Array.isArray(exp)) {
            const fn = this.eval(exp[0], env);
            const args = exp
                  .slice(1)
                  .map(arg => this.eval(arg, env));

            // Native functions
            if (typeof fn === 'function') {
                return fn(...args);
            }

            // User-defined functions
            const activationRecord = {};

            fn.params.forEach((param, index) => {
                activationRecord[param] = args[index];
            });

            const activationEnv = new Environment(
                activationRecord,
                fn.env // static scope
            );

            return this._evalBody(fn.body, activationEnv);
        }

        throw `Not inplemented ${JSON.stringify(exp)}`;
    }

    _evalBody(body, env) {
        if (body[0] === 'begin') {
            return this._evalBlock(body, env);
        }
        return this.eval(body, env);
    }

    _evalBlock(block, env) {
        let result;
        const [_tag, ...expressions] = block;
        expressions.forEach(exp => {
            result = this.eval(exp, env);
        });
        return result;
    }

    _isNumber(exp) {
        return typeof exp === 'number';
    }

    _isString(exp) {
        return typeof exp === 'string' && exp[0] === '"' && exp.slice(-1) === '"';
    }

    _isVariableName(exp) {
        return typeof exp === 'string' && /^[+\-*/<>=a-zA-Z0-9_]+$/.test(exp);
    }

}

/**
   * Default global env
   */
const GlobalEnv = new Environment({
    null: null,
    true: true,
    false: false,
    VERSION: '0.1',

    //Math operations
    '+'(op1, op2) {
        return op1 + op2;
    },
    '-'(op1, op2 = null) {
        if (op2 === null) {
            return -op1;
        }
        return op1 - op2;
    },
    '*'(op1, op2) {
        return op1 * op2;
    },
    '/'(op1, op2) {
        return op1 / op2;
    },

    //Comparison operations
    '>'(op1, op2) {
        return op1 > op2;
    },
    '<'(op1, op2) {
        return op1 < op2;
    },
    '>='(op1, op2) {
        return op1 >= op2;
    },
    '<='(op1, op2) {
        return op1 <= op2;
    },
    '='(op1, op2) {
        return op1 === op2;
    },
    print(...args) {
        console.log(...args);
    }
});

module.exports = Evalik;
