var fs = require('fs');
var path = require("path");



var lib = {};

lib.baseDir = path.join(__dirname,'/../.data/');




lib.create = (dir,file,data,callback)=>{
    fs.open(lib.baseDir+dir+'/'+file+'.json',"wx",function(err,fileDescriptor){
        
    });
}











module.exports = lib ;