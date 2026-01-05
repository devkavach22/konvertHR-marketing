/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#E42128",
      },
      fontFamily: {
        arvo: ['Arvo', 'serif'],
        open: ['Open Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
