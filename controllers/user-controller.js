const User = require("../models/user");

module.exports.renderRegister = (req, res) => {
  res.render("./user/register");
};

module.exports.register = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const user = await new User({ username, email });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) {
        console.log(err);
      }
      req.flash("success", "Welcome to DaycareFinder");
      return res.redirect("/daycares");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("register");
  }
};
module.exports.renderLogIn = (req, res) => {
  res.render("user/login");
};
module.exports.logIn = (req, res) => {
  let redirectUrl = "/daycares";
  if (req.session.returnTo && !req.session.returnTo.includes("reviews")) {
    redirectUrl = req.session.returnTo;
  }
  req.flash("success", "welcome back");
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};
module.exports.logOut = (req, res) => {
  req.flash("success", "Goodbye");
  req.logout(function (err) {
    if (err) {
      console.log(err);
    }
  });
  res.redirect("/daycares");
};
