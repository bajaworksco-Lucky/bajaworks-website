/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{astro,html,js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#0D0D0B",
        sand: "#C4A070",
        bark: "#8B6D4F",
        ember: "#E8753A",
        sage: "#8B9E6B",
        linen: "#FAF7F1",
        warmDark: "#2A2520",
      },
      fontFamily: {
        display: ["'Bebas Neue'", "sans-serif"],
        body: ["'Outfit'", "sans-serif"],
      }
    }
  },
  plugins: []
};
