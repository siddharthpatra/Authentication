const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const User = require('../models/User');

//Welcome page
router.get('/welcome', (req, res) => res.render('welcome'));

//Middle page
router.get('/middle', (req, res) => res.render('middle'));

//Login page
router.get('/login', (req, res) => res.render('login'));

//Register page
router.get('/register', (req, res) => res.render('register'));

//Register handle
router.post('/register', (req,res) => {
    const {birthday, phonenumber, name, email, password, password2, gender} = req.body;
    let errors = [];

    if (!birthday || !phonenumber || !name || !email || !password || !password2 || !gender) {
        errors.push({ msg: 'Please enter all fields' });
      }

      if (password != password2) {
        errors.push({ msg: 'Passwords do not match' });
      }

      if (password.length < 9) {
        errors.push({ msg: 'Password must be at least 8 characters' });
      }

      if (errors.length > 0) {
        res.render('register', {
           errors, birthday, phonenumber, name, email, password, password2, gender
        });
      } else {
        User.findOne({ email: email }).then(user => {
          if (user) {
            errors.push({ msg: 'Email already exists' });
            res.render('register', {
               errors, birthday, phonenumber, name, email, password, password2, gender
            });
          } else {
            const newUser = new User({
                birthday, phonenumber, name, email, password, gender
            });
    
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser
                  .save()
                  .then(user => {
                    req.flash(
                      'success_msg',
                      'You are now registered and can log in'
                    );
                    res.redirect('/users/login');
                  })
                  .catch(err => console.log(err));
              });
            });
          }
        });
    }
});

// Login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/dashboard',
      failureRedirect: '/users/login',
      failureFlash: true
    })(req, res, next);
  });

module.exports = router;