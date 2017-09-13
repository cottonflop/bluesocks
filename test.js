var { lexer, rule } = require('.');

let rules = {
	default: [
		rule("PERIOD1", /\.\s*/, "othermode"),
		rule("WORD1", /[^\.]+/)
	],
	othermode: [
		rule("COMMA2", /\,\s*/, "otherothermode"),
		rule("PERIOD2", /\.\s*/, "<"),
		rule("WORD2", /[^,\.]+/)
	],
	otherothermode : [
		rule("PERIOD3", /\.\s*/, "<"),
		rule("WORD3", /[^\.]+/)
	],
}

let test_token = function(actual, expected, testname="") {
	for (let key of Object.keys(expected)) {
		// console.log(`Expected: "${expected[key].toString()}", Actual: "${actual.value[key].toString()}"`);
		if (expected[key].toString() != actual.value[key].toString()) {
			return [false, `FAILED! Expected: "${expected[key].toString()}", Actual: "${actual.value[key].toString()}"`];
		}
	}
	return [true, `PASS${testname ? " - " + testname : testname }`];
}

lex = lexer("This is default scope. This is othermode, This is otherothermode...", "test", rules);

tests = [];

tests.push(test_token(lex.next(), {data: "This is default scope", scope: "default"}, "Default scope"));
tests.push(test_token(lex.next(), {data: ". ", scope: "default.othermode"}, "New scope push, 1 level"));
tests.push(test_token(lex.next(), {data: "This is othermode", scope: "default.othermode"}, "Staying in scope"));
tests.push(test_token(lex.next(), {data: ", ", scope: "default.othermode.otherothermode"}, "New scope push, 2 levels"));
tests.push(test_token(lex.next(), {data: "This is otherothermode", scope: "default.othermode.otherothermode"}, "Scope pop, 1 level"));
tests.push(test_token(lex.next(), {data: ".", scope: "default.othermode"}, "Scope pop, 1 level"));
tests.push(test_token(lex.next(), {data: ".", scope: "default"}, "Scope pop, default scope"));
tests.push(test_token(lex.next(), {data: ".", scope: "default.othermode"}, "Scope pop, 1 level"));




tests.push(require('./test2'))

// console.log(tests)

for (let i in tests) {
	[result, msg] = tests[i];
	console.log(`Test #${i}: ${msg}`)
}


tests.reduce((a, b) => { return a && b[0]}) ? process.exit(0) : process.exit(1)
