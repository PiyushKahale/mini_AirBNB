const express = require('express');
const router = express.Router();

const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js")


// User Controllers
const userControllers = require("../controllers/users.js")

router.route("/signup")
    .get(userControllers.signupRender)
    .post(userControllers.signupDone)


router.route("/login")
    .get(userControllers.loginRender)
    .post(saveRedirectUrl,
        passport.authenticate('local', {
        failureRedirect: '/login', 
        failureFlash: true 
        }), userControllers.loginDone
    );

router.get("/logout", userControllers.logout);

module.exports = router;