var { lexer, rule } = require('.');

let rules = {
	default: [
		rule("PERIOD1", /\./, "othermode"),
		rule("WORD1", /[^\.]+/)
	],
	othermode: [
		rule("PERIOD2", /\./, "<"),
		rule("WORD2", /[^\.]+/)
	]
}

lex = lexer("This is a test. This is a test. This is a test.", "test", rules);

let token = lex.next();
while(!token.done) {
	switch (token.value.type) {
		case "WORD1":
		case "PERIOD1":
			console.log("We're in the default context");
			break;
		case "WORD2":
		case "PERIOD2":
			console.log("We're in the other context");
			break;
		}
	token = lex.next();
}
