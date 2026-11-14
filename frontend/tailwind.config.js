/** @type {import('tailwindcss').Config} */

function colorWithAlpha(varName, fallbackHex) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${varName}-rgb), ${opacityValue})`;
    }
    return `var(${varName}, ${fallbackHex})`;
  };
}

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: colorWithAlpha('--color-bg', '#0A0A0B'),
        surface: colorWithAlpha('--color-surface', '#141416'),
        'surface-hover': colorWithAlpha('--color-surface-hover', '#1D1D21'),
        border: colorWithAlpha('--color-border', '#2A2A2E'),
        'border-subtle': colorWithAlpha('--color-border-subtle', '#202024'),
        red: colorWithAlpha('--color-red', '#FF4655'),
        'red-hover': colorWithAlpha('--color-red-hover', '#FF5E6C'),
        yellow: colorWithAlpha('--color-yellow', '#FFD23F'),
        'yellow-hover': colorWithAlpha('--color-yellow-hover', '#FFE071'),
        text: colorWithAlpha('--color-text', '#F2EFE9'),
        muted: colorWithAlpha('--color-muted', '#9A9AA2'),

        // Compatibility aliases mapping to the new palette
        valDark: colorWithAlpha('--color-bg', '#0A0A0B'),
        valCard: colorWithAlpha('--color-surface', '#141416'),
        valCardHover: colorWithAlpha('--color-surface-hover', '#1D1D21'),
        valAccent: colorWithAlpha('--color-red', '#FF4655'),
        valAccentDark: colorWithAlpha('--color-red-hover', '#FF5E6C'),
        valText: colorWithAlpha('--color-text', '#F2EFE9'),
        valMuted: colorWithAlpha('--color-muted', '#9A9AA2'),
        valBorder: colorWithAlpha('--color-border', '#2A2A2E'),
        valBorderSubtle: colorWithAlpha('--color-border-subtle', '#202024'),
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
