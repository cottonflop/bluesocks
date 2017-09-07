var { lexer, rule } = require('.');

let rules = {
	default: [
		rule("PERIOD", /\./),
		rule("WORD", /[^\.]+/)
	],
	othermode: [
		rule("PERIOD", /\./),
		rule("WORD", /[^\.]+/)
	]
}

lex = lexer("This is a test. This is a test. This is a test.", "test", rules);

let token = lex.next();
while(!token.done) {
	let mode_switch = undefined;
	switch (token.value.mode) {
		case "default":
			switch (token.value.type) {
				case "UNDEFINED":
					console.log(`Error: Undefined token "${token.value.data}" in ${token.value.src}:${token.value.row}:${token.value.col}`);
					mode_switch = "ERROR";
					break;
				case "PERIOD":
					mode_switch = "othermode";
				case "WORD":
					console.log(`[MODE ${token.value.mode}] Found a ${token.value.type} "${token.value.data}" at (${token.value.row}, ${token.value.col})`);
					break
			}
			break;
		case "othermode":
			console.log(`[MODE ${token.value.mode}] Found "${token.value.data}" at (${token.value.row}, ${token.value.col})`);
			if (token.value.type == "PERIOD") mode_switch = "default";
			break;
	}
	token = lex.next(mode_switch);
}
