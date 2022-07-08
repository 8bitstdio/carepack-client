module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      zIndex: {
        "1000": 1000,
        "2000": 2000,
        "3000": 3000,
      },
      width: {
        "400": "400px",
      },
      minWidth: {
        "400": "400px",
        "500": "500px",
      }
    },
  },
  plugins: [],
}