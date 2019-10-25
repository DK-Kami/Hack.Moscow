const fs = require('fs');

if (process.env.NODE_ENV === 'development') {
  module.exports = {
    devServer: {
      host: 'vdooh.dev',
      port: 8080,
      https: {
        key: fs.readFileSync(process.env.SSL_KEY),
        cert: fs.readFileSync(process.env.SSL_CERT)
      }
    },

    configureWebpack: {
      devtool: 'source-map'
    },
    transpileDependencies: [
      'vuetify',
    ],

    productionSourceMap: false
  }
}
else {
  module.exports = {
    transpileDependencies: [
      'vuetify',
    ],
  };
}
