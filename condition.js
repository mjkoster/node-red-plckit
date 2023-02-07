
const math = require ('mathjs') ;

const scope = {
  In_1: 1,
  In_2: 1,
  In_3: 0
}

const expression = "In_1 == 1 and In_2 == 1 and In_3 == 0";

const ast = math.parse(expression);

const result = ast.evaluate(scope);

console.log(math.parse(expression).evaluate(scope));

// console.log((require('mathjs')).parse("In_1 == 1 and In_2 == 1 and In_3 == 0").evaluate({In_1:1,In_2:1,In_3:0}))
