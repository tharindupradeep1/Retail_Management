// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('./database');
var connection = mysql.createConnection(dbconfig.connection);
var express = require('express');
var bodyParser = require('body-parser');
var session		=	require('express-session');
var app      = express();
app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));
var session		=	require('express-session');
var nodemailer = require("nodemailer");
var sess;

connection.query('USE ' + dbconfig.database);
// expose this function to our app using module.exports
module.exports = function(passport) {

  var smtpTransport = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      auth: {
          user: 'retailcodebreakers@gmail.com',
          pass: 'codebreakers2018'
      },
      tls: {rejectUnauthorized: false},
      debug:true
  });

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.CID);
    });

    // used to deserialize the user
    passport.deserializeUser(function(CID, done) {
        connection.query("SELECT * FROM customer WHERE CID = ? ",[CID], function(err, rows){
            done(err, rows[0]);
        });
    });

    passport.serializeUser(function(user, done) {
        done(null, user.AdminID);
    });

    // used to deserialize the user
    passport.deserializeUser(function(AdminID, done) {
        connection.query("SELECT * FROM administrator WHERE AdminID = ? ",[AdminID], function(err, rows){
            done(err, rows[0]);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-signup',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',

            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
              sess=req.session;
            connection.query("SELECT * FROM customer WHERE Username = ?",[username], function(err, rows) {
                if (err)
                    return done(err);
                if (rows.length) {
                    return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                } else {
                    connection.query("SELECT * FROM customer WHERE Email = ?",[req.body.email], function(err, result) {
                    // if there is no user with that username
                    // create the user
                    if (result.length) {
                        return done(null, false, req.flash('signupMessage', 'Email is already taken.'));
                    }
                    else{
                    var newUserMysql = {
                        username: username,
                        fName: req.body.fname,
                        lName: req.body.lname,
                        address: req.body.address,
                        email: req.body.email,
                        password: bcrypt.hashSync(password, null, null)  // use the generateHash function in our user model
                    };
                      sess.username=newUserMysql.username;
                      var body = 'Dear Customer,'+'\n'+ 'Please Click on the below link to confirm your Email address to the website.'+'\n'+ '\n'+"https://retailcodebreakers.herokuapp.com/confirmEmail" +'\n'+'Thank you' +'\n'+ 'Retail Management Store Team';

                    var insertQuery = "INSERT INTO customer ( Username, Password, FName, LName,  Address,  Email, confirmStatus) values (?,?,?,?,?,?,?)";

                    connection.query(insertQuery,[newUserMysql.username, newUserMysql.password, newUserMysql.fName, newUserMysql.lName,  newUserMysql.address,  newUserMysql.email,"No"],function(err, rows) {
                      var mailOptions={
                        to : newUserMysql.email,
                        subject : "Confirmation Request for Retail Management Website",
                        text : body
                      }
                      console.log(mailOptions);
                      smtpTransport.sendMail(mailOptions, function(error, response){
                         if(error){
                              console.log(error);
                       }else{
                              console.log("Message sent: " + response.message);
                           }
                    });
                    newUserMysql.CID = rows.insertId;
                  sess.CID  = rows.insertId;
                        return done(null, newUserMysql);
                    });

                  }

                  });
                }
                  });
        })
    );



        passport.use(
            'local-Adminsignup',
            new LocalStrategy({
                // by default, local strategy uses username and password, we will override with email
                usernameField : 'username',
                passwordField : 'password',

                passReqToCallback : true // allows us to pass back the entire request to the callback
            },
            function(req, username, password, done) {
                // find a user whose email is the same as the forms email
                // we are checking to see if the user trying to login already exists
                  sess=req.session;
                connection.query("SELECT * FROM administrator WHERE Username = ?",[username], function(err, rows) {
                    if (err)
                        return done(err);
                    if (rows.length) {
                        return done(null, false, req.flash('AdminsignupMessage', 'That username is already taken.'));
                    } else {
                        // if there is no user with that username
                        // create the user
                        var newUserMysql = {
                            username: username,
                            fName: req.body.fname,
                            lName: req.body.lname,
                            role : req.body.role,
                            address: req.body.address,
                            email: req.body.email,
                            password: bcrypt.hashSync(password, null, null)  // use the generateHash function in our user model
                        };

                        var insertQuery = "INSERT INTO administrator ( Username, Password, FName, LName,  Address,  Email, role) values (?,?,?,?,?,?,?)";

                        connection.query(insertQuery,[newUserMysql.username, newUserMysql.password, newUserMysql.fName, newUserMysql.lName,  newUserMysql.address,  newUserMysql.email,  newUserMysql.role],function(err, rows) {
                        newUserMysql.CID = rows.insertId;


                            return done(null, newUserMysql);
                        });
                    }
                });
            })
        );
    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-login',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) { // callback with email and password from our form
          sess=req.session;
          sess.username=req.body.username;
            connection.query("SELECT * FROM customer WHERE Username = ?",[username], function(err, rows){
                if (err)
                    return done(err);
                if (!rows.length) {
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                }

                // if the user is found but the password is wrong
                if (!bcrypt.compareSync(password, rows[0].Password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
                    sess=req.session;
                    sess.CID=rows[0].CID;
                // all is well, return successful user
                return done(null, rows[0]);
            });
        })
    );


        passport.use(
            'local-adminLogin',
            new LocalStrategy({
                // by default, local strategy uses username and password, we will override with email
                usernameField : 'username',
                passwordField : 'password',
                passReqToCallback : true // allows us to pass back the entire request to the callback
            },
            function(req, username, password, done) { // callback with email and password from our form
              sess=req.session;
              sess.Adminusername=req.body.username;
                connection.query("SELECT * FROM administrator WHERE Username = ?",[username], function(err, rows){
                    if (err)
                        return done(err);
                    if (!rows.length) {
                        return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                    }

                    // if the user is found but the password is wrong
                    if (!bcrypt.compareSync(password, rows[0].Password))
                        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
                        sess=req.session;
                        sess.AdminID = rows[0].AdminID;
                        sess.role = rows[0].role;
                    // all is well, return successful user
                    return done(null, rows[0]);
                });
            })
        );

};
