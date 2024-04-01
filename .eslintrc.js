module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true
  },
  extends: "standard",
  overrides: [
    {
      env: {
        node: true
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script"
      }
    }
  ],
  parserOptions: {
    ecmaVersion: "latest"
  },
  rules: {
    quotes: "off",
    semi: "off",
    "import/no-unresolved": "error",
    "import/no-extraneous-dependencies": ["error"],
    "comma-dangle": "off",
    "space-before-function-paren": "off",
  }
};
