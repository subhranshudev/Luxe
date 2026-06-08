const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const { wrap } = require("module");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

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

// Listings
app.use("/listings", listings);
// REVIEWS
app.use("/listings/:id/reviews", reviews);

app.all("*splat", (req, res, next) => {
  // If the searched route doesnot matches with any of the route then it will match with this '*' route
  next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
  // Global error handler
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
  // res.status(statusCode).send(message);
});

const port = 8080;
app.listen(port, () => {
  console.log(`Server is listening at port: ${port}`);
});
