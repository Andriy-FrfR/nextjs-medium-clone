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
        'green-650': '#3d8b3d',
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
