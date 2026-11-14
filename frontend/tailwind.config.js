/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        valDark: '#0f1722',
        valCard: '#182333',
        valCardHover: '#1f2e42',
        valRed: '#ff4655',
        valRedDark: '#cc3542',
        valGold: '#ece8e1',
        valTeal: '#00e5bf',
        valMuted: '#8b9bb4'
      }
    },
  },
  plugins: [],
}
