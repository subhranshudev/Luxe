const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl, isLoggedIn } = require("../middleware.js");
const usersController = require("../controllers/users.js");

router
  .route("/signUp")
  .get(usersController.renderSignUpForm)
  .post(wrapAsync(usersController.signUp));

router
  .route("/login")
  .get(usersController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    usersController.login,
  );

router.get("/logout", usersController.logout);

router.get("/profile/:id", isLoggedIn, usersController.showProfile);

module.exports = router;
