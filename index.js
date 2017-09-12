let token = function(type, data) {
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
let pos=0, row=1, col=1;
let src = undefined;

let pos2d = function(s) {
	lines = s.split(/(?=\n)/);
	row = lines.length;
	col = lines[lines.length - 1].length + 1
	return [row, col];
}


let rule = function(name, regex, context) {
	return { name: name, regex: regex, context: context };
}

let default_rule = { name: "UNDEFINED", regex: /./ };
let next_token = token(default_rule.name, "");

let change_context = function(s) {
	if (!s) return;
	return (s[0] == "<") ? context.pop() : context.push(s)
}


let get_context = function() {
	return context.length > 0 ? context.slice(-1)[0] : "default";
}


var lexer = function*(s, src_in, rules) {
	src = src_in;
	pos = 0;
	context = [];
	next_token = token(default_rule.name, "");

	if (Array.isArray(rules)) rules = { default: rules };
	rules = rules || { default: [rule("CHARACTER", /./)] };
	
	if (s === undefined) return "No string provided!";
	if (src === undefined) return "No source provided!";

	for (let i=0; i < s.length; i+=next_token.data.length) {
		[row, col] = pos2d(s.substr(0, i));
		let rule = rules[get_context()].find((x) => (s.substr(i).search(x.regex) == 0)) || default_rule;
		change_context(rule.context);
		next_token = token(rule.name, rule.regex.exec(s.substr(i))[0]);
		yield next_token;
	}
}


module.exports = {
	lexer: lexer,
	rule: rule,
	token: token
}