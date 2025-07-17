const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const Passport = require('passport');
const { saveredirectUrl } = require('../middleware.js');
const wrapAsync = require('../utils/wrapAsync.js');
const userController = require('../controllers/users.js');
const { render } = require('ejs');
const user = require('../models/user.js');

router.get('/signup', userController.renderSignupform
);



router.post('/signup',  wrapAsync(userController.signup));

router.get('/logout', userController.logout);

router.get('/login',userController.renderLoginform);

router.post('/login',
    saveredirectUrl,
     Passport.authenticate("local",
        {failureRedirect:'/login' ,
             failureFlash:true}), 
           userController.login
);












module.exports = router;