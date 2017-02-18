function helper() {}

/**
*	to generates the diffrent error message with status code
*/
helper.prototype.errorHandler = function(errorCode, customMessage) {
	returnData = {
			"responseHeaders": {
				"status": errorCode
			},
			"status": "error",
			"responseParams": {}
		};
		if (errorCode === 430) {
			returnData.responseParams = {
				"status": "error",
				"statusMessage": "Access token expired."
			};
		};
		if (errorCode === 435) {
			returnData.responseParams = {
				"status": "error",
				"statusMessage": "Invalid access token."
			};
		};
		if (errorCode === 440) {
			returnData.responseParams = {
				"status": "error",
				"statusMessage": "Invalid Secret Key."
			};
		};
		if (errorCode === 400) {
			returnData.responseParams = {
				"status": "error",
				"statusMessage": "Bad Request."
			};
		};
		if (errorCode === 401) {
			returnData.responseParams = {
				"status": "error",
				"statusMessage": "Not Authorized."
			};
		};
		if (errorCode === 403) {
			returnData.responseParams = {
				"status": "error",
				"statusMessage": "Forbidden."
			};
		};
		if (errorCode === 404) {
			returnData.responseParams = {
				"status": "error",
				"statusMessage": "Resource Not Found."
			};
		};
		if (errorCode === 405) {
			returnData.responseParams = {
				"status": "error",
				"statusMessage": "Method Not Allowed."
			};
		};
		if (errorCode === 415) {
			returnData.responseParams = {
				"status": "error",
				"statusMessage": "Unsupported Media Type."
			};
		};
		if (errorCode === 410) {
			returnData.responseParams = {
				"status": "error",
				"statusMessage": "Data validation failed."
			};
		};
		if (errorCode === 500) {
			returnData.responseParams = {
				"status": "error",
				"statusMessage": "Internal Server Error."
			};
		};
		if (customMessage !== undefined) {
			returnData.responseParams.message = customMessage;
		} else {
			returnData.responseParams.message = {};
		}
		return returnData;
};
/**
*	generate the response if data is correct
*/
helper.prototype.response = function(req, res, data) {
		return false;
}

helper.prototype.uniqueId = function(){
	var crypto = require('crypto');
	var timestamp =  Date.now().toString();
    var uniqueId = crypto.createHash('sha512').update(timestamp).digest("hex");
	return  "cwz"+uniqueId.substr(uniqueId.length - 16);
}

helper.prototype.getDate = function(){
	return moment().format();
}

helper.prototype.slugify = function(text){
	
  	return text.toString().toLowerCase()
	    .replace(/\s+/g, '-')           // Replace spaces with -
	    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
	    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
	    .replace(/^-+/, '')             // Trim - from start of text
	    .replace(/-+$/, '');            // Trim - from end of text
}

helper.prototype.getPaginationResponseObject = function(req, res, totalCount, currentPage, pageLimit){
	var nextPage = 0,
	prevPage = 0,
	limit = 0,
	page = 0,
	totalPageCount = 0;

	if (totalCount != undefined) {
		// current page
		page = (typeof currentPage == 'undefined') ? 1 : parseInt(currentPage);
		// per page limit
		limit = (typeof pageLimit == 'undefined') ? 10 : parseInt(pageLimit);
		// total number of pages
		totalPageCount = Math.ceil(totalCount / limit);
		// get the next and pervious page
		if (totalPageCount > 1) {
			if (page >= totalPageCount) {
				prevPage = totalPageCount - 1;
			} else {
				nextPage = page + 1;
				prevPage = page - 1;
			}
		}
	} else {
		totalCount = 0;
	}
	// get the current page with the query string
	var urlString = req.path;
	var queryArray = [];
	var queryString = "";

	for (query in req.query) {
		if (query != 'page') {
			if (query == 'limit')
				queryArray.push(query + "=" + limit)
			else
				queryArray.push(query + "=" + req.query[query])
		}
	}
	if (!_.isEmpty(queryArray))
		queryString = queryArray.join('&');

	// new query string with params
	urlString = urlString + '?' + queryString;
	
	// pagination object to be include
	return {
		"X-Total-Count": parseInt(totalCount),
		"X-Total-Page": parseInt(totalPageCount),
		"X-Page-Limit": parseInt(limit),
		"X-Next-Page": parseInt(nextPage),
		"X-Current-Page": parseInt(page),
		"X-PREV-Page": parseInt(prevPage),
		"X-Current-URL": urlString,
	};
};

// generating a hash
helper.prototype.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
helper.prototype.validPassword = function(password, localPass) {
    return bcrypt.compareSync(password, localPass);
};

module.exports = new helper();