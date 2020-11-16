const assert = require('assert');
const {test} = require('./test-util');

module.exports = evalik => {
    test(evalik,
         `(begin
            (def square (x)
              (* x x))
          (square 2))`,
         4);

    test(evalik,
         `(begin
            (def calc (x y)
              (begin
                (var z 20)
                (+ (* x y) z)))
          (calc 2 5))`,
         30);

    //Closure test
    test(evalik,
         `(begin
            (var val 100)
            (def calc (x y)
              (begin
                (var z (+ x y))
                (def inner (bar)
                  (+ (+ z bar) val))
                  inner
              ))
          (var fn (calc 10 20))
          (fn 30))`,
         160);

};
