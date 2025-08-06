/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(240, 100%, 50%)',
        secondary: 'hsl(280, 100%, 50%)',
        accent: 'hsl(320, 100%, 50%)'
      }
    },
  },
  plugins: [],
};