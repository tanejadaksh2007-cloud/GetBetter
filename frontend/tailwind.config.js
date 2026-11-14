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
        valCardHover: '#223242',
        valAccent: '#FF4655',
        valAccentDark: '#E03645',
        valText: '#ECE8E1',
        valMuted: '#8B97A3',
        valBorder: '#27384A',
        valBorderSubtle: '#1C2936',
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
