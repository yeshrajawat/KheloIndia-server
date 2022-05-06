const express = require('express');
const router = express.Router();
const userController = require('../controllers/user_controller');



router.post('/signup',userController.signup);
router.post('/login',userController.login);
router.get('/',userController.verifytoken,userController.profile);

//verfiy Token


module.exports = router;