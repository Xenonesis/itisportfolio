import next from "eslint-config-next";

/**
 * Next.js 16+ ships `eslint-config-next` as an ESLint *flat config*.
 * We extend it here and apply small project-specific overrides.
 */
const eslintConfig = [
  ...next,
  {
    rules: {
      "@next/next/no-img-element": "off",
      "react-hooks/set-state-in-effect": "off",
    },
  },
];

export default eslintConfig;
