/**
 * This function is use to validate the request
 **/
module.exports.validateLogin = function(req, res, next){
	//example to validate for login request
	var data = {
		email: req.body.email,
		password: req.body.password
	};
	var rules = {
		email: 'required|email',
		password: 'required|valid_password|min:8'
	};

	Validator.register('valid_password', function(value, requirement, attribute) {
		var invalidchar = ["~", "`", "\\", "/"];
		var flag = true;
		for (i = 0; i < invalidchar.length; i++) {
			if (value.indexOf(invalidchar[i]) > 0) {
				flag = false
			};
		}
		return flag;
	}, 'The :attribute should not contain ~`\/\\ charatecters');

	var validation = new Validator(data, rules);
	if (validation.fails()) {
		var respdata = HELPER.errorHandler(400, validation.errors.all());
	    var isJson = HELPER.response(req, res, respdata.responseParams); // api purpose only
	    if (isJson === true) {
	      	res.statusCode = respdata.responseHeaders.status;
	      	res.send(respdata.responseParams);
	    } else {
	      	req.flash('error_message', validation.errors);
			res.redirect('/?login=true');
	    }
	} else {
		return next();
	}
};