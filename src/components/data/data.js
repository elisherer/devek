import support from "helpers/support";

// Each action is of the form Func<Array|String> -> Array|String
const actions = {
	Split: {
		description: "Split each item (as string) by a specified separator",
		parameters: { By: "string" },
		defaults: { By: "" }
	},

	Wrap: {
		description:
			"Wrap each item with a prefix and suffix (e.g. quotes, commas, etc)",
		parameters: { Prefix: "string", Suffix: "string" },
		defaults: { Prefix: "", Suffix: "" }
	},

	ChangeCase: {
		description: "Change case of strings",
		parameters: { Case: ["Uppercase", "Lowercase"] },
		defaults: { Case: "Uppercase" }
	},

	Replace: {
		description:
			"Replace each item using a regular expression and substitution expression",
		parameters: {
			Pattern: "string",
			Flags: support.RegExpFlags,
			Substitution: "string"
		},
		defaults: { Pattern: "", Flags: ["g", "i"], Substitution: "" }
	},

	Filter: {
		description:
			"Filter items that do/don't match the specified regular expression",
		parameters: {
			Pattern: "string",
			Flags: support.RegExpFlags,
			Remove: ["Matching", "Non Matching"]
		},
		defaults: { Pattern: "", Flags: ["g", "i"], Remove: "Matching" }
	},

	"Remove Empty": {
		description: "Remove items that have a falsy value (e.g. '', null, etc)",
		parameters: null
	},

	"Remove New-Lines": {
		description: "Remove \\n & \\r from strings",
		parameters: null
	},

	Sort: {
		description: "Sort the items by a specified type and order",
		parameters: { Type: ["Text", "Number"], Order: ["Asc", "Desc"] },
		defaults: { Type: "Text", Order: "Asc" }
	},

	Join: {
		description: "Join all items with a specified separator",
		parameters: { With: "string" },
		defaults: { With: "" }
	},

	Concat: {
		description: "Concat all items as strings",
		parameters: null
	},

	Sum: {
		description: "Summarize all items as numbers",
		parameters: null
	},

	Product: {
		description: "Multiply all items as numbers",
		parameters: null
	}
};

export { actions };
