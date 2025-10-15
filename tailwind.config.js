import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import aspectRatio from '@tailwindcss/aspect-ratio';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx,jsx,js}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter Variable"', ...defaultTheme.fontFamily.sans]
      },
      colors: {
        brand: {
          50: '#f2f8ff',
          100: '#dceeff',
          200: '#bcdcff',
          300: '#8ac3ff',
          400: '#4ba0ff',
          500: '#1a7fff',
          600: '#005fe6',
          700: '#0047b4',
          800: '#003483',
          900: '#032c66',
          950: '#021b40'
        }
      }
    }
  },
  plugins: [forms, typography, aspectRatio]
};
