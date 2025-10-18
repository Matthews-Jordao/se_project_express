module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  // Add the necessary extensions.
  extends: ["eslint:recommended", "airbnb-base", "prettier"],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    // Allow _id as an exception for underscore dangle
    "no-underscore-dangle": ["error", { "allow": ["_id"] }],
  },
};
