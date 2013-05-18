var Threads = require('../build/Release/threads_a_gogo.node');
var path = require('path');
var string_to_object = require('./string_to_object');

module.exports = function(func,opt,callback){
	
	var cb = function(err, result){
		if(err) return callback(err);

		callback(null, string_to_object(result));
	}


	if(opt.poolsize){ //如果使用线程池，则返回线程池实例
			//wait for coding
			var thp = Threads.createPool(opt.poolsize);

			thp._alleval = thp.any.eval;

			thp._alleval(func, opt.buffer, cb, opt.dirname);

			thp.pool = function(func, buf, callback){

				if(arguments.length === 1){
					 buf = new Buffer(0);
					 callback = function(){}
				}

				else if(arguments.length === 2 && 'function' === typeof buf){
					 callback = buf;
					 buf = new Buffer(0);
				}


				 func = '('+func.toString()+')()'; //组装在线程中运行的函数
				 buf = buf || new Buffer(0);
				 callback = callback || function(){};
				var dirname = path.dirname(module.parent.parent.parent.filename);
				
				var cb = function(err, result){
						if(err) return callback(err);

						callback(null, string_to_object(result));
				}


				return thp._alleval(func, buf, cb, dirname);	
			}

	
			delete thp.emit
			delete thp.any.eval;
			delete thp.all.emit;
			
			return thp;

		}
	else{ //如果不使用线程池
				
			 var th = Threads.create();
			 th.eval(func, opt.buffer, cb, opt.dirname);
			 th.eval = null; //不讲eval接口暴露给用户
			 return th;
			
	}

}

