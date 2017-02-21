function middleware() {}

middleware.prototype.ensureAuthanticated =  function(req, res, next){
	// check user is loged in or not
	if(_.has(req, 'user')){
		next(); // pass to ne xt function
	}else{
		res.redirect("/"); // redirect to login page
	}	
};

module.exports = new middleware();

