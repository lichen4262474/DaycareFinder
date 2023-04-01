const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Daycare = require("../models/daycare");

const { isLogIn, isAuthor, validateDaycare } = require("../middleware");

router.get(
  "/",
  catchAsync(async (req, res) => {
    const daycares = await Daycare.find({});
    res.render("daycares/index", { daycares });
  })
);
// put new before id so that new will not be treated as an id
router.get(
  "/new",
  isLogIn,
  catchAsync((req, res) => {
    res.render("daycares/new");
  })
);

router.post(
  "/",
  isLogIn,
  validateDaycare,
  catchAsync(async (req, res) => {
    // if (!req.body.daycare) throw new ExpressError("Invalid input data", 400);
    const daycare = new Daycare(req.body.daycare);
    daycare.author = req.user._id;
    await daycare.save();
    req.flash("success", "Successfully add a new daycare.");
    res.redirect("/daycares/" + daycare.id);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
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
  })
);

router.get(
  "/:id/edit",
  isLogIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const daycare = await Daycare.findById(id);
    if (!daycare) {
      req.flash("error", "Can not find the daycare");
      return res.redirect("/daycares");
    }
    res.render("daycares/edit", { daycare });
  })
);

router.put(
  "/:id",
  isLogIn,
  isAuthor,
  validateDaycare,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const daycare = await Daycare.findByIdAndUpdate(id, {
      ...req.body.daycare,
    });
    req.flash("success", "successfully updated!");
    res.redirect("/daycares/" + daycare.id);
  })
);

router.delete(
  "/:id",
  isLogIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const daycare = await Daycare.findByIdAndDelete(id);
    req.flash("success", "successfully deleted.");
    res.redirect("/daycares");
  })
);

module.exports = router;
