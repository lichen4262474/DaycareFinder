const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const DaycareSchema = new Schema({
  title: String,
  price: [String],
  description: String,
  location: String,
  image: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

module.exports = mongoose.model("Daycare", DaycareSchema);
