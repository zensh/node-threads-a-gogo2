global.n = 4
global.test_ok = function(str){
	console.log(n)
	if(!(--n)){
		console.log("test all ok");
		process.exit(1);
	}
	else console.log(str);
}
require('./child.js');

setTimeout(function(){
	require('./quick.js');
},10000)
setTimeout(function(){
	require('./pool.js');
},20000)
setTimeout(function(){
	require('./http_server.js');
},30000)

