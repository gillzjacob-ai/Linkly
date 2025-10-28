import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#6C5CE7',
          dark: '#4834D4',
          light: '#A29BFE',
        },
      },
      boxShadow: {
        glow: '0 0 20px rgba(108, 92, 231, 0.35)',
      },
    },
  },
  plugins: [],
} satisfies Config;
