var _object_toString = function (object) {
    if('string' === typeof object) return object;
    if('number' === typeof object) return object + '';
	if('boolean' === typeof object) return object ? 'true' : 'false';
    if('function' === typeof object || 'array' === typeof object || Buffer.isBuffer(object)) return object.toString();
    if('object' === typeof object) {
        try{
          var obj_str = JSON.stringify(object);
        }
        catch(e){
         return "";
        }
        return obj_str;
    }
  }

var callback;
global.thread={}; 
thread.id = process.pid;

thread.end = function(buf){//当进程执行结束
	if('undefined' ===  typeof buf) buf = 'undefined'
	process.send({_TAGG2_END: _object_toString(buf)});
	process.exit(0);
}



process.on('uncaughtException', function(err) { //遇到意外error
	if(err) process.send({_TAGG2_ERR: JSON.stringify(err)});
	else process.send({_TAGG2_END: ''});
	process.exit(0);
});
	
process.on('exit', function() { //当进程推出执行回掉
	process.send({_TAGG2_END: ''});
	process.exit(0);
});

process.on('message', function(m) {
  if('undefined' !== typeof m._TAGG2_BUFFER){		
		thread.buffer = new Buffer(m._TAGG2_BUFFER);	
		callback && callback();
  }	

process.on('SIGHUP', function() { //当进程推出执行回掉
	process.send({_TAGG2_END: ''});
	process.nextTick(function(){
		process.exit(0);
	})
});


});

thread.nextTick = process.nextTick;

process.nextTick(function(){
	process.send({_TAGG2_READY:1}); //当进程准备完毕之后，通知主进程准备接受buffer
})

module.exports = function(cb){//接受回掉参数
	callback = cb || function(){};
}
	
