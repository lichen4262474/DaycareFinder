const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Daycare = require("../models/daycare");
const Review = require("../models/review");
const { reviewsSchema, daycareSchema } = require("../schemas.js");
const { isLogIn, validateReview, isReviewAuthor } = require("../middleware");
const reviewController = require("../controllers/review-controller");
router.post(
  "/",
  isLogIn,
  validateReview,
  catchAsync(reviewController.createReview)
);
router.delete(
  "/:reviewId",
  isLogIn,
  isReviewAuthor,
  catchAsync(reviewController.deleteReview)
);

module.exports = router;
