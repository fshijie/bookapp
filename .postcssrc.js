// https://github.com/michael-ciniawsky/postcss-load-config


module.exports = {
  plugins: [
      require('postcss-import'),
      require('postcss-url'),
      require('tailwindcss'),
      // to edit target browsers: use "browserslist" field in package.json
      require('autoprefixer'),
      // require('postcss-custom-unit')({
      //     includePath: /.vue$/,
      //     units: [{
      //         from: 'ux',
      //         convert: function (val) {
      //             return (val / 16) + 'rem'
      //         }
      //     }]
      // })
  ]
};

