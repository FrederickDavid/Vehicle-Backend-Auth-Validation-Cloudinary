const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    productDes: {
      type: String,
      required: true,
    },
    productImage: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
    },
    Rating: [
      {
        type: Schema.Types.ObjectId,
        ref: "ratings",
      },
    ],
  },
  { timestamps: true }
);

const productModel = mongoose.model("products", ProductSchema);
module.exports = productModel;
