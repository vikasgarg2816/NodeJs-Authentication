const User = require('../models/user');
const bcrypt = require('bcryptjs');
const mailers = require('../mailers/password_reset');

// function to generate the OTP
function generateOTP() { 
    var string = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'; 
    let OTP = ''; 
    var len = string.length; 
    for (let i = 0; i < 6; i++ ) { 
        OTP += string[Math.floor(Math.random() * len)]; 
    } 
    return OTP; 
} 

// render the profile page
module.exports.profile = function(req,res){
    return res.render('user_profile',{
        title : "Authentication | Profile"
    })
}

// render the signup page
module.exports.signUp = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile')
    }
    return res.render('user_sign_up',{
        title : "Auth | signup"
    })
}

// render the signin page
module.exports.signIn = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile')
    }
    return res.render('user_sign_in',{
        title : "Auth | signIn"
    })
}

// render the signup details fo creating new user
module.exports.create = function(req,res){
    //Check if Password and Confirm Password fields entered by user matches.
    // In case of mismatch, send a flash message and redirect back
    if(req.body.password!=req.body.confirm_password){
        req.flash('error','Password and confirm Password do not match');
        return res.redirect('back');
    }

    // /If Password and Confirm password matches, create a new user and store the user's information in the DB
    //Use bcrypt library to hash the password entered by the user before storing it in DB
    User.findOne({email:req.body.email},function(err,user){
        if(err){console.log("Error in finding user while signing up");return;}

        if(!user){
            // Create a new user in the User model with the name, email and hashed password of the user
            bcrypt.hash(req.body.password,12,function(err,hash){
                User.create({
                    name : req.body.name,
                    email : req.body.email,
                    password : hash
                    },function(err,user){
                    if(err){
                        console.log("Error in creating user while signing up");
                        return;
                    }
                    req.flash('success','New User created');
                    return res.redirect('/users/signin');
                });
            });
        }
        //If email already exists in DB, generate a flash message and redirect to Sign in page
        else{
            req.flash('error','User already exists with this email');
            return res.redirect('/users/signin');
        }
    });

}

//get the sign in data and open the home page for the user
module.exports.createSession = function(req,res){
    req.flash('success','Logged in Successfully');
    return res.redirect('/');
}

//Sign out user, display a flash message for successful log out, and redirect to the Sign in page
module.exports.destroySession = function(req,res){
    req.logout();
    req.flash('success','Logged out Successfully');
    return res.redirect('/users/signin');
}

module.exports.renderreset = function(req,res){
    req.flash('success','Recovery email sent');
    return res.render('resetpass',{
        title: 'reset password'
    });
}

var arr = [];
module.exports.verifydetails = function(req,res){
    const email = req.body.email;
    console.log
    User.findOne({email:email}).then(function(user){
        //Check if the user exists in the db. If not, generate an error message.
        if(!user){
            req.flash('error','Invalid email entered');
            return res.redirect('/users/reset-password');
        }
        // if user exists in db  the generate the OTP using generate OTP function and use nodemailer to 
        // send the email
        else{
            var token = generateOTP();
            arr.push(email);
            arr.push(token);
            console.log(arr);
            mailers.verifypassword(arr);
            console.log(token);
            return res.render('verifyotp',{
                title : 'Verify OTP'
            });
        }
    });
    
}

module.exports.verifyotp = function(req,res){
    var s1 = arr[0];
    var s2 = arr[1];
    arr.pop();
    arr.pop();
    // if the OTP  sent in email is same as that of entered by user , then render the newpassword page
    if(req.body.otp === s2){
        return res.render('newpassword',{
            email : s1,
            title:'New Password'
        });
    }
    // if user enter wrong OTP then generate the error message
    else{
        req.flash('error','You have entered wrong OTP');
        return res.render('verifyotp',{
            title:'Verify OTP'
        });
    }
}

// update the new password in the database and encrypt it using bcrypt package before storng in db
module.exports.changepassword = function(req,res){
    const email = req.body.email;
    User.findOne({email:email}).then(function(user){
        bcrypt.hash(req.body.password,10,function(err,hash){
            user.password = hash;
            user.save();
        })
    });
    req.flash('success','Password Changed Successfully');
    return res.redirect('/users/signin');
}