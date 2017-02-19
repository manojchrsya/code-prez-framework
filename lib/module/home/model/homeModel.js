'use strict;'
function homeModel() {};

homeModel.prototype.getHomePageDetails = function(reqObj, next) {
	try{
		next({status: "success": data: []});
	}catch(e){
		console.trace(e);
		next({status: 'error', message: e });
	}
};
module.exports = new homeModel();