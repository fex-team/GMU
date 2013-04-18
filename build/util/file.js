(function() {
	"use strict";

	var fs = require("fs"),
		path = require("path"),
		FILE_ENCODING = 'utf-8';

	function callEach(args, cb) {
		var ret;
		args = Array.isArray(args) ? args : [args];
		ret = args.map(cb);
		return ret.length > 1 ? ret : ret[0];
	}

	//合并多个文件

	function concat(files, dest, banner, separator) {
		var contents;

		banner = banner || '';
		separator = separator || '\n';

		contents = read(files.filter(function(file) {

			//过滤掉不存在的文件
			return exists(file);
		}));

		mkdir(path.dirname(dest)); //确保文件夹存在

		//写入目标文件
		write(dest, banner + separator + contents.join(separator));
	}

	//用uglify压缩文件

	function minify(files, options) {
		var uglify = require('uglify-js');

		return uglify.minify(files, options).code;
	}

	//如果文件夹不存在，尝试创建它

	function mkdir(dirPaths, mode) {
		return callEach(dirPaths, function(dirPath) {
			var paths,
			subpath;

			// Set directory mode in a strict-mode-friendly way.
			/*jshint eqnull:true */
			if (mode == null) {
				mode = parseInt('0777', 8) & (~process.umask());
			}

			paths = dirPath.split(/[\/\\]/g).reduce(function(parts, part) {
				parts += path.sep + part;
				subpath = path.resolve(parts);

				if (!exists(subpath)) {

					try {
						fs.mkdirSync(subpath, mode);
					} catch (e) {
						throw new Error("创建目录\"" + subpath + "\"失败(错误代码：" + e.code + ")");
					}
				}
				return parts;
			});
		});
	}

	function caculateSize(files) {
		return callEach(files, function(file) {
			var size = fs.statSync(file).size,
				units = ['B', 'KB', 'MB', 'TB'],
				unit = units.shift();

			while (size > 1024 && units.length) {
				unit = units.shift();
				size = size / 1024;
			}

			return size.toFixed(2) + ' ' + unit;
		});
	}

	function exists() {
		var filepath = path.join.apply(path, arguments);
		return fs.existsSync(filepath);
	}

	function read(files, file_encoding) {
		return callEach(files, function(file) {
			return fs.readFileSync(file, file_encoding || FILE_ENCODING);
		});
	}

	function write(filename, content, file_encoding) {
		return fs.writeFileSync(filename, content, file_encoding || FILE_ENCODING);
	}

	//expose
	exports.concat = concat;
	exports.minify = minify;
	exports.mkdir = mkdir;
	exports.caculateSize = caculateSize;
	exports.exists = exists;
	exports.read = read;
	exports.write = write;

})();