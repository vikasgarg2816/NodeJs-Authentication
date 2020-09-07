const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-Strategy');
const MongoStore = require('connect-mongo')(session);
const passportGoogle = require('./config/passport-google-oauth2-strategy');
const flash = require('connect-flash');
const customMware = require('./config/middleware')

app.use(express.urlencoded());
app.use(cookieParser());

// set up the view engine
app.set('view engine','ejs');
app.set('views','./views');

// mongo store is used to store the session cookie in the db
app.use(session({
    name : 'Auth_system',
    secret : "blahsomething",
    saveUninitialized : false,
    resave : false,
    cookie : {
        maxAge : (1000*60*100)
    },
    store: new MongoStore({
        mongooseConnection:db,
        autoRemove:'disabled'
    },
    function(err){
        console.log(err || 'connect-mongodb setup ok');
    }
    )
}));

// used for session cookie
app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);


app.use(expressLayouts);

app.use(flash());
app.use(customMware.setFlash)

// use express router
app.use('/',require('./routes'));

app.listen(port,function(err){
    if(err){
        console.log("Error",err);
        return;
    }
    console.log("Server is running on portNo:",port);
});