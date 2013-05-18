var child_process = require('child_process');
var string_to_object = require('./string_to_object');
var node_cmd = process.execPath;
var path = require('path');
var fs = require('fs');
var os = require('os');
var dirname = __dirname;
var tmp_path = path.join(__dirname, '..', 'tmp')
var CHOMD_ERROR = 'Make sure the path : '+ tmp_path + ', you have 0777 chomd!'
var NO = 1;
var iswin32 = os.platform() === 'win32' ? true : false;


var path_replace = function(paths){
	if(iswin32){
		paths = paths.replace(/\\/g,'\\\\'); 
	}
	return paths;
}

var init = function(){
	
	if(!fs.existsSync(tmp_path)){
		fs.mkdirSync(tmp_path, '0777');
	}

	try{
		fs.chmodSync(tmp_path, '0777');
		var file_ary = fs.readdirSync(tmp_path);
		file_ary.forEach(function(v){
			if(v !== '.tmp'){
					fs.unlinkSync(tmp_path+path.sep+v);
			}
		})
	}
	catch(e){
		console.log(CHOMD_ERROR);
		console.log(e)
	}


	return arguments.callee;
}()





module.exports = function(func, opt, cb){
	var require_path = path_replace(dirname+path.sep+'processRequire.js');
	var require_dirname = path_replace(opt.dirname);

	
	var func = '__dirname = "'+require_dirname+'";'+
			   'module.paths.push("'+require_dirname+'");'+          //增加require的路径，否则会找不到模块
			   'var _TAGG_READY = require("'+require_path+'");'+    //加载预设的process模块
			   '_TAGG_READY('+func+');';//注册回调

	var filename = tmp_path+path.sep+(Date.now()+ process.pid + (NO++))+'.js'; //拼接临时子进程文件名
	var hasCalled= false;

	try{
			fs.writeFileSync(filename, func); //为了兼容node V0.8.x
			fs.chmodSync(filename, '0777');
		
	}
	catch(e){
		return cb(JSON.stringify(e))
	}

	var child = child_process.fork(filename);

	child.on('message', function(m) {
		
		if(m._TAGG2_READY === 1){
			
			child.send({_TAGG2_BUFFER:opt.buffer.toString(), _TAGG2_DIRNAME:opt.dirname});

		}
		else if('undefined' !== typeof m._TAGG2_END){
			if(hasCalled) return;
			hasCalled = true;

			cb(null, string_to_object(m._TAGG2_END));
		}

		else if('undefined' !== typeof m._TAGG2_ERR){
			if(hasCalled) return;
			hasCalled = true;
			cb(m._TAGG2_ERR, null);
		}

	});
	
	child.destroy = function(){
		process.nextTick(function(){
			try{
				process.kill(child.pid, 'SIGHUP');
			}
			catch(e){
				//console.log(e)
			}
		})
	};
	

	child.id = child.pid;
	return child;
	
};

