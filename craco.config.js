const path = require('path');

// craco.config.js
module.exports = {
    style: {
      postcss: {
        plugins: [
          require('tailwindcss'),
          require('autoprefixer'),
        ],
      },
    },
    webpack: {
      alias: {
        'date-fns': path.resolve(__dirname, 'node_modules/date-fns'),
      },
    },
  }