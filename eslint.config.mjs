import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Vendored agent tooling — third-party scripts, not project source. They are
    // gitignored but still sit in the working tree, so ESLint would otherwise
    // report ~140 warnings that no one here can act on.
    ".claude/**",
    ".agents/**",
  ]),
]);

export default eslintConfig;
