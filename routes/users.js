const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const User = require('../models/User.model')
const saltRounds = 10;

const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', isLoggedOut, function (req, res, next) {
  res.render('users/login.hbs', {hideLogout: true});
});

router.post("/login", isLoggedOut, (req, res, next) => {
  const { email, password } = req.body;

  if (email === "" || password === "") {
    res.render("users/login.hbs", {
      errorMessage: "Please enter both, username and password to login.",
      hideLogout: true
    });
    return;
  }

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        res.render("login.hbs", {
          errorMessage: "Username or password is incorrect.",
          hideLogout: true
        });
        return;
      } else if (bcrypt.compareSync(password, user.password)) {
        req.session.user = user;
        res.redirect('/');
      } else {
        res.render("login.hbs", {
          errorMessage: "Username or password is incorrect.",
          hideLogout: true
        });
      }
    })
    .catch((error) => next(error));
});

router.get('/signup', isLoggedOut, function (req, res, next) {
  res.render('users/signup.hbs', {hideLogout: true});
});

router.post('/signup', isLoggedOut, function (req, res, next) {
  const { email, password } = req.body;

  if (email === '' || password === '') {
    // exit early
  }

  bcrypt
    .genSalt(saltRounds)
    .then((salt) => bcrypt.hash(password, salt))
    .then((passwordHash) => {
      return User.create({
        email,
        password: passwordHash
      })
    })
    .then((dbUser) => {
      req.session.user = dbUser;
      res.redirect('/');
    })
    .catch((err) => {
      console.log(err)
      res.render('users/signup.hbs', {hideLogout: true, errorMessage: 'Email already in use.'});
    });

});

router.get('/logout', isLoggedIn, (req, res, next) => {
  req.session.destroy(err => {
    if (err) next(err);
    res.redirect('/');
  });
});

module.exports = router;
