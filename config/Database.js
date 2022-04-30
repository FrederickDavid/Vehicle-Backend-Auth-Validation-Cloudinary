const mongoose = require("mongoose");

const url = "mongodb://localhost/vehiclePlatform";

mongoose.connect(url).then(() => {
  console.log("Database is now Connected Successfully");
});
