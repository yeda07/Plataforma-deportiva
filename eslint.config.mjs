import js from "@eslint/js";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import tseslint from "typescript-eslint";

const nextConfig = [...nextCoreWebVitals, ...nextTypescript].map((config) => ({
  ...config,
  files: ["apps/web/**/*.{js,jsx,ts,tsx}"]
}));

const typedTypeScriptConfig = [
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked
].map((config) => ({
  ...config,
  files: ["**/*.{ts,tsx}"]
}));

export default tseslint.config(
  {
    ignores: [
      "**/.next/**",
      "**/dist/**",
      "**/node_modules/**",
      "**/coverage/**",
      "pnpm-lock.yaml"
    ]
  },
  js.configs.recommended,
  ...typedTypeScriptConfig,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        project: [
          "./apps/web/tsconfig.json",
          "./packages/ui/tsconfig.json",
          "./packages/contracts/tsconfig.json",
          "./packages/validation/tsconfig.json",
          "./packages/config/tsconfig.json"
        ],
        tsconfigRootDir: import.meta.dirname
      }
    },
    rules: {
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          "prefer": "type-imports",
          "fixStyle": "inline-type-imports"
        }
      ]
    }
  },
  ...nextConfig
);
