const { daycareSchema, reviewsSchema } = require("./schemas.js");
const Daycare = require("./models/daycare");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError");

module.exports.isLogIn = (req, res, next) => {
  console.log(req.user);
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "Please sign in.");
    return res.redirect("/login");
  }
  next();
};
module.exports.validateDaycare = (req, res, next) => {
  const { error } = daycareSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const daycare = await Daycare.findById(id);
  if (!daycare.author.equals(req.user.id)) {
    req.flash("error", "You do not have permission.");
    return res.redirect("/daycare");
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user.id)) {
    req.flash("error", "You do not have permission.");
    return res.redirect("/daycare");
  }
  next();
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewsSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
