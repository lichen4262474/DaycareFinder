const express = require("express");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");

router.get("/register", (req, res) => {
  res.render("./user/register");
});
router.post(
  "/register",
  catchAsync(async (req, res) => {
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
  })
);

router.get("/login", (req, res) => {
  res.render("user/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
    keepSessionInfo: true,
  }),
  (req, res) => {
    let redirectUrl = "/daycares";
    if (req.session.returnTo && !req.session.returnTo.includes("reviews")) {
      redirectUrl = req.session.returnTo;
    }
    req.flash("success", "welcome back");
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  }
);

// router.post("/login", function (res, req, next) {
//   passport.authenticate(
//     "local",
//     {
//       failureFlash: true,
//       failureRedirect: "/login",
//       keepSessionInfo: true,
//     },
//     (err, user, info, status) => {
//       //console.log(res);
//       if (user) {
//         console.log("ttt");
//         let redirectUrl = "/daycares";
//         if (req.session.returnTo && !req.session.returnTo.includes("reviews")) {
//           redirectUrl = req.session.returnTo;
//         }
//         req.flash("success", "welcome back");
//         delete req.session.returnTo;
//         res.redirect(redirectUrl);
//       }
//     }
//   )(res, req, next);
// });

router.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      console.log(err);
    }
  });
  req.flash("success", "Goodbye");
  res.redirect("/daycares");
});
module.exports = router;
