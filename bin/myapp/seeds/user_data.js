'use scrict;'
var bcrypt = require('bcrypt-nodejs');
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {id: 1, name: 'Code Prez', email: 'codeprez@gmail.com', password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(8), null)}
      ]);
    });
};
