var express = require('express');
var router = express.Router();
var SheetController = require('../controllers/SheetController.js');
const checkAuth  = require('../middleware/check-auth');


/*
 * GET
 */
router.get('/mylist', checkAuth, SheetController.mylist);


/*
 * POST
 */
router.post('/', checkAuth, SheetController.create);

router.delete('/', checkAuth, SheetController.remove);
 

module.exports = router;
