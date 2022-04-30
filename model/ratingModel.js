const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ratingSchema = new Schema(
  {
    count: {
      type: Number,
    },
    user: {
      type: String,
      required: true,
    },
    userRating: {
      type: Schema.Types.ObjectId,
      ref: "products",
    },
  },
  { timestamps: true }
);

const RatingModel = mongoose.model("ratings", ratingSchema);
module.exports = RatingModel;
