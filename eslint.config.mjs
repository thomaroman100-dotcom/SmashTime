import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  {
    // Loses lokales Debug-Skript (untracked, siehe SECURITY_NOTES.md) –
    // gehört nicht zum Anwendungscode und wird nicht gelintet.
    ignores: ["supabase-temp.js"]
  },
  ...nextVitals,
  ...nextTypescript
];

export default eslintConfig;
