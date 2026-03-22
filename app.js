const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejs = require("ejs");

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

const port = 8080;
app.listen(port, () => {
  console.log(`Server is listening at port: ${port}`);
});
