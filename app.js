const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejs = require("ejs");

const Listing = require("./models/listing.js");

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

app.get("/", (req, res) => {
  res.send("Welcome to Luxe!");
});

app.get("/testListing", async (req, res) => {
  let sampleListing = new Listing({
    title: "My new Villa",
    description: "By the beach",
    price: 1200,
    location: "Calangute, Goa",
    country: "India",
  });

  await sampleListing.save();
  console.log("Sample was saved");
  res.send("Successful testing");
});

const port = 8080;
app.listen(port, () => {
  console.log(`Server is listening at port: ${port}`);
});
