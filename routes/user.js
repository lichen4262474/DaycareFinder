const express = require("express");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const userController = require("../controllers/user-controller");

router
  .route("/register")
  .get(userController.renderRegister)
  .post(catchAsync(userController.register));

router
  .route("/login")
  .get(userController.renderLogIn)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
      keepSessionInfo: true,
    }),
    userController.logIn
  );

router.get("/logout", userController.logOut);
module.exports = router;
