/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        valDark: '#0F1923',
        valCard: '#1B2733',
        valCardHover: '#233242',
        valAccent: '#FF4655',
        valAccentDark: '#E03645',
        valMuted: '#8B97A3',
        valBorder: '#27384A',
        valBorderSubtle: '#1F2D3C',
      },
      fontFamily: {
        rajdhani: ['Rajdhani', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
      },
      transitionDuration: {
        DEFAULT: '180ms',
      }
    },
  },
  plugins: [],
}
