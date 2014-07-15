'use strict'

var fs = require('fs');
var path = require('path');
var log = require('tracer').colorConsole({dateformat: 'yyyy-mm-dd HH:MM:ss.L'});

/* 
*
* Routes主入口
* GET home page.
* 
*/
module.exports = function(app){
    var routeDir = './routes';
    var indexFile = path.basename(__filename);
    log.debug('routes load---------------');
    log.debug('routeDir', routeDir + "; indexFile: ", indexFile);

    fs.readdirSync(routeDir).forEach(function(file){
       var extName = path.extname(file); 

       if(extName != '.js'){
            return false;
       }else if (indexFile == file){
            return false;
       }

       // bind
       log.debug('require file: '+ file);
       require('./'+ file)(app);
    });

    log.debug('routes exit---------------');
};
