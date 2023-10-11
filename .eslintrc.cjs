module.exports = {
  root: true,
  extends: ["prettier", "plugin:react/recommended", "plugin:react-hooks/recommended", "plugin:n/recommended", "standard"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: ["react", "prettier"],
  settings: {
    react: {
      pragma: "React",
      version: "detect"
    }
  },
  globals: {
    __DEV__: false,
    jasmine: false,
    beforeAll: false,
    afterAll: false,
    beforeEach: false,
    afterEach: false,
    test: false,
    expect: false,
    describe: false,
    jest: false,
    it: false
  },
  rules: {
    "no-console": ["warn"],
    quotes: 0,
    camelcase: 0,
    "comma-dangle": 0,
    "multiline-ternary": 0,
    "no-undef": 0,
    "no-unused-vars": 0,
    "no-use-before-define": "off",
    "space-before-function-paren": 0,
    "sort-keys": 0,
    "arrow-parens": 2,
    "generator-star-spacing": ["error", { before: false, after: true }],
    "n/no-unsupported-features/es-syntax": 0,
    "n/no-missing-import": 0,
    "react/no-unescaped-entities": 0,
    "react/prop-types": "off",
    "react/display-name": 0,
    "react/react-in-jsx-scope": 0,
    "react-hooks/exhaustive-deps": 0,
    "react/jsx-key": 0
  }
}
