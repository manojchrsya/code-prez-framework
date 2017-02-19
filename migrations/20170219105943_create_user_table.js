'use strict';
exports.up = function(knex, Promise) {
  	return knex.schema.createTableIfNotExists('users', function (table) {
	  table.increments('id').primary();
	  table.string('name',100).notNullable();
	  table.string('email',20).unique().notNullable();
	  table.string('password').notNullable();
	  table.dateTime('created_at').defaultTo(knex.fn.now()).notNullable();
	  table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();
	});
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTable('users'); 
};