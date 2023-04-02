const { model } = require("mongoose");
const Daycare = require("../models/daycare");
module.exports.index = async (req, res) => {
  const daycares = await Daycare.find({});
  res.render("daycares/index", { daycares });
};
module.exports.renderNewForm = (req, res) => {
  res.render("daycares/new");
};
module.exports.createDaycare = async (req, res) => {
  // if (!req.body.daycare) throw new ExpressError("Invalid input data", 400);
  const daycare = new Daycare(req.body.daycare);
  daycare.author = req.user._id;
  await daycare.save();
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
  req.flash("success", "successfully updated!");
  res.redirect("/daycares/" + daycare.id);
};
module.exports.deleteDaycare = async (req, res) => {
  const { id } = req.params;
  const daycare = await Daycare.findByIdAndDelete(id);
  req.flash("success", "successfully deleted.");
  res.redirect("/daycares");
};
