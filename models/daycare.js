const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");
const DaycareSchema = new Schema({
  title: String,
  price: [Number],
  description: String,
  location: String,
  image: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});
DaycareSchema.post("findOneAndDelete", async (doc) => {
  if (doc) {
    await Review.deleteMany({
      id: {
        $in: doc.reviews,
      },
    });
  }
});
module.exports = mongoose.model("Daycare", DaycareSchema);
