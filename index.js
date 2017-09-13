let token = function(type, data) {
	return {
		type: type,
		data: data,
		src: src,
		row: row,
		col: col,
		scope: scope.join(".")
	}
}

let scope = [];
let pos=0, row=1, col=1;
let src = undefined;

let pos2d = function(s) {
	lines = s.split(/(?=\n)/);
	row = lines.length;
	col = lines[lines.length - 1].length + 1
	return [row, col];
}


let rule = function(name, regex, scope) {
	return { name: name, regex: regex, scope: scope };
}

let default_rule = { name: "UNDEFINED", regex: /./ };
let next_token = token(default_rule.name, "");

let change_scope = function(s) {
	if (!s) return;
	return (s[0] == "<") ? scope.pop() : scope.push(s)
}


let get_scope = function() {
	return scope.length > 0 ? scope.slice(-1)[0] : "default";
}


var lexer = function*(s, src_in, rules) {
	src = src_in;
	pos = 0;
	scope = [];
	next_token = token(default_rule.name, "");
	change_scope("default");
	if (Array.isArray(rules)) rules = { default: rules };
	rules = rules || { default: [rule("CHARACTER", /./)] };
	
	if (s === undefined) return "No string provided!";
	if (src === undefined) return "No source provided!";

	for (let i=0; i < s.length; i+=next_token.data.length) {
		[row, col] = pos2d(s.substr(0, i));
		let rule = rules[get_scope()].find((x) => (s.substr(i).search(x.regex) == 0)) || default_rule;
		change_scope(rule.scope);
		next_token = token(rule.name, rule.regex.exec(s.substr(i))[0]);
		yield next_token;
	}
}


module.exports = {
	lexer: lexer,
	rule: rule,
	token: token
}