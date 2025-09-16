module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  plugins: ["import", "unused-imports"],
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    // 1. Import order
    "import/order": [
      "error",
      {
        groups: [
          "builtin",
          "external",
          ["internal", "parent", "sibling", "index"],
        ],
        pathGroups: [
          {
            pattern: "react",
            group: "builtin",
            position: "before",
          },
          {
            pattern: "react-native",
            group: "builtin",
            position: "before",
          },
          {
            pattern: "@/**",
            group: "internal",
            position: "after",
          },
        ],
        pathGroupsExcludedImportTypes: ["react", "react-native"],
        "newlines-between": "always",
        alphabetize: { order: "asc", caseInsensitive: true },
      },
    ],
    // 2. Unused imports and variables
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "warn",
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_",
      },
    ],
    // 3. Disable exhaustive-deps for React hooks
    "react-hooks/exhaustive-deps": "off",
  },
  overrides: [
    {
      files: ["src/**/*.{js,jsx,ts,tsx}"],
      rules: {
        "import/order": [
          "error",
          {
            groups: [
              "type",
              "react",
              "react-native",
              "internal",
              "parent",
              "sibling",
              "index",
              "external",
            ],
            pathGroups: [
              {
                pattern: "react",
                group: "react",
                position: "before",
              },
              {
                pattern: "react-native",
                group: "react-native",
                position: "before",
              },
              {
                pattern: "@/src/components",
                group: "internal",
                position: "before",
              },
              {
                pattern: "@/src/constants",
                group: "internal",
                position: "before",
              },
              {
                pattern: "@/assets/**",
                group: "internal",
                position: "before",
              },
            ],
            pathGroupsExcludedImportTypes: ["react", "react-native"],
            "newlines-between": "always",
            alphabetize: { order: "asc", caseInsensitive: true },
          },
        ],
        "unused-imports/no-unused-imports": "error",
        "unused-imports/no-unused-vars": [
          "warn",
          {
            vars: "all",
            varsIgnorePattern: "^_",
            args: "after-used",
            argsIgnorePattern: "^_",
          },
        ],
        "react-hooks/exhaustive-deps": "off",
      },
    },
  ],
};
