# TAGG(Threads A GoGo2) for Node.js

A native module for Node.js that provides an asynchronous, evented and/or continuation passing style API for moving blocking/longish CPU-bound tasks out of Node's event loop to JavaScript threads that run in parallel in the background and that use all the available CPU cores automatically; all from within a single Node process.

TAGG2 is thread_a_gogo module's fork, thanks for Jorge Chamorro Bieling.

## Installing the module

With [npm](http://npmjs.org/):

    Threads A GoGo2 module is supported windows, linux, mac.

    Make sure, node-gyp has installed.

    npm install threads_a_gogo2

From source:

    git clone http://github.com/xk/node-threads-a-gogo.git
    cd node-threads-a-gogo2
    node-gyp rebuild

To include the module in your project:

    var TAGG2 = require('threads_a_gogo2');

## Quick example

   var tagg2 = require('tagg2'); //require the module

   var th_func = function(){

	console.log('i am in thread,my file path is :' + __dirname); 	
	//in thread you can do some cpu hard work,such as fibo.
	
	thread.end("thread over"); 
	//when thread over, the string "thread over" will transfer to main nodejs thread.
  
   }
   
   var thread = tagg.create(th_func, function(err, res){
   //var thread = tagg.create(th_func, {buffer:buf}, callback); may transfer buffer to thread.

	if(err) throw(err);//thread occur some errors

	console.log(res);//this will be print "thread over"

	thread.destroy();//make suer to destory the thread which you have created

   });


## Thread pool

 tagg2 module support thread pool, that's will be created first,and do any other number of hard works.

 when you have too many threads, your program may be out of memory,so thread pool will protect you from that.

   var tagg2 = require('tagg2'); //require the module

   var buf = new Buffer('tagg2 buffer'); //create the buffer to transfer to thread

   var th_func = function(){
	
	console.log(thread.buffer.toString()); 	
	//this will print 'tagg2 buffer'.
	
	thread.end("thread over"); 
	//when thread over, the string "thread over" will transfer to main nodejs thread.
  
   }
   
   var thread = tagg2.create(10);//create a pool which size of 10.
   
   tagg2.pool(th_func, buf, function(err, res){
   //tagg2.pool(th_func,callback); may not transfer buffer to thread.

	if(err) throw(err);//thread occur some errors

	console.log(res);//this will be print "thread over"

	thread.destroy();//make suer to destory the thread which you have created

   });
   

##Apis

  #tagg2

    object, you can get tagg2 object from require('tagg2');

    tagg2.create(function)

      return a thread object, the thread object has some methods and properties follow. see thread api.

      ex1. tagg2.create(thread_function)     

      ex2. tagg2.create(poolsize)

      ex3. tagg2.create(thread_function, callback)

      ex4. tagg2.create(thread_function, options, callback)
    
    options(object)
      
      buffer the buffer which you want to transfer to thread,default is false;

      poolsize thread poolsize, set false not use thread pool. default is false;

      fastthread set false,to use nodejs env thread, you can use all nodejs module and api.set false use quick thread, you only can use js function but fast.default is true.

        notice if fastthread is false,you have the real another node.js process

      notice: to set fastthread false, you can not use thread pool any more.

    callback(function) every callback has the same parameter

      the first argument is error, if some error occur in the thread, the parameter will be not null;

      the second argument is result,when thread.end(result) run in the thread, the result will transfer to main thread and execute the callback; thread.end see below;
   
   #thread

      object, you can get thread object from execute tagg2.create(...).

      if you set poolsize from tagg2.create(...),like tagg2.create(10),return thread pool object.

      thread.id(property) not support thread pool create
      
        the number mark the thread or child process.

      thread.destory(function)

	destory the thread or thread pool.make sure to execute it when you don't need the thread any more.

        ex1. thread.destory();

	ex2. thread.destory([true]);
	 
	  thread pool only, waits until pendingJobs() is zero and then destroys the pool. If rudely is truthy, then it doesn't wait for pendingJobs === 0.
      
      thread.pool(function) thread pool only

        put some job to the idle thread in the thread pool,if all the thread is working, the job will wait.
	
	ex1. thread.pool(thread_func)

	ex2. thread.pool(thread_func, buffer)

	ex3. thread.pool(thread_func, callback)

	ex4. thread.pool(thread_func, buffer, callback)
      
      thread.totalThreads(function)
        
	 returns the number of threads in this pool

	 ex1. thread.totalThreads();
	
      thread.idleThreads(function)
      
         returns the number of threads in this pool that are currently idle (sleeping)

	 ex1. thread.idleThreads();

      thread.pendingJobs(function)
          
	 returns the number of jobs pending

	 ex1. thread.pendingJobs()

   #in the thread1(fast thread)

      thread.id(property)

        the number mark the thread or child process.
	
      thread.buffer(property)
        
	object,save the buffer object which has sent from main thread.

      thread.buffer.toString(function)

        return string; to get the buffer to utf-8 string

	ex1. thread.buffer.toString();

      thread.end(function)

        ex1.thread.end(); return undefined result to main thread callback;

        ex2.thread.end(reslut); return array or object or string to main thread callback;
      
      console.log(function)
      
        print the array or object or string or number etc. to stdio

	ex1. console.log("tagg2")       

      require(function)

        load a js file,you can use global object to read or write the Variable in the require file

	ex1. require("tagg2_require.js"); //make sure tagg2_require.js has in the same dir with __dirname

	notice. in the fast thread, there is not a really node.js runtime env,so you can't require node.js module,so don't do that 'var fs = require("fs");'

      global(object)

        save the global object in the thread like Browser's window.you can set or get some value from it.every thread has it's own global.

      __dirname(string)
        
	the nodejs dir path which you call the thread.
  
  #in the thread2
      
      all in the thread1's object and functionally
      
      when you set fastthread false, you can use all the api of node.js,There is no limit,but not use pool.
 
 ##more
	
      see /example , /benchmark and /test for more useful code. do test please run node ./test/main_test.js

 ##future

      TAGG2 module has already in experiment,so you may not use it in production.TAGG2 will more stronger and feature-richer.

