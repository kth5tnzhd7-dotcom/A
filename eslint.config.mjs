import nextConfig from "eslint-config-next";

const eslintConfig = [
  ...nextConfig,
  {
    ignores: ["node_modules/**", ".open-next/**", "build/**", "dist/**"],
  },
];

export default eslintConfig;
