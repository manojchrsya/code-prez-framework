
var codeprez = require('./app'),
	_ 	= require('lodash'),
	Validator =	require("validatorjs"),
	knex 	= require('knex'),
	mysql      = require('mysql'),
	connectionDB = require("./app/connection")

function cp() { 
	// Bind `this` context for all `cp.prototype.*` methods
    this.init = _.bind(codeprez.init, this);
    this.start = _.bind(this.start, this);
    this.dbconn = _.bind(this.dbconn, this);

    codeprez.logger(); // intilising logger	

    this.init();
    //this.dbconn(this); //connect mongo db to system
    this.sqlConn(this);  // connect mysql database to system
    codeprez.routes();
    codeprez.initPassport();
    codeprez.render404(); // init 404 route after all intisialition
};

cp.prototype.start = function(){
	codeprez.start(true);
}

cp.prototype.dbconn = function(){
	that = this;
	connectionDB.connectToMongo(function(data){
		console.log("mongodb connected to system!");
		mongoObj = data
		that.start();
	});
};

cp.prototype.sqlConn = function(){
	that = this;
	mysqlObj = connectionDB.connectToMysqlSlave();
	that.start();
};

module.exports = cp;