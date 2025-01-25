const express = require('express');
const router = express.Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
},
  async function (accessToken, refreshToken, profile, done) {
    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //   return cb(err, user);
    // });
    const newUser = {
      googleId: profile.id,
      userName: profile.name.givenName,
      profileImage: profile._json.picture,
    };
    console.log(newUser);
    console.log(profile);
    try {
      let user = await User.findOne({ googleId: profile.id });
      if (!user) {
        user = await User.create(newUser);
        done(null, user);
        console.log('New user created');
        req.flash('success_msg', 'You are now logged in');

      } else {
        done(null, user);
        // user.userName = profile.name.givenName;
        // user.profileImage = profile._json.picture;
        await user.save();
      }
    } catch (err) {
      console.error(err);
    }
  }
));

// google logi route

router.get('/google',
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

// persist user data after successful authentication
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
  console.log('deserializeUser', id);
});

module.exports = router;