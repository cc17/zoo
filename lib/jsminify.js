#!/usr/bin/env node

var	sys = require('util'),
	//jsmin = require('jsmin').jsmin,
	UglifyJS = require('uglify-js'),
	n2a = require('native2ascii').native2ascii,
	a2n = require('native2ascii').ascii2native,
	fs = require('fs');

var rd = require('../lib/utfreading');

function compress(file,convert){
	var encoding = 'utf8';
	var u = rd.read(file);
	fs.writeFileSync(file,u,'utf8');
	var str = fs.readFileSync(file,'utf8');

	if(convert === true){
		str = n2a(str);
	}

	fs.writeFileSync(file,UglifyJS.minify(str,{fromString:true}).code,encoding);
}

exports.compress = compress;

function log(){
	console.log.apply(this,arguments)
}

/*
 * TODO
 * 	- 以gbk写文件不成功
 * */
