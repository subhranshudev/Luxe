const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  console.log(req.user);
  res.render("listings/new.ejs");
};

module.exports.showAllListings = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  // console.log(listing);
  if (!listing) {
    req.flash("error", "Listing you requested for doesn't exist");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
  let listing = req.body.listing;
  // console.log(listing);
  if (!req.body.listing) {
    throw new ExpressError(400, "Send valid data for listing");
  }
  const newListing = new Listing(listing);
  newListing.owner = req.user._id;
  await newListing.save();

  req.flash("success", "New listing created");
  res.redirect("/listings");
};
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for doesn't exist");
    return res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let updatedListing = req.body.listing;

  if (!updatedListing) {
    throw new ExpressError(400, "Send valid data for listing");
  }
  await Listing.findByIdAndUpdate(id, { ...updatedListing });

  req.flash("success", "Listing updated successfully");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  // console.log(deletedListing);
  req.flash("success", "Listing deleted successfully");
  res.redirect("/listings");
};
