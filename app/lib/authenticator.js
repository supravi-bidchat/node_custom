var config 		= require('../config/app');
var models		= require('../models');
var jwt         = require('jwt-simple');

module.exports = {

	authenticate: 	function(req,res,next) {

		var token = getToken(req.headers);

		if (!token) {
			return res.status(401).send({"message":"Unauthorized"});
		}

		try {
		    var decodedToken = jwt.decode(token, config.security.salt);
		}
		catch(err) {
		    return res.status(401).send({"message":"Unauthorized"});
		}

		var userId = getUserIdFromDecodedToken(decodedToken);

		models.token.findAll({where: {
			user_id	: userId,
			token 	: token
		}}).then(function(user) {
			if (user.length == 0) {
				return res.status(401).send({"message":"Unauthorized"});
			}
			req.response = user[0].user_id;
			return next();
		});
	}
}
// ========================================== FUNCTIONS ==========================================
var getToken = function (headers) {

	if (headers && headers.authorization) {
		var parted = headers.authorization.split(' ');
	
		if (parted.length != 2) {
			return null;
		}

		if (parted[0] != 'Bearer') {
			return null;
		}
	  	
	  	return parted[1];
		
	} else {
		return null;
	}
};

var getUserIdFromDecodedToken = function (decodedToken) {

	var parted = decodedToken.split('_');
	return parted[0];
}
