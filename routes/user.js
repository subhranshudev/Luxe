const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const usersController = require("../controllers/users.js");

router.get("/signUp", usersController.renderSignUpForm);

router.post("/signUp", wrapAsync(usersController.signUp));

router.get("/login", usersController.renderLoginForm);

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  usersController.login,
);

router.get("/logout", usersController.logout);

module.exports = router;
