const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const userModel = require("../Model/userModel");

// cloudinary.config({
//   cloud_name: "giddy",
//   api_key: "478564868449943",
//   api_secret: "50RMyR-bHCqJu6lPYHdsWXsw_AQ",
//   secure: true,
// });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// The upload function for multer
const upload = multer({ storage: storage }).single("image");

// Creating the verification for signIn TOKEN
const verified = (req, res, next) => {
  try {
    const authToken = req.headers.authorization;
    if (authToken) {
      const token = authToken.split(" ")[2];
      if (token) {
        jwt.verify(token, "MySecret", (error, payload) => {
          if (error) {
            res.status(401).json({ message: "Check your credentials again" });
          } else {
            req.user = payload;
            next();
          }
        });
      } else {
        res.status(401).json({ message: "Your TOKEN...! is not incorrect" });
      }
    } else {
      res
        .status(404)
        .json({ message: "You don't have right to perform this operation" });
    }
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

// To get all registered users
router.get("/users", async (req, res) => {
  try {
    const getUsers = await userModel.find();
    res.status(200).json({
      message: "All Users Found",
      totalUser: getUsers.length,
      data: getUsers,
    });
  } catch (error) {
    res.status(400).json({ message: "No item found", error: error.message });
  }
});

// To get single users
router.get("/users/:id", async (req, res) => {
  try {
    const getUsers = await userModel.findById(req.params.id);
    res.status(200).json({
      message: "Single User Found",
      data: getUsers,
    });
  } catch (error) {
    res
      .status(400)
      .json({ message: "No user with such id", error: error.message });
  }
});

// To create a user
router.post("/user", upload, async (req, res) => {
  try {
    // const cloudImage = await cloudinary.uploader.upload(req.file.path);
    const { name, email, password } = req.body;
    const hashpassword = await bcrypt.genSalt(10);
    const realpassword = await bcrypt.hash(password, hashpassword);
    const createUser = await userModel.create({
      name,
      email,
      password: realpassword,
      image: req.file.path,
    });
    res
      .status(200)
      .json({ message: "Registration Successful", data: createUser });
  } catch (error) {
    res.status(404).json({ message: "Can't create this user" });
  }
});

// To create user login
router.post("/login", async (req, res) => {
  try {
    const signed = await userModel.findOne({ email: req.body.email });
    if (signed) {
      const checkPassword = await bcrypt.compare(
        req.body.password,
        signed.password
      );
      if (checkPassword) {
        const { password, ...data } = signed._doc;
        const token = jwt.sign(
          {
            id: signed._id,
            email: signed.email,
            isAdmin: signed.isAdmin,
          },
          "MySecret",
          { expiresIn: "2d" }
        );
        res.status(201).json({
          message: `welcome back ${signed.name}`,
          data: { ...data, token },
        });
      } else {
        res.status(404).json({ message: "Password is incorrect" });
      }
    } else {
      res.status(404).json({ message: "User not found in this database" });
    }
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

// // To update a user
// router.patch("/users/:id", verified, async (req, res) => {
//   try {
//     if (req.user.isAdmin) {
//       const updateUser = await userModel.findByIdAndUpdate(
//         req.params.id,
//         { name: req.body.name },
//         { new: true }
//       );
//       res
//         .status(200)
//         .json({ message: "Successfully Updated this user", data: updateUser });
//     }
//   } catch (error) {
//     res.status(400).json({ message: "Can't Update this user" });
//   }
// });

// To delete a user
router.delete("/users/:id", verified, async (req, res) => {
  try {
    if (req.user.isAdmin) {
      const deleteUser = await userModel.findByIdAndRemove(req.params.id);
      res.status(200).json({
        message: "Successfully Deleted this user",
        data: deleteUser,
      });
    }
  } catch (error) {
    res.status(400).json({ message: "UnAuthorized to delete" });
  }
});

module.exports = router;
