let token = function(type, data, src, row, col, mode) {
	return {
		type: type,
		data: data,
		src: src,
		row: row,
		col: col,
		mode: mode
	}
}

let pos2d = function(s) {
	lines = s.split(/(?=\n)/);
	row = lines.length;
	col = lines[lines.length - 1].length + 1
	return [row, col];
}

let rule = function(name, regex) {
	return { name: name, regex: regex };
}


var lexer = function*(s, src, rules, mode = "default") {
	if (Array.isArray(rules)) rules = { default: rules };
	if (s === undefined) return "No string provided!";
	if (src === undefined) return "No source provided!";
	if (rules === undefined) rules = { default: [rule("CHARACTER", /./)] };
	let pos = 0;
	let row = 1;
	let col = 1;
	let adv = 1;
	let newmode = undefined;

	for (let i=0; i < s.length; i+=adv) {
		let match = -1;
		let rule = rules[mode].find((x) => (s.substr(i).search(x.regex) == 0));
		let found = rule.regex.exec(s.substr(i));
		if (found == null) return "Something extremely weird happened.";
		[row, col] = pos2d(s.substr(0, i));
		newmode = yield token(rule.name, found[0], src, row, col, mode);
		mode = (newmode !== undefined) ? newmode : mode;
		adv = found[0].length;
	}
}


module.exports = {
	lexer: lexer
}