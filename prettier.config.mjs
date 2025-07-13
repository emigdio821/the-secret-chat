/** @type {import("prettier").Options} */
/**  @type {import("@ianvs/prettier-plugin-sort-imports").PrettierConfig} */

export default {
  semi: false,
  tabWidth: 2,
  printWidth: 120,
  singleQuote: true,
  endOfLine: 'lf',
  bracketSpacing: true,
  trailingComma: 'all',
  tailwindFunctions: ['cva', 'cn'],
  importOrder: [
    '^(react/(.*)$)|^(react$)',
    '^(next/(.*)$)|^(next$)',
    '<THIRD_PARTY_MODULES>',
    '^types$',
    '^@/types/(.*)$',
    '^@/config/(.*)$',
    '^@/lib/(.*)$',
    '^@/hooks/(.*)$',
    '^@/components/ui/(.*)$',
    '^@/components/(.*)$',
    '^@/styles/(.*)$',
    '^@/app/(.*)$',
    '^(?!.*[.]css$)[./].*$',
    '.css$',
  ],
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  plugins: ['@ianvs/prettier-plugin-sort-imports', 'prettier-plugin-tailwindcss'],
}
