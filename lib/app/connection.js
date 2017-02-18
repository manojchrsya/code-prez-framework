'use strict;'
function connection() {
	if(process.argv[2])
		this.jsonDB = require('./' + process.argv[2] + '.json');
	else
		this.jsonDB = require('./development.json');

};
 
connection.prototype.connectToMysqlMaster = function(){
	var _that = this;
	var knex = require('knex')({
		client: 'mysql',
		connection: _that.jsonDB.mysql.master,
		pool: {
			min: 0,
			max: 7
		},
		debug:false
	});

	var bookshelf = require('bookshelf')(knex);
	bookshelf.plugin(require('bookshelf-scopes'));
	return bookshelf;
};

connection.prototype.connectToMysqlSlave = function(){
	var _that = this;
	var knex = require('knex')({
		client: 'mysql',
		connection: _that.jsonDB.mysql.slave,
		pool: {
			min: 0,
			max: 7
		},
		debug:false
	});

	var bookshelf = require('bookshelf')(knex);
	bookshelf.plugin(require('bookshelf-scopes'));
	return bookshelf;
};

connection.prototype.connectToMongo = function(cb){
	var _that = this;
	var MongoClient      =   require('mongodb').MongoClient;
	MongoClient.connect(_that.jsonDB.mongodb, function(err, db) {
		if (err) {
			throw err;
		}
		cb(db);
	});
};

module.exports = new connection();