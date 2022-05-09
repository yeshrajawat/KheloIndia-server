const express = require('express');
const router = express.Router();
const userController = require('../controllers/user_controller');
const tenderController = require('../controllers/tender_controller');


router.post('/create',userController.verifytoken,tenderController.createTender);
router.get('/all',userController.verifytoken,tenderController.all);
router.post('/apply',userController.verifytoken,tenderController.apply);

module.exports = router;