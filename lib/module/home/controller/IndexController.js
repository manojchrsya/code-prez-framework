'use strict;'
function home() {};

var homeModel = require("../model/homeModel");
home.prototype.getHomePage = function(req, res, next){
	console.log("here  i am!!");
	res.render("home");
};

module.exports = new home();