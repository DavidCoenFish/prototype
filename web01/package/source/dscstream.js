const Stream = require("stream");

const factoryWritable = function(in_finishCallback){
	//Writable = require('stream').Writable;
	var result = Stream.Writable();
	var m_data = "";
	result._write = function (chunk, enc, next) {
		//console.dir(chunk);
		//console.log("log chunk:" + chunk + " enc:" + enc);
		m_data += chunk;
		next();
	};
	result._final = function(next){
		//console.log(gData);
		in_finishCallback(m_data);
		m_data = "";
		next();
	};
	return result;
}

module.exports = {
	"factoryWritable" : factoryWritable
}
