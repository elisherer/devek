// Copied from @babel/preset-stage-1 (https://github.com/babel/babel/tree/master/packages/babel-preset-stage-1)
const babelPresetStage1 = () => ({
  plugins: [
    // Stage 1 - Proposal
    require("@babel/plugin-proposal-export-default-from"),
    require("@babel/plugin-proposal-logical-assignment-operators"),
    [require("@babel/plugin-proposal-optional-chaining"), { loose: false }],
    [require("@babel/plugin-proposal-pipeline-operator"), { proposal: "minimal" }],
    [require("@babel/plugin-proposal-nullish-coalescing-operator"), { loose: false }],
    require("@babel/plugin-proposal-do-expressions"),

    // Stage 2 - Draft
    [require("@babel/plugin-proposal-decorators"), { legacy: true }],
    require("@babel/plugin-proposal-function-sent"),
    require("@babel/plugin-proposal-export-namespace-from"),
    require("@babel/plugin-proposal-numeric-separator"),
    require("@babel/plugin-proposal-throw-expressions"),

    // Stage 3 - Candidate
    require("@babel/plugin-syntax-dynamic-import"),
    require("@babel/plugin-syntax-import-meta"),
    [require("@babel/plugin-proposal-class-properties"), { loose: false }],
    require("@babel/plugin-proposal-json-strings")
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
    "@babel/preset-react",
    ["@babel/preset-env", {
      "modules": test ? "commonjs" : false,
      "targets": {
        "browsers": ["last 2 versions", "ie > 10"]
      },
      "useBuiltIns": "usage",
      "corejs": 3,
    }],
    [babelPresetStage1, { decoratorsLegacy: true }],
  ];

  let plugins =

    prod ? [
      "@babel/plugin-transform-react-constant-elements",
      "@babel/plugin-transform-react-inline-elements",
      "babel-plugin-transform-react-pure-class-to-function",
      "babel-plugin-transform-react-remove-prop-types"

    ] : dev ? [
      "react-hot-loader/babel"

    ] : [

    ];

  return {
    presets,
    plugins
  };
};