exports.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
  // if (req.user) {
  //   return next();
  // } else {
  //   return res.status(401).send('You must be logged in to access this page');
  // }
};