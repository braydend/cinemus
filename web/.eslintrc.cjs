module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'plugin:react/recommended',
    "plugin:react/jsx-runtime",
    'standard-with-typescript',
      'prettier'
  ],
  overrides: [
  ],
  ignorePatterns: ["node_modules", "dist"],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
          "project": ["./tsconfig.json", "./tsconfig.node.json"]
  },
  plugins: [
    'react',
      'prettier'
  ],
  rules: {
    'prettier/prettier': "error",
    "@typescript-eslint/naming-convention": "warn",
    "@typescript-eslint/no-floating-promises": ["error", { "ignoreIIFE": true }]
  }
}
