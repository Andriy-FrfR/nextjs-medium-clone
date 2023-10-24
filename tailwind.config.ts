import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        green: 'rgb(92, 184, 92)',
      },
      fontFamily: {
        sans: ['var(--font-source-sans-3)'],
        titilium: ['var(--font-titillium-web)'],
      },
    },
  },
  plugins: [],
};
export default config;
