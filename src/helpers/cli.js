/* eslint-disable */
const unescapeArgument = (arg, mode) => {
	const singleQuoted = arg[0] === "'" && arg[arg.length - 1] === "'";
	const doubleQuoted =
		!singleQuoted && arg[0] === '"' && arg[arg.length - 1] === '"';
	if (!singleQuoted && !doubleQuoted) return arg;
	arg = arg.slice(1, -1); // remove quotes
	if (mode === "posix") {
		if (singleQuoted) arg = arg.replace(/'"'"'/g, "'");
		else if (doubleQuoted) arg = arg.replace(/"'"'"/g, '"');
		arg.replace(/\/\n/g, ""); // remove shell new lines
	} else {
		arg = arg.replace(/""/g, '"');
		arg.replace(/\^\n/g, ""); // remove shell new lines
	}
	return arg;
};

const posixOptionsRegex = /(--?[a-zA-Z-]+)|('([^']|'"'"')*')|("([^"]|"'"'")*")|([^\s]|\\\n)+/gm;
const winOptionsRegex = /(--[a-zA-Z-]+ ".*?")|(--[a-zA-Z-]+)|(-[a-zA-Z-]+? ".+?")|('?[a-z]+:\/\/.*?'+?)|("?[a-z]+:\/\/.*?"+?)/g;
const test = (command, mode) => {
	const matches = command.match(
		mode === "posix" ? posixOptionsRegex : winOptionsRegex
	);
	const result = matches
		.slice(1) // skip curl
		.filter(mode === "posix" ? x => x !== "\\" : x => x !== "^") // remove alone new lines indicators
		.map(x => unescapeArgument(x, mode))
		.map(x => (x[0] === "'" && x[x.length - 1] === "'" ? x.slice(1, -1) : x));
	console.log(result);
};

test(
	`curl -Q 'don'"'"'t escape' -F 'file=@cooltext.txt' -F \\
"yourname=Daniel"  \\
-B break\\
line \\
-F 'filedescription=Cool text file with \\
cool text inside' http://www.post.com/postit.cgi`,
	"posix"
);

const escapeArgument = (arg, mode) =>
	/^[-/\w]+$/i.test(arg)
		? arg
		: mode === "win"
		? `"${arg.replace(/"/g, '""')}"`
		: `'${arg.replace(/'/g, "'\"'\"'")}'`.replace(/''/g, "");

const getVector = (line, mode) => {
	//const start =

	return line
		.split(mode === "posix" ? "\\\n" : "^\n")
		.join("")
		.split(" ")
		.slice(1) //skip command
		.map(arg => unescapeArgument(arg, mode));
};

const SUPPORTED_MODES = ["win", "posix"];
const parse = (
	commandLine,
	{
		mode = "posix", // posix / win
		booleanKeys = [],
		multiKeys = [], // aggregated arguments
		allowEqualsSign = false // --key=value
	} = {}
) => {
	if (!SUPPORTED_MODES.includes(mode)) {
		throw new Error(`mode must be one of ${JSON.stringify(SUPPORTED_MODES)}`);
	}

	if (typeof commandLine === "string") {
		commandLine = getVector(commandLine, mode);
	}
	let lastArg;

	return commandLine.reduce(
		(result, arg) => {
			const isKey = arg[0] === "-";

			if (lastArg && result[lastArg] === undefined) {
				if (multiKeys.includes(lastArg)) {
					if (Array.isArray(result[lastArg])) {
						result[lastArg].push(arg);
					} else {
						result[lastArg] = [arg];
					}
				} else {
					result[lastArg] = arg;
				}
				return result;
			}

			if (isKey) {
				if (
					arg.length > 1 &&
					arg[1] !== "-" &&
					arg
						.substr(1)
						.split("")
						.every(arg => booleanKeys.includes(arg))
				) {
					arg
						.substr(1)
						.split("")
						.forEach(key => {
							result[key] = !result[key]; // alternate
						});
				} else if (allowEqualsSign) {
					lastArg = arg.replace(/^--?/, "").split("=");
					result[lastArg[0]] = lastArg.length > 1 ? lastArg[1] : undefined;
				} else {
					lastArg = arg.replace(/^--?/, "");
					result[lastArg] = undefined;
				}
			} else {
				result._args.push(arg);
			}
			return result;
		},
		{ _args: [] }
	);
};

console.log(
	parse(
		`curl -F "file=@cooltext.txt" -F "yourname=Daniel" \\
  -F "filedescription=Cool text file with cool text inside" \\
  http://www.post.com/postit.cgi`,
		{ multiKeys: ["F"] }
	)
);

//splitCommandLine( 'param1   "   param   2" param""3 "param "" 4  " "param 5' ) ;

log("argv", process.argv.slice(2));

function log(n, v) {
	console.log(n, v);
	//console.dir( v ) ;
	//console.log() ;
}

function splitCommandLine(commandLine) {
	log("commandLine", commandLine);

	//  Find a unique marker for pairs of double-quote characters.
	//  Start with '<DDQ>' and repeatedly append '@' if necessary to make it unique.
	var doubleDoubleQuote = "<DDQ>";
	while (commandLine.indexOf(doubleDoubleQuote) > -1) doubleDoubleQuote += "@";

	//  Replace all pairs of double-quotes with above marker.
	var noDoubleDoubleQuotes = commandLine.replace(/""/g, doubleDoubleQuote);

	log("noDoubleDoubleQuotes", noDoubleDoubleQuotes);

	//  As above, find a unique marker for spaces.
	var spaceMarker = "<SP>";
	while (commandLine.indexOf(spaceMarker) > -1) spaceMarker += "@";

	//  Protect double-quoted strings.
	//   o  Find strings of non-double-quotes, wrapped in double-quotes.
	//   o  The final double-quote is optional to allow for an unterminated string.
	//   o  Replace each double-quoted-string with what's inside the qouble-quotes,
	//      after each space character has been replaced with the space-marker above;
	//      and each double-double-quote marker has been replaced with a double-
	//      quote character.
	//   o  The outer double-quotes will not be present.
	var noSpacesInQuotes = noDoubleDoubleQuotes.replace(
		/"([^"]*)"?/g,
		(fullMatch, capture) => {
			return capture
				.replace(/ /g, spaceMarker)
				.replace(RegExp(doubleDoubleQuote, "g"), '"');
		}
	);

	log("noSpacesInQuotes", noSpacesInQuotes);

	//  Now that it is safe to do so, split the command-line at one-or-more spaces.
	var mangledParamArray = noSpacesInQuotes.split(/ +/);

	log("mangledParamArray", mangledParamArray);

	//  Create a new array by restoring spaces from any space-markers. Also, any
	//  remaining double-double-quote markers must have been from OUTSIDE a double-
	//  quoted string and so are removed.
	var paramArray = mangledParamArray.map(mangledParam => {
		return mangledParam
			.replace(RegExp(spaceMarker, "g"), " ")
			.replace(RegExp(doubleDoubleQuote, "g"), "");
	});

	log("paramArray", paramArray);

	return paramArray;
}
