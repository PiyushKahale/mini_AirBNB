const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync.js")
const { reviewSchema } = require("../schema.js")
const { isLoggedIn, iseReviewAuthor } = require("../middleware.js");



const validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body)
    console.log(error)

    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new Error(400, errMsg)
    } else { 
        next();
    }
}


// { mergeParams: true } // is used to merge the params of the parent route with the child route
// This is used to access the id of the listing in the review route



// Review Controller
const reviewController = require("../controllers/reviews.js")

router.post("/", 
    validateReview,
    isLoggedIn,
    wrapAsync(reviewController.createReview)
);



// Delete review route
router.delete("/:reviewId", 
    isLoggedIn,
    iseReviewAuthor,
    wrapAsync(reviewController.deleteReview)
)


module.exports = router;