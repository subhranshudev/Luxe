const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejs = require("ejs");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

const Listing = require("./models/listing.js");
const { wrap } = require("module");

const MONGOURL = "mongodb://127.0.0.1:27017/wanderlust";
async function main() {
  await mongoose.connect(MONGOURL);
}

main()
  .then(() => {
    console.log("DB connection successful");
  })
  .catch((err) => {
    console.log(err);
  });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true })); // when data is sent from frontend, by default it comes through url.
//  If we want to pass it through body this line is written
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
  res.send("Welcome to Luxe!");
});

/*// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My new Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });

//   await sampleListing.save();
//   console.log("Sample was saved");
//   res.send("Successful testing");
// });
*/

// Index route
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  }),
);

// New route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

// Show route
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
  }),
);

// create route
app.post(
  "/listings",
  wrapAsync(async (req, res, next) => {
    let listing = req.body.listing;
    // console.log(listing);
    if (!req.body.listing) {
      throw new ExpressError(400, "Send valid data for listing");
    }
    const newListing = new Listing(listing);
    await newListing.save();
    res.redirect("/listings");
  }),
);

// Edit route
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  }),
);

// Update route
app.put(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let updatedListing = req.body.listing;

    if (!updatedListing) {
      throw new ExpressError(400, "Send valid data for listing");
    }
    await Listing.findByIdAndUpdate(id, { ...updatedListing });
    res.redirect(`/listings/${id}`);
  }),
);

// Delete route
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    // console.log(deletedListing);
    res.redirect("/listings");
  }),
);

app.all("*splat", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.render("error.ejs", {message});
  // res.status(statusCode).send(message);
});

const port = 8080;
app.listen(port, () => {
  console.log(`Server is listening at port: ${port}`);
});
