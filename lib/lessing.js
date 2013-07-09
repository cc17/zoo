#!/usr/bin/env node

var path = require('path'),
	fs = require('fs'),
	os = require('os'),
	rd = require('../lib/utfreading'),
	less = require('../lib/less');

var files = [];

var options = {
	compress: false,
	yuicompress: false,
	optimization: 1,
	silent: false,
	lint: false,
	paths: [],
	color: true,
	strictImports: false,
	rootpath: '',
	relativeUrls: false
};

var walk = function(uri, files) {

	var stat = fs.lstatSync(uri);
	if (stat.isFile()) {

		switch (path.extname(uri)) {
		case '.less':
			files.less.push({
				filepath:uri,
				filename: path.basename(uri),
				cssfilepath:uri.replace(/\.less$/,'.css')
			});
			break;
		default:
			files.other.push({
				filename:uri
			});
		}
	}
	if (stat.isDirectory()) {
		fs.readdirSync(uri).forEach(function(part) {
			walk(path.join(uri, part), files);
		});
	}
};


// 得到目标数据结构
var doWalk = function(rootDir) {
	var files = {
		less: [],
		other: [] // 暂时没用
	};
	walk(rootDir, files);
	return files;
};

var doParse = function(encoding,afterAll){
	if(files.less.length == 0){
		afterAll();
		return;
	}
	var o = files.less.pop();
	parseLess(o.filepath,o.cssfilepath,doParse,encoding,afterAll);
};


function parseLess(from,to,cb,encoding,afterAll) {

	if(encoding === undefined){
		encoding = 'utf8'
	}

	if(cb === undefined){
		cb = new Function;
	}

	if(afterAll === undefined){
		afterAll = new Function;
	}

	log(green('LESS >> ') + from);

	var data = rd.readStr(from);

	new(less.Parser)({
		paths: [path.dirname(from)].concat(options.paths),
		optimization: options.optimization,
		filename: from,
		rootpath: options.rootpath,
		relativeUrls: options.relativeUrls,
		strictImports: options.strictImports,
		dumpLineNumbers: options.dumpLineNumbers
	}).parse(data, function (err, tree) {
		if (err) {
			less.writeError(err, options);
			currentErrorcode = 1;
			cb(encoding,afterAll);
			return;
		} else if(!options.lint) {
			try {
				var css = tree.toCSS({
					compress: options.compress,
					yuicompress: options.yuicompress
				});
				// ensureDirectory(to);
				fs.writeFileSync(to, css, encoding);
				cb(encoding,afterAll);
			} catch (e) {
				less.writeError(e, options);
				currentErrorcode = 2;
				cb(encoding,afterAll);
				return;
			}
		}
	});
};

function log(){
	console.log.apply(this,arguments)
}

function die(){
	console.log.apply(this,arguments)
	process.exit();
}

function consoleColor(str,num){
	if (!num) {
		num = '32';
	}
	return "\033[" + num +"m" + str + "\033[0m"
}

function green(str){
	return consoleColor(str,32);
}

function yellow(str){
	return consoleColor(str,33);
}

function red(str){
	return consoleColor(str,31);
}

function blue(str){
	return consoleColor(str,34);
}


exports.lessing = function(dir,callback,encoding){
	files = doWalk(dir);
	doParse(encoding,callback);
};
