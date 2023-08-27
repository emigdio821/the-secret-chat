/** @type {import("prettier").Options} */
/** @type {import("@ianvs/prettier-plugin-sort-imports").PrettierConfig} */

const config = {
  semi: false,
  tabWidth: 2,
  printWidth: 100,
  singleQuote: true,
  bracketSpacing: true,
  trailingComma: 'all',
  importOrder: [
    '^(react/(.*)$)|^(react$)',
    '^(next/(.*)$)|^(next$)',
    '<THIRD_PARTY_MODULES>',
    '',
    '^types$',
    '^@/env(.*)$',
    '^@/types/(.*)$',
    '^@/config/(.*)$',
    '^@/lib/(.*)$',
    '^@/hooks/(.*)$',
    '^@/components/ui/(.*)$',
    '^@/components/(.*)$',
    '^@/styles/(.*)$',
    '^@/app/(.*)$',
    '',
    '^[./]',
  ],
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  plugins: ['@ianvs/prettier-plugin-sort-imports', 'prettier-plugin-tailwindcss'],
}

module.exports = config
