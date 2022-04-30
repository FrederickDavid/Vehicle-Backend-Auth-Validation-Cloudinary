//import the model here
const model = require("../model/ratingModel");
const express = require("express");
const router = express.Router();

// route for getting all products
router.get("/rating", async (req, res) => {
  try {
    const getProducts = await model.find();

    res.status(200).json({
      message: "Successfull",
      data: getProducts,
    });
  } catch (err) {
    res.status(404).json({ message: "an error occured", err });
  }
});

//route for getting a single product
router.get("/rating/:id", async (req, res) => {
  try {
    const getProducts = await model.findById(req.params.id, req.body);

    res.status(200).json({
      message: "Successfull",
      data: getProducts,
    });
  } catch (err) {
    res.status(404).json({ message: "an error occured", err });
  }
});
//route for getting a single product
router.post("/rating", async (req, res) => {
  try {
    const UploadProduct = await model.create({
      count: req.body.count,
      user: req.body.user,
    });

    res.status(200).json({
      message: "successful",
      data: UploadProduct,
    });
  } catch (err) {
    res.status(404).json({ message: "an error occured", err });
  }
});

module.exports = router;
