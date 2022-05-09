const express = require('express');
const router = express.Router();
const userController = require('../controllers/user_controller');



router.post('/signup',userController.signup);
router.post('/login',userController.login);
router.get('/',userController.verifytoken,userController.profile);
router.post('/logout',userController.verifytoken,userController.logout);
router.use('/tender',require('./tender_route'));

//verfiy Token


module.exports = router;