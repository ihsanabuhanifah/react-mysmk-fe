module.exports = {
  mode: "jit",
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      height: {
        "1/12": "8.3%",
        "2/12": "16.6%",
        "3/12": "24.9%",
        "9/12": "91.7%",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        customGreen: "#18A558",
      },
      backgroundImage: {
        'imageBackground': "url('/src/image/ppdb/backgorund.png')",
        'backgroundSection':"url('/src/image/ppdb/backgroundSection.png)",
        'imageAbstrak':"url('/src/image/ppdb/abstrak.png')",
        'backgroundFooter':"url('/src/image/ppdb/backgroundFooter.png')"
        // tambahkan lebih banyak gambar sesuai kebutuhan
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
  ],
};
