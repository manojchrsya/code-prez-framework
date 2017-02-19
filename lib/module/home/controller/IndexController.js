'use strict;'
function home() {};
home.prototype.getHomePage = function(req, res, next){
	res.render("home");
};

home.prototype.userLogin = function(req, res, cb){
	passport.authenticate('local-login', {
		successRedirect : '/', // redirect to the secure profile section
		failureRedirect : '/?login=true', // redirect back to the login page if there is an error
		failureFlash : true // allow flash messages
	})(req, res, cb);	
};

home.prototype.userLogout = function(req, res, cb){
	req.logOut();
	res.redirect('/')
};

module.exports = new home();