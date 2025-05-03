const Listing = require("./models/listing");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {

    console.log(req.path, "..", req.originalUrl);

    // Check if the user is authenticated
    // If not, redirect to the login page with a flash message
    if (!req.isAuthenticated()) {

        // Store the original URL in the session to redirect after login
        // This is useful for redirecting the user back to the page they were trying to access after login
        req.session.redirectUrl = req.originalUrl;


        req.flash("error", "You must be signed in first...!");
        return res.redirect("/login");
    }
    next();
}


module.exports.saveRedirectUrl = (req, res, next) => {
    
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}


module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    
    if (!listing.owner._id.equals(res.locals.currentUser._id)) {
        req.flash("error", "Request Failed...!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}


module.exports.iseReviewAuthor = async (req, res, next) => {
    let { reviewId } = req.params;

    let review = await Review.findById(reviewId);

    if (!review.author._id.equals(res.locals.currentUser._id)) {
        req.flash("error", "Request Failed...!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}