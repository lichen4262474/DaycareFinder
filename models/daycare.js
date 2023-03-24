const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const DaycareSchema = new Schema({
  title: String,
  price: [String],
  description: String,
  location: String,
  capacity: Number,
  image: String,
});

module.exports = mongoose.model("Daycare", DaycareSchema);
