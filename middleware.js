const isLogIn = (req, res, next) => {
  console.log(req.user);
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "Please sign in.");
    return res.redirect("/login");
  }
  next();
};

module.exports = isLogIn;
