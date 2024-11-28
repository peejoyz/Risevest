let passport = require('passport');
let User = require('../models/userModel');
let Admin = require('../models/adminModel')
let bcrypt = require('bcryptjs');
let LocalStrategy = require('passport-local').Strategy;

//user
passport.use(new LocalStrategy(
    {
        usernameField: "email", 
        passwordField: "password",
        passReqToCallback: true
    }, 
    function(req, email, password, done) {
    //signing in
      User.findOne({email: email})
      .then((user) => {
          if(!user) {
              return done(null, false, {message: 'No user found'});
            // return res.status(404).json({message: 'No user found'})--
            // return done(null, false).json({message: 'No user found'}) --
          }
  
          bcrypt.compare(password, user.password, function(err, isMatch) {
              if(err) 
                  // console.log(err);
                  return done(err);
              if(!isMatch) 
                  return done(null, false, {message: 'The credentials you entered is incorrect.'});
                // return res.status(404).json({message: 'The credentials you entered is incorrect.'})--
                // return done(null, false).json({message: 'The credentials you entered is incorrect.'})--  
                return done(null, user);
          })
  
      }).catch((err) => {
          return done(err);
      })  
  }));

//Admin
passport.use('local.admin', new LocalStrategy(
    {
        usernameField: "email", 
        passwordField: "password",
        passReqToCallback: true
    },
    function(req, email, password, done) {
        Admin.findOne({email: email})
      .then((admin) => {
          if(!admin) {
              return done(null, false, {message: 'No user found'});
            // return res.status(404).json({message: 'No user found'})--
            // return done(null, false).json({message: 'No user found'}) --
          }
  
          bcrypt.compare(password, admin.password, function(err, isMatch) {
              if(err) 
                  // console.log(err);
                  return done(err);
              if(!isMatch) 
                  return done(null, false, {message: 'The credentials you entered is incorrect.'});
                // return res.status(404).json({message: 'The credentials you entered is incorrect.'})--
                // return done(null, false).json({message: 'The credentials you entered is incorrect.'})--  
                return done(null, admin);
          })
  
      }).catch((err) => {
          return done(err);
      }) 
    }
))

  passport.serializeUser((user, done) => {
    done(null, { _id: user.id, role: user.role});
  })

  passport.deserializeUser( async(login, done) => {
    try {
        if(login.role === 'user') {
            const user = await User.findById(login)
            if(user)
                done(null, user);
            else
            done(err, { message: 'User not found'})
        } else if (login.role === 'admin'){
            const admin = await Admin.findById(login)
            if(admin)
              done(null, admin);
            else
              done(err, { messeage: 'Admin not found'})
          } else {
            done({message: 'No entity found'}, null)
          }
    } catch (err) {
       res.send(err) 
    } 
  })