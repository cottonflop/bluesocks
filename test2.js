var { lexer, rule } = require('.');

let test = "[1[2[3[4[5[6[7[8[9[abc]]]]]]]]]]";

let rules = {
	default: [
		rule("OPENGROUP", /\[/),
		rule("CLOSEGROUP", /\]/),
		rule("DIGIT", /\d/),
		rule("CHAR", /./),
	]
}

let test_token = function(actual, expected, testname="") {
	if (actual instanceof Object) {
		for (let key of Object.keys(expected)) {
			// console.log(`Expected: "${expected[key].toString()}", Actual: "${actual.value[key].toString()}"`);
			if (expected[key].toString() != actual.value[key].toString()) {
				return [false, `FAILED! Expected: "${expected[key].toString()}", Actual: "${actual.value[key].toString()}"`];
			}
		}
	} else {
			if (!(actual == expected)) return [(actual == expected), `FAILED! Expected: "${expected.toString()}", Actual: "${actual.toString()}"`];
	}
	return [true, `PASS${testname ? " - " + testname : testname }`];
}


process_tokens = function(lex) {
	let out = [];
	let token = lex.next();
	while(!token.done) {
		switch (token.value.type) {
			case "OPENGROUP":
				out.push(process_tokens(lex));
				break;
			case "CLOSEGROUP":
				return out;
				break;
			case "DIGIT":
				out.push(parseInt(token.value.data));
				break;
			case "CHAR":
				out.push(token.value.data);
				break;
			}
		token = lex.next();
		}
		return out;
	}

let l = lexer(test, "test", rules)
actual = JSON.stringify(process_tokens(l));
expected = '[[1,[2,[3,[4,[5,[6,[7,[8,[9,["a","b","c"]]]]]]]]]]]';


module.exports = test_token(actual, expected, "Array style parsing of nested tokens");