var { lexer, rule } = require('.');

let test = "";

let rules = {
	default: [
		rule("OPENGROUP", /\[/),
		rule("CLOSEGROUP", /\]/),
		rule("CHAR", /./)
	]
}


process_tokens = function(lex) {
	let out = [];
	let token = lex.next();
	while(!token.done) {
		console.log(token);
		switch (token.value.type) {
			case "OPENGROUP":
				out.push(process_tokens(lex));
				break;
			case "CLOSEGROUP":
				return out;
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

console.log(process_tokens(l));