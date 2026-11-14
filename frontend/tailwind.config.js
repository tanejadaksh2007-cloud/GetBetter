/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        'surface-hover': 'var(--color-surface-hover)',
        border: 'var(--color-border)',
        'border-subtle': 'var(--color-border-subtle)',
        red: {
          DEFAULT: 'var(--color-red)',
          hover: 'var(--color-red-hover)',
        },
        yellow: {
          DEFAULT: 'var(--color-yellow)',
          hover: 'var(--color-yellow-hover)',
        },
        text: 'var(--color-text)',
        muted: 'var(--color-muted)',
      },
      fontFamily: {
        rajdhani: ['Rajdhani', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      transitionDuration: {
        DEFAULT: '150ms',
      }
    },
  },
  plugins: [],
}
