var express = require('express');
var router = express.Router();
var ProfileController = require('../controllers/ProfileController.js');
const checkAuth  = require('../middleware/check-auth');

/*
 * GET
 */
router.get('/',checkAuth, ProfileController.myprofile);


module.exports = router;
