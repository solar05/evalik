const assert = require('assert');
const {test} = require('./test-util');

module.exports = evalik => {
    // Math func
    test(evalik, '(+ 1 5)', 6);
    test(evalik, '(+ (+ 6 4) 5)', 15);
    test(evalik, '(+ (* 6 4) 5)', 29);
    test(evalik, '(- (* 6 4) 5)', 19);
    test(evalik, '(- 5 (* 6 4))', -19);
    test(evalik, '(/ 10 (/ 6 3))', 5);

    // Comparison func
    test(evalik, '(> 4 5)', false);
    test(evalik, '(< 4 5)', true);
    test(evalik, '(>= 10 10)', true);
    test(evalik, '(<= 10 10)', true);
    test(evalik, '(= 10 10)', true);
};
