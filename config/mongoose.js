const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/auth_system');

const db = mongoose.connection;

db.on('error',console.error.bind(console,'error in connecting to db'));

db.once('open',function(){
    console.log('Successfully connected to database');
});

module.exports = db;