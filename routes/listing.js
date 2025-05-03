const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js")
// const { listingSchema } = require("../schema.js")
// const Listing = require("../models/listing.js")

const { isLoggedIn, isOwner } = require("../middleware.js")

const multer = require("multer")
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage }) // to upload files to the server

// // Joi validation
// const validateListing = (req, res, next) => {
//     let {error} = listingSchema.validate(req.body)
//     console.log(error)

//     if(error) {
//         let errMsg = error.details.map((el) => el.message).join(",");
//         throw new Error(400, errMsg)
//     } else { 
//         next();
//     }
// }


// Listing Controllers
const listingController = require("../controllers/listings.js")

router.route("/")
    // Index Route
    .get(wrapAsync(listingController.index))
    // New Route - POST Request
    .post(isLoggedIn, upload.single("listing[image]"), 
    wrapAsync(listingController.createListing));


// New Route - CREATE purpose
router.get("/new", isLoggedIn, listingController.renderNewForm);


router.route("/:id")
    // Show Route - READ purpose
    .get(wrapAsync(listingController.showListing))
    // Update Route - upload.single("listing[image]")
    .put(isLoggedIn, isOwner, wrapAsync(listingController.updateListing))
    // Delete Route
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));


// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, listingController.editForm);


module.exports = router;