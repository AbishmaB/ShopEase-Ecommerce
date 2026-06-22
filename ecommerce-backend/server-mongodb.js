const mongoose = require("mongoose");
require("dotenv").config();

console.log("URI Loaded:", process.env.MONGO_URI);

mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
    process.exit(0);
  })
  .catch((err) => {
    console.log("❌ MongoDB Connection Failed");
    console.log(err);
    process.exit(1);
  });