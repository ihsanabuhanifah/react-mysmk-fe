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
