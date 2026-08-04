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
    // Git worktrees for parallel agent work live inside the repo. Linting them
    // re-lints a whole second copy of the source and fails the pre-commit gate
    // on somebody else's work-in-progress.
    ".claude/worktrees/**",
  ]),
]);

export default eslintConfig;
