require("dotenv").config();
require("./config/Database");
const express = require("express");
const app = express();
const port = 2023;
const cors = require("cors");
const path = require("path");

app.use(express.json());
app.use(cors({ origin: "*" }));
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/", require("./router/UserRoute"));
app.use("/", require("./router/ProductRoute"));
app.use("/", require("./router/RatingRoute"));

app.get("/", (req, res) => {
  res.status(200).json({ message: "Very Simple Vehicle Build" });
});

app.listen(port, (req, res) => {
  console.log(`App is now Listening to Port: ${port}`);
});
