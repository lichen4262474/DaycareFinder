const { model } = require("mongoose");
const Daycare = require("../models/daycare");
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const geocoder = mbxGeocoding({ accessToken: process.env.mapbox_token });

module.exports.index = async (req, res) => {
  const daycares = await Daycare.find({});
  res.render("daycares/index", { daycares });
};
module.exports.renderNewForm = (req, res) => {
  res.render("daycares/new");
};
module.exports.createDaycare = async (req, res) => {
  // if (!req.body.daycare) throw new ExpressError("Invalid input data", 400);
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.daycare.location,
      limit: 1,
    })
    .send();
  const daycare = new Daycare(req.body.daycare);
  daycare.geometry = geoData.body.features[0].geometry;
  daycare.image = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  daycare.author = req.user._id;
  await daycare.save();
  console.log(daycare);
  req.flash("success", "Successfully add a new daycare.");
  res.redirect("/daycares/" + daycare.id);
};
module.exports.showDaycare = async (req, res) => {
  const { id } = req.params;
  const daycare = await Daycare.findById(id).populate({
    path: "reviews",
    populate: {
      path: "author",
    },
  });
  if (!daycare) {
    req.flash("error", "Can not find the daycare");
    return res.redirect("/daycares");
  }
  res.render("daycares/show", { daycare });
};
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const daycare = await Daycare.findById(id);
  if (!daycare) {
    req.flash("error", "Can not find the daycare");
    return res.redirect("/daycares");
  }
  res.render("daycares/edit", { daycare });
};
module.exports.updateDaycare = async (req, res) => {
  const { id } = req.params;
  const daycare = await Daycare.findByIdAndUpdate(id, {
    ...req.body.daycare,
  });
  const images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  daycare.image.push(...images);
  await daycare.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await daycare.updateOne({
      $pull: { image: { filename: { $in: req.body.deleteImages } } },
    });
  }
  req.flash("success", "successfully updated!");
  res.redirect("/daycares/" + daycare.id);
};
module.exports.deleteDaycare = async (req, res) => {
  const { id } = req.params;
  const daycare = await Daycare.findByIdAndDelete(id);
  req.flash("success", "successfully deleted.");
  res.redirect("/daycares");
};
