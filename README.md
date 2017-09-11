# bluesocks
Bluesocks is a lightweight lexer in Javascript

```javascript
let { lexer, rule } = require('.');

let rules = {
	default: [
		rule("PERIOD1", /\./, "othercontext"), //push othercontext
		rule("NOTPERIOD1", /[^\.]+/)
	],
	othercontext: [
		rule("PERIOD2", /\./, "<"), //pop othercontext
		rule("NOTPERIOD2", /[^\.]+/)
	]
}


lex = lexer("This is a test. This is a test. This is a test.", "test", rules);

let token = lex.next();
while(!token.done) {
	switch (token.value.type) {
		case "PERIOD1":
			console.log("We switched to default context");
			break;
		case "NOTPERIOD1":
			console.log(`We found a non-period token: "${token.value.data}"`);
			break;
		case "PERIOD2":
			console.log("We switched to othercontext");
			break;
		case "NOTPERIOD2":
			console.log(`We found a non-period token: "${token.value.data}"`);
			break;
		}
	token = lex.next();
}
```
