# About
A basic authentication system Tech Stack used: HTML, CSS, JS, Node.js, Express.js, Passport.js

# How to Use
- Clone this project
- Install node and mongoose
- Go to console.developers.google.com create a new project in there put the name as nodejs-authentication select that project Create OAuth Client ID and client secret Set the Authorized Javascript origins as
```
 http://localhost:8000
 ```
- Set Authorized redirect URLs
 ```
http://localhost:8000/users/auth/google/callback
```
- Edit clientID,clientSecret,callbackURL
- Use your Email email and password for sending mails
- Enter these commands
```
npm install
npm start or nodemon index.js
```
# Basic-Features
1. Basic Sign up and Sign in functionality with proper authentication on backend (Manual and Google OAuth both).
2. Mailer for forgot password.
3. Proper Notifications using noty.
4. Option to reset password if authenticated manually.

# Directory Structure and flow of The Code
This code follows MVC pattern and hence everything is differentiated and well managed:

/routes - containes all the routes.

/controller - contains functions to connect to different views.

/model - to store data in db we need models.

/config - contains config files for mongoos, passport, node mailer or any other configs.

/views - used by ejs(templating engine) for server side rendering.

/mailers - used by nodemailer for basic mailing functionalies
