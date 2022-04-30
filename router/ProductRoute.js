const multer = require("multer");
const cloudinary = require("cloudinary").v2;

//import the model here
const model = require("../model/productModel");
const express = require("express");
const router = express.Router();

// cloudinary.config({
//   cloud_name: "giddy",
//   api_key: process.env.API_KEY,
//   api_secret: process.env.API_SECRET,
//   secure: true,
// });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage }).single("productImage");

// route for getting all products
router.get("/products", async (req, res) => {
  try {
    const getProducts = await model.find();

    res.status(200).json({
      message: "Successfull",
      totalProduct: getProducts.length,
      data: getProducts,
    });
  } catch (err) {
    res.status(404).json({ message: "an error occured", err });
  }
});

//route for getting a single product
router.get("/products/:id", async (req, res) => {
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
router.post("/products", upload, async (req, res) => {
  try {
    // const cloudImage = cloudinary.uploader.upload(req.file.path);
    const { productName, productDes, category, price } = req.body;

    const UploadProduct = await model.create({
      productName,
      productDes,
      category,
      price,
      productImage: req.file.path,
    });

    res.status(200).json({
      message: "successful",
      data: UploadProduct,
    });
  } catch (err) {
    res.status(404).json({ message: "an error occured", err });
  }
});

router.patch("/products/:id", upload, async (req, res) => {
  // const usingCloudinary = await cloudinary.uploader.upload(req.file.path);
  // console.log(usingCloudinary);
  const { productName, productDes, category, price } = req.body;

  const EditingUser = await model.create({
    productName,
    productDes,
    category,
    price,
    productImage: req.file.path,
  });
  try {
    const updated = await model.findByIdAndUpdate(req.params.id, EditingUser);
    res.status(200).json({
      message: "Succefull 💻",
      data: updated,
    });
  } catch (error) {
    res.status(404).json({
      message: "getting all data failed 😣",
    });
  }
});

router.delete("/products/:id", async (req, res) => {
  const deleteUser = await model.findByIdAndRemove(req.params.id, req.body);
  try {
    res.status(201).json({
      message: "Succefull 💻",
      data: deleteUser,
    });
  } catch (error) {
    res.status(404).json({
      message: "getting all data failed 😣",
    });
  }
});

module.exports = router;
