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

let test_token = function(actual, expected) {
	for (let key of Object.keys(expected)) {
		// console.log(`Expected: "${expected[key].toString()}", Actual: "${actual.value[key].toString()}"`);
		if (expected[key].toString() != actual.value[key].toString()) {
			console.log(`Test # ${tests.length}: Expected: "${expected[key].toString()}", Actual: "${actual.value[key].toString()}"`);
			return false;
		}
	}
	return true;
}

lex = lexer("This is a test. This is still a test, this is a test...", "test", rules);

tests = [];

tests.push(test_token(lex.next(), {data: "This is a test", context: ""}));
tests.push(test_token(lex.next(), {data: ". ", context: "othermode"}));
tests.push(test_token(lex.next(), {data: "This is still a test", context: "othermode"}));
tests.push(test_token(lex.next(), {data: ", ", context: "othermode,otherothermode"}));
tests.push(test_token(lex.next(), {data: "this is a test", context: "othermode,otherothermode"}));
tests.push(test_token(lex.next(), {data: ".", context: "othermode"}));
tests.push(test_token(lex.next(), {data: ".", context: ""}));
tests.push(test_token(lex.next(), {data: ".", context: "othermode"}));

for (let i in tests) {
	console.log("Test #", i, tests[i] ? "PASS" : "FAIL")
}

tests.reduce((a, b) => { return a && b}) ? process.exit(0) : process.exit(1)