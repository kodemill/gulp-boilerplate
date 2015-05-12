var _ = require('lodash');
var through = require('through2');
var reload = require('browser-sync').reload;
var File = require('vinyl');

function ejsPrecompiler (opts) {
	var options = _.defaults({}, opts, {
		standalone: 'Component',
		bundleName: 'templates.js',
		templateVariable: 'config',
		nameCb: function (file) {
			return file.relative.slice(0, -4);
		}
	});
	var root = options.standalone;
	function definition(file) {
		var def = root + '.' + options.nameCb(file) + '=';
		def += _.template(file.contents.toString(), {}, {variable: options.templateVariable}) + ';';
		return def;
	}
	function createJs(defs) {
		var js = 'window.' + root + '={};';
		return js + defs.join('');
	}	
	var definitions = [];
	function transform (src, enc, cb) {
		definitions.push(definition(src));
		return cb(null,null);
	}
	function flush (cb) {
		var bundle = new File({
			cwd: __dirname,
			base: '/',
			path: '/' + options.bundleName
		});
		bundle.contents = new Buffer(createJs(definitions));
		this.push(bundle);
		cb();
	}
	return through.obj(transform, flush);
}


module.exports = function ejsTaskFactory(gulp, plugins, options) {
	
	var watching;
	return function ejsBuild () {
		if (options.watch && global._WATCH && !watching) {
			plugins.watch(options.src, function(){
				gulp.start(options.name);
			});
			watching = true;
			plugins.util.log(plugins.util.colors.black.bgGreen('watching ejs to rebundle: '),
				plugins.util.colors.magenta(options.src));
		}
		return gulp.src(options.src)
			.pipe(ejsPrecompiler(options))
      .pipe(plugins.if(global._PRODUCTION, plugins.uglify()))
			.pipe(reload({stream: true}))
      .pipe(plugins.size({
        showFiles: true,
        title: options.name
      }))
      .pipe(gulp.dest(options.dest));
			
	};
};