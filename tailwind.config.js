/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: { navy: '#0c3746', teal: '#1b8a87', mint: '#e8f5ef', cream: '#fbfaf6' },
      fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui'], display: ['DM Sans', 'ui-sans-serif', 'system-ui'] },
      boxShadow: { soft: '0 18px 45px rgba(12, 55, 70, 0.10)' },
    },
  },
  plugins: [],
}
