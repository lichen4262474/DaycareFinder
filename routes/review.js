const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Daycare = require("../models/daycare");
const Review = require("../models/review");
const { reviewsSchema, daycareSchema } = require("../schemas.js");
const { isLogIn, validateReview, isReviewAuthor } = require("../middleware");

router.post(
  "/",
  isLogIn,
  validateReview,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const daycare = await Daycare.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user.id;
    daycare.reviews.push(review);
    await review.save();
    await daycare.save();
    res.redirect("/daycares/" + daycare.id);
  })
);

router.delete(
  "/:reviewId",
  isLogIn,
  isReviewAuthor,
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Daycare.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect("/daycares/" + id);
  })
);

module.exports = router;
