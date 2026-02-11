import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import * as prettier from "eslint-config-prettier";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: process.cwd(),
      },
    },
    plugins: {
      js,
    },
    extends: [js.configs.recommended],
  },

  ...tseslint.configs.recommended,

  {
    rules: {
      ...(prettier.rules as Record<string, unknown>),
    },
  },
]);
