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
        useBuiltIns: true,
        runtime: "automatic" // jsx transform
      }
    ],

    [
      "@babel/preset-env",
      {
        modules: test ? "commonjs" : false,
        shippedProposals: true,
        useBuiltIns: "usage",
        corejs: 3,
        exclude: ["transform-typeof-symbol"],
        bugfixes: true
      }
    ]
  ];

  let plugins = [
    // plugins to include
    "babel-plugin-styled-components"
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
            "react-refresh/babel"
          ]
        : [
            // test only
          ]
    )
    .filter(Boolean);

  return {
    presets,
    plugins,
    compact: false
  };
};
