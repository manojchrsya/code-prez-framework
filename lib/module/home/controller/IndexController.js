'use strict;'
function home() {};

var homeModel = require("../model/homeModel");
home.prototype.getHomePage = function(req, res, next){
	res.render("home");
};

module.exports = new home();