const mongoose = require("mongoose");
const initData = require("./data.js")
const Listing = require("../models/listing.js")

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

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({ ...obj, owner: "6a311ba1c2719edf57f0037b" }));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
}

initDB();