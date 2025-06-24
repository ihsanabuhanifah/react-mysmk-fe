

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
        btnCustom: "#32CD32",
      },
      backgroundImage: {
        'imageBackground': "url('/src/image/ppdb/backgorund.png')",
        'backgroundSection':"url('/src/image/ppdb/backgroundSection.png)",
        'imageAbstrak':"url('/src/image/ppdb/abstrak.png')",
        'backgroundFooter':"url('/src/image/ppdb/backgroundFooter.png')",
        'parallax':"url('/src/image/ppdb/parallax.png')",
        'backgroundBaru':"url('/src/image/ppdb/backgroundbaru.png')",
        'backgroundbawah':"url('/src/image/ppdb/backgroundbawah.png')"
        // tambahkan lebih banyak gambar sesuai kebutuhan
      },
      
      fontSize: {
        'title': ['clamp(3rem, 14vw, 9rem)'],
        'heading-1': ['clamp(2.5rem, 6.5vw, 10rem)'],
        'heading-2': ['clamp(2.4rem, 8vw, 10rem)'],
        'heading-3': ['clamp(2rem, 5vw, 2.75rem)'], 
        'special': ['clamp(2rem, 4vw, 3.25rem)'],
        'works-title': ['clamp(1.25rem, 2vw, 1.5rem)'],
        'body-1': ['clamp(1.1rem, 2vw, 1.3rem)'], 
        'body-2': ['clamp(1rem, 1.5vw, 1.5rem)'],
        'body-3': '1.1rem',
        'body-4': ['clamp(0.75rem, 3vw, 1rem)'],
      },
      borderRadius: {
        'custom-30': '30px',
        'custom-50': '50px',
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