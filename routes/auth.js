const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../model/User');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
},
  async function (accessToken, refreshToken, profile, done) {
    const newUser = {
      googleId: profile.id,
      displayName: profile.displayName,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      userName: profile.name.givenName,
      profileImage: profile._json.picture,
      // profileImage: profile.photos[0].value
    };
    console.log(newUser);
    console.log(profile);
    try {
      let user = await User.findOne({ googleId: profile.id });
      if (!user) {
        user = await User.create(newUser);
        done(null, user);
        console.log('New user created');

      } else {
        done(null, user);
        await user.save();
      }
    } catch (err) {
      console.error(err);
    }
  }
));

// google login route
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login-failure',
    successRedirect: '/dashboard'
  }),
);

// route if something goes wrong
router.get('/login-failure', (req, res) => {
  res.send('Failed to login');
});

router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.log(err);
      res.send('Error');
    } else {
      req.logout();
      res.redirect('/');
    }
  });
});

// persist user data after successful authentication
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// original
// passport.deserializeUser(function (id, done) {
//   User.findById(id, function (err, user) {
//     done(err, user);
//   });
//   console.log('deserializeUser', id);
// });

// new code for callback error
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    console.log(error);

  }
});

module.exports = router;