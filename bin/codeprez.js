#!/usr/bin/env node
var program = require('commander');
var path = require('path');
var mkdirp = require('mkdirp');
var fs = require("fs");

var pkg = require('../package.json');
var appName;

program
  .version('0.0.1')
  .option('-c, --create', 'create app directory');
 
// must be before .parse() since 
// node's emit() is immediate 
 
program.on('--help', function(){
  console.log('  Examples:');
  console.log('');
  console.log('    $ codeprez create myapp');
  console.log('');
});

// list all directory and files to be copied
var  copyFiles = ['assets', 'lib', 'migrations', 'seeds', 'app.js', 'LICENSE', 'README.md'];

program
  .command('create <app_name>')
    .action(function (dir) {
    	   createApp(dir)
    });

/*
* main function
*/

function createApp(appName){
  this.appName = program.args.shift() || '.';
  mkdir(appName, function(){
    copyFiles.forEach(function(file){
        loadTemplate(file);  
    })
    // package.json
    var _pkg = {
        name: this.appName,
        version: "0.0.0",
        private: true,
        scripts: pkg.scripts,
        dependencies: {
          'code-prez-framework': pkg.version,
        }
      }
    write(this.appName+"/package.json", JSON.stringify(_pkg, null, 2) + '\n');
    write(this.appName+"/logs/error.log");
    write(this.appName+"/logs/exceptions.log");
  })
}



/*
* load files and folders
*/
 
function loadTemplate(name, next) {
    var normalizedPath = path.join(__dirname, '..', name);
    if(fs.lstatSync(normalizedPath).isDirectory()){
        fs.readdirSync(normalizedPath).forEach(function(file) {
            return loadTemplate(name+"/"+file);
        });  
    }else{
        copy_template(normalizedPath, this.appName, function(response){
           return next()
        })
    }
}

/*
* copy file and folders to target directory
*/

function copy_template(from, to, next) {
  var relativePath = from.replace(path.join(__dirname, '..') , "")
  to = to + relativePath;
  write(to, fs.readFileSync(from, 'utf-8'), function(response){
    next();
  });
}

/*
* write the file to destination path
*/

function write(path, str, mode, next) {
  var filePath = path.replace(path.split("/").pop(),"");
  mkdir(filePath, function(){
    if(str){
      fs.writeFileSync(path, str, { mode: mode || 0666 }, function(err){
        console.log('   \x1b[36mcreate\x1b[0m : ' + path);
        next();
      });
    }else{
      fs.closeSync(fs.openSync(path, 'w'), function(err){
        console.log('   \x1b[36mcreate\x1b[0m : ' + path);
        next();
      });
    }
  })
}

/**
 * @param {String} path
 * @param {Function} fn
 */

function mkdir(path, next) {
  mkdirp(path, 0755, function(err){
    if (err) throw err;
    console.log('   \033[36mcreate\033[0m : ' + path);
    next && next();
  });
}

program.parse(process.argv);