const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

// authentication using passport
passport.use(new LocalStrategy({
    usernameField : 'email',
    passReqToCallback : true
    },
    function(req,email,password,done){
        // find the user and establish the identity
        User.findOne({email:email},function(err,user){
            if(err){
                req.flash('error',err);
                return done(err);
            }
            if(!user || user.password!=password){
                req.flash('error','Invalid Username or Password')
                return done(null,false);
            }
            return done(null,user);
        });
    }
    
));

// serializing the user to decide which user is kept in th cookies

passport.serializeUser(function(user,done){
    done(null,user.id);
});

// deserialize the user from the key in the cookies

passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        if(err){
            console.log('Error in finding user--> passport');
            return done(err);            
        }
        return done(null,user)
    });
});


// check if user is authenticated
passport.checkAuthentication = function(req,res,next){
    // if the user is signed in, then pass on the request to next function(controller's action)
    if(req.isAuthenticated()){
        return next();
    }
    // if the user is not signed in
    return res.redirect('/users/signin');
}

passport.setAuthenticatedUser = function(req,res,next){
    if(req.isAuthenticated()){
        // req.user contains the current signed in user from the session cookie & we are just sending this to the locals for views
        res.locals.user = req.user;
    }
    next();
}

module.exports = passport;