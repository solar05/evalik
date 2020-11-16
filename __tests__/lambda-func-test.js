const assert = require('assert');
const {test} = require('./test-util');

module.exports = evalik => {
    test(evalik,
         `(begin
            (def onClick (callback)
              (begin
                (var x 10)
                (var y 50)
                (callback (+ x y))))
          (onClick (lambda (data) (* data 10))))`,
         600);

    // IILE (Immeadiately-invoked lambda expression)
    test(evalik,
         `((lambda (x) (* x x)) 2)`,
         4);

};
