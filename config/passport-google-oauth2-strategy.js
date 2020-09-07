const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');

// tell passport to use a new strategy for google login
passport.use(new googleStrategy({
        clientID : "1092919100279-814bbc56shoj31dn1o8pp3ksfltc0d9t.apps.googleusercontent.com",
        clientSecret : "r1G9fVVo8aqI7KblgnEOaUYt",
        callbackURL : "http://localhost:8000/users/auth/google/callback",
    },

    function(accessToken,refreshtoken,profile,done){
        // fint the user
        User.findOne({email:profile.emails[0].value})
        .exec(function(err,user){
            if(err){
                console.log('error in google strategy passport',err);
                return;
            }
            console.log(profile);
            if(user){
                // if found set user as req.user
                return done(null,user);
            }else{
                // if not found then create the user and set it as req.user
                User.create({
                    name : profile.displayName,
                    email : profile.emails[0].value,
                    password : crypto.randomBytes(20).toString('hex')                   
                
                },function(err,user){
                    if(err){
                        console.log('Error in creating the user',err);
                        return;
                    }
                    return done(null,user)
                })
            }
        })
    }
))

module.exports = passport;