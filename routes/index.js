const express = require('express');
const router = express.Router();



router.get('/',(req,res)=> {
    return res.send('hemlo');
});

router.use('/user',require('./user_route'));






module.exports = router;