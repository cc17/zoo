#!/usr/bin/env node

// 得到的buffer一定是utf8编码的

var fs = require('fs');
var isUtf8 = require('is-utf8');
var iconv = require('iconv-lite');

function read(file){
	var fd = fs.readFileSync(file);

	if(isUtf8(fd)){
		var bf = fs.readFileSync(file);
	} else {
		var bf = iconv.encode(iconv.decode(fd, 'gbk'),'utf8');
	}
	return bf;
}

function readStr(file){
	var bf = read(file);
	var tmp_file = __dirname + '/utf-tf';
	fs.writeFileSync(tmp_file,bf,'utf8');
	var data = fs.readFileSync(tmp_file,'utf-8');
	fs.unlink(tmp_file);
	return data;
}

function toUtf8(file){
	var u = rd.read(file);
	fs.writeFileSync(file,u,'utf8');
}

function die(){
	console.log.apply(this,arguments)
	process.exit();
}

exports.readStr = readStr;
exports.read = read;
exports.toUtf8 = toUtf8;

