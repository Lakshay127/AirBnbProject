const express= require('express');
const router= express.Router();
const { listingSchema } = require('../schema.js');
const Listing = require('../models/listing.js');
const { isLoggedIn } = require('../middleware.js');
const wrapAsync = require('../utils/wrapAsync.js');
const listingController = require('../controllers/listings.js');
const multer = require('multer');
const {storage} = require('../cloudConfig.js');
const upload = multer({storage});



router.route("/" )
.get (wrapAsync (listingController.index))
.post( isLoggedIn,
    upload.single("listing[image]"),
    wrapAsync (listingController.createListing));


   

router.get("/new",isLoggedIn, listingController.renderNewForm);

router.route("/:id")
.get( wrapAsync (listingController.showListing))
.put(isLoggedIn,
    upload.single("listing[image]"),
    wrapAsync(listingController.updateListing)
)
.delete(isLoggedIn,wrapAsync (listingController.deleteListing));



router.get("/:id/edit", isLoggedIn, wrapAsync (listingController.renderEditForm));







module.exports = router;