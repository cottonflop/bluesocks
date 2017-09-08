let token = function(type, data, src) {
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
let src = "";

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
	if (!s) return;
	return (s[0] == "<") ? context.pop() : context.push(s)
}


let get_context = function() {
	return context.length > 0 ? context.slice(-1)[0] : "default";
}


var lexer = function*(s, src, rules) {
	pos = 0;
	context = [];
	if (Array.isArray(rules)) rules = { default: rules };
	if (s === undefined) return "No string provided!";
	if (src === undefined) return "No source provided!";
	if (rules === undefined) rules = { default: [rule("CHARACTER", /./)] };
	let data = "";
	let new_context = undefined;

	for (let i=0; i < s.length; i+=data.length) {
		[row, col] = pos2d(s.substr(0, i));
		let rule = rules[get_context()].find((x) => (s.substr(i).search(x.regex) == 0));
		if (rule == undefined)  {
			data = s.substr(i, 1);
			rule = {name: "UNDEFINED"};
		} else {
			change_context(rule.context);
			data = rule.regex.exec(s.substr(i))[0];
		}
		yield token(rule.name, data, src);
	}
}


module.exports = {
	lexer: lexer,
	rule: rule,
	token: token
}