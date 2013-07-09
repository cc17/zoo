#!/usr/bin/env node
var path = require('path');
var	fs = require('fs');

var mkdirs = module.exports.mkdirs = function(dirpath, mode, callback) {
    fs.exists(dirpath, function(exists) {
        if(exists) {
                callback(dirpath);
        } else {
                //尝试创建父目录，然后再创建当前目录
                mkdirs(path.dirname(dirpath), mode, function(){
                        fs.mkdir(dirpath, mode, callback);
                });
        }
    });
};

var mkdirsSync = module.exports.mkdirsSync = function(dirpath, mode) {
    if(fs.existsSync(dirpath)){
		return;
	} else {
		//尝试创建父目录，然后再创建当前目录
		mkdirsSync(path.dirname(dirpath), mode);
		fs.mkdirSync(dirpath, mode);
	}
};
