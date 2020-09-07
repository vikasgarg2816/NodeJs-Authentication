const express = require('express');
const router = express.Router();
const passport = require('passport');
const userController = require('../controllers/users_controller');


// below two routes for google authentication
router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}));
router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/users/signin'}),userController.createSession);

//use middleware to make profile page accessible only when user is signed in
router.get('/profile',passport.checkAuthentication,userController.profile);

// below two routes used for render the signup and signin page
router.get('/signup',userController.signUp);
router.get('/signin',userController.signIn);

router.post('/create',userController.create);

//create a new session using local authentication, Use passport as middleware to authenticate user
router.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect:'/users/signin'}
),userController.createSession);

router.get('/signout',userController.destroySession);

// below four routes are used for reset password(Password Recovery)
router.get('/reset-password',userController.renderreset);
router.post('/verify', userController.verifydetails);
router.post('/verifyotp',userController.verifyotp);
router.post('/changepassword',userController.changepassword);

module.exports = router;