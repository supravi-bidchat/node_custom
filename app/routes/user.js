var User        = require('../controllers/user');
var express 		= require('express');
var router 			= express.Router();
var auth = require('../lib/authenticator');

router.get('/',auth.authenticate, User.getUsers);

module.exports = router;
