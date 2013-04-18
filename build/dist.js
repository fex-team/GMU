(function() {
	"use strict";

	var Q = require('q'),
		file = require("./util/file"),
		helper = require("./util/helper"),
		config = require("./config").dist;

	function concatZepto() {
		var opt = config.zepto,
			dest = opt.dest,
			files = opt.files;

		files = files
			.split(" ")
			.map(function(file) {
				return opt.path + file + '.js';
			});

		file.concat(files, dest, opt.banner);

		console.log('生成' + dest + '成功。 大小：'+ file.caculateSize(dest));
	}

	function minifyZepto() {
		var opt = config.zepto,
			minDest = opt.dest.replace(/\.js$/, '.min.js');

		file.write(minDest, opt.banner + '\n' + file.minify(opt.dest));
		console.log('生成' + minDest + '成功。 大小：' + file.caculateSize(minDest));
	}

	function exportZepto( exclude ){
		
	}

	//提供直接调用
	var run = exports.run = function() {
		var exclude = this.exclude;

		return Q
			.try(concatZepto)
			.then(minifyZepto)
			.then(helper.curry(exportZepto, exclude));
	};

	//标记是一个task
	exports.task = true;


	exports.init = function(cli) {
		cli.option('-X, --exclude <files...>', '在打包GMU的时候，可以通过此Option来过滤掉不需要的文件，格式与glob一致');

		cli.command('dist')
			.description('合并代码并采用uglify压缩代码')
			.action(run.bind(cli));
	};

})();