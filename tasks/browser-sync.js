var browserSync = require('browser-sync');

module.exports = function (gulp, plugins, options) {
  return function _browserSync () {
    browserSync({
      //logLevel: 'debug',
      //logPrefix: 'eh',
      server: {
        baseDir: options.dest,
        routes: {
            '/': 'index.html'
        }
      }
    });
    //TODO remove from 'api'?!
    //plugins.watch
  };
};
