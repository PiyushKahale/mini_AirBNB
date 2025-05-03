const User = require("../models/user.js")

module.exports.signupRender = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signupDone = async (req, res) => {
    try{
        const { username, email, password } = req.body;

        const user = new User({ username, email });

        const registeredUser = await User.register(user, password);
        console.log(registeredUser);

        req.login(registeredUser, (err) => {
            if (err) return next(err);

            req.flash("success", "Welcome to TravelBugg!");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};


module.exports.loginRender = (req, res) => {
    res.render("users/login.ejs");
};


module.exports.loginDone = async (req, res) => {
    req.flash("success", "Welcome back!");
    res.redirect(res.locals.redirectUrl || "/listings");
};


module.exports.logout = (req, res) => {
    req.logout( (err) => {
        if (err) { return next(err); }
        req.flash("success", "Bye Bye...!");
        res.redirect("/listings");
    })
};