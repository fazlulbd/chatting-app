/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {
      fontFamily: {
        nunito: ['Nunito', "sans-serif"]
      },
      colors:{
        primary: "#5f35f5"
      }
    },
  },
  plugins: [],
}

