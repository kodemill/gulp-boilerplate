var del = require('del');

module.exports = function (gulp, plugins, options) {
  return function clean (callback) {
    del(options.src, callback);
  };
};
