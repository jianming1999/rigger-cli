#!/usr/bin/env node
require('shelljs/global')
var path = require('path');
console.log(__dirname);
var args = process.argv;
if(args[2] === 'init'){
	console.log('init project start ...')
	mkdir('-p', args[3])
	cp('-R', path.join(__dirname, '../demos/vue-webpack-1.0/'), './'+args[3])
	console.log('destory project success.')	
}else if(args[2] === 'destory'){
	console.log('destory project start ...')
	rm('-rf', './'+args[3]);
	console.log('destory project success ...')
}

