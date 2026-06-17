const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const { validateListing } = require("../middleware.js");
const listingsController = require("../controllers/listings.js");

// Index route
router.get("/", wrapAsync(listingsController.index));

// New route
router.get("/new", isLoggedIn, listingsController.renderNewForm);

// Show route
router.get("/:id", wrapAsync(listingsController.showAllListings));

// create route
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(listingsController.createListing),
);

// Edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingsController.renderEditForm),
);

// Update route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(listingsController.updateListing),
);

// Delete route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingsController.destroyListing),
);

module.exports = router;
