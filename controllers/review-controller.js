const Daycare = require("../models/daycare");
const Review = require("../models/review");
module.exports.createReview = async (req, res) => {
  const { id } = req.params;
  const daycare = await Daycare.findById(id);
  const review = new Review(req.body.review);
  review.author = req.user.id;
  daycare.reviews.push(review);
  await review.save();
  await daycare.save();
  res.redirect("/daycares/" + daycare.id);
};
module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Daycare.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  res.redirect("/daycares/" + id);
};
