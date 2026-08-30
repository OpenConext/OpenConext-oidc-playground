import js from "@eslint/js";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";

export default [
  { ignores: ["dist", "build", "coverage"] },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: { jsx: true }
      },
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    settings: {
      react: { version: "19.2.8" }
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.flat.recommended.rules,
      ...react.configs.flat["jsx-runtime"].rules,
      ...reactHooks.configs["recommended-latest"].rules,
      "no-unused-vars": ["error", { argsIgnorePattern: "^_$" }],
      "react-refresh/only-export-components": [
        "warn",
        {
          allowConstantExport: true,
          // mobx-react's observer() HOC isn't in the plugin's default allowlist (memo/forwardRef/lazy)
          extraHOCs: ["observer"],
          // small pure helpers co-located with (and unit-tested alongside) their component
          allowExportNames: ["sanitizeGrantTypeOptions", "sanitizeResponseTypeOptions", "computeFixedValues"]
        }
      ],
      "react/prop-types": "off"
    }
  },
  {
    files: ["src/__tests__/**/*.{js,jsx}", "src/setupTests.js"],
    languageOptions: {
      globals: {
        ...globals.vitest
      }
    }
  }
];
