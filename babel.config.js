// Copied from @babel/preset-stage-1 (https://github.com/babel/babel/tree/master/packages/babel-preset-stage-1)
const babelPresetStage1 = () => ({
	plugins: [
		// Stage 1 - Proposal
		require("@babel/plugin-proposal-export-default-from"),
		require("@babel/plugin-proposal-logical-assignment-operators"),
		[
			require("@babel/plugin-proposal-pipeline-operator"),
			{ proposal: "minimal" }
		],
		require("@babel/plugin-proposal-do-expressions"),

		// Stage 2 - Draft
		[require("@babel/plugin-proposal-decorators"), { legacy: true }],
		require("@babel/plugin-proposal-function-sent"),
		require("@babel/plugin-proposal-export-namespace-from"),
		require("@babel/plugin-proposal-numeric-separator"),
		require("@babel/plugin-proposal-throw-expressions"),

		// Stage 3 - Candidate
		require("@babel/plugin-syntax-import-meta"),
		[require("@babel/plugin-proposal-class-properties"), { loose: false }],
		require("@babel/plugin-proposal-json-strings"),

		require("babel-plugin-styled-components"),

		// Optional chaining and nullish coalescing are supported in @babel/preset-env,
		// but not yet supported in webpack due to support missing from acorn.
		// These can be removed once webpack has support.
		// See https://github.com/facebook/create-react-app/issues/8445#issuecomment-588512250
		require("@babel/plugin-proposal-optional-chaining"),
		require("@babel/plugin-proposal-nullish-coalescing-operator")
	]
});

module.exports = function (api) {
	const prod = api.env("production"),
		dev = api.env("development"),
		test = api.env("test");

	if (!prod) {
		api.cache(true);
	}

	const presets = [
		"@babel/preset-flow",

		[
			"@babel/preset-react",
			{
				development: dev,
				useBuiltIns: true
			}
		],

		[
			"@babel/preset-env",
			{
				modules: test ? "commonjs" : false,
				useBuiltIns: "usage",
				corejs: 3,
				exclude: ["transform-typeof-symbol"]
			}
		],

		[babelPresetStage1, { decoratorsLegacy: true }]
	];

	let plugins = [
		// plugins to include
	]
		.concat(
			prod
				? [
						// production only
						"@babel/plugin-transform-react-constant-elements",
						"@babel/plugin-transform-react-inline-elements",
						"babel-plugin-transform-react-pure-class-to-function",
						"babel-plugin-transform-react-remove-prop-types"
				  ]
				: dev
				? [
						// development only
						"react-hot-loader/babel"
				  ]
				: [
						// test only
				  ]
		)
		.filter(Boolean);

	return {
		presets,
		plugins
	};
};
