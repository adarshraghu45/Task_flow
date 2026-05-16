/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        surface: {
          DEFAULT: 'rgb(var(--color-surface) / <alpha-value>)',
          elevated: 'rgb(var(--color-surface-elevated) / <alpha-value>)',
          muted: 'rgb(var(--color-surface-muted) / <alpha-value>)',
        },
        content: {
          DEFAULT: 'rgb(var(--color-content) / <alpha-value>)',
          muted: 'rgb(var(--color-content-muted) / <alpha-value>)',
          inverse: 'rgb(var(--color-content-inverse) / <alpha-value>)',
        },
        border: {
          DEFAULT: 'rgb(var(--color-border) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 24px -4px rgb(0 0 0 / 0.4)',
        glow: '0 0 40px -10px rgb(124 58 237 / 0.35)',
      },
    },
  },
  plugins: [],
};
