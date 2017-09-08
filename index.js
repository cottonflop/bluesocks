let token = function(type, data, src, row, col) {
	return {
		type: type,
		data: data,
		src: src,
		row: row,
		col: col,
		context: context
	}
}

let context = [];

let pos2d = function(s) {
	lines = s.split(/(?=\n)/);
	row = lines.length;
	col = lines[lines.length - 1].length + 1
	return [row, col];
}


let rule = function(name, regex, context) {
	return { name: name, regex: regex, context: context };
}


let change_context = function(s) {
	if (!s) return true;
	switch(s[0]) {
		case ">": //push
			return (context.push(s.substr(1)) == s.substr(1));
		case "<": //pop
			return (context.pop() == s.substr(1));
		default: //no.
			console.log(`Unknown context switch encountered: "${s}"`);
			return false;
	}
}

let get_context = function() {
	return context.length > 0 ? context.slice(-1)[0] : "default";
}


var lexer = function*(s, src, rules, mode = "default") {
	context = [];
	if (Array.isArray(rules)) rules = { default: rules };
	if (s === undefined) return "No string provided!";
	if (src === undefined) return "No source provided!";
	if (rules === undefined) rules = { default: [rule("CHARACTER", /./)] };
	let pos=0, row=1, col=1, data="";
	let new_context = undefined;

	for (let i=0; i < s.length; i+=data.length) {
		[row, col] = pos2d(s.substr(0, i));
		// let match = -1;
		console.log(`We're currently in context: "${get_context()}"`)
		let rule = rules[get_context()].find((x) => (s.substr(i).search(x.regex) == 0));
		if (rule == undefined)  {
			data = s.substr(i, 1);
			rule = {name: "UNDEFINED"};
		} else {
			change_context(rule.context);
			data = rule.regex.exec(s.substr(i))[0];
		}
		// new_context = yield token(rule.name, data, src, row, col, mode) || rule.context; //throw `No matching rules found for mode: "${mode}" and input: "${s.substr(i, 1)}" in ${src} (${row}, ${col})`;
		// if (new_context !== undefined) change_context(new_context);
		if (!rules.hasOwnProperty(mode)) throw `Undefined mode specified: "${mode}"`;
	}
}


module.exports = {
	lexer: lexer,
	rule: rule,
	token: token
}