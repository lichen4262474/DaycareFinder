const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const path = require("path");
const Daycare = require("./models/daycare");
const ejsMate = require("ejs-mate");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const { daycareSchema, reviewsSchema } = require("./schemas.js");
const Review = require("./models/review");

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/daycare-finder");
  console.log("Database is connected!");
}
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(morgan("common"));

const validateDaycare = (req, res, next) => {
  const { error } = daycareSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

const validateReview = (req, res, next) => {
  const { error } = reviewsSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

app.listen(8080, () => console.log("Listening at port 8080"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get(
  "/daycares",
  catchAsync(async (req, res) => {
    const daycares = await Daycare.find({});
    res.render("daycares/index", { daycares });
  })
);
// put new before id so that new will not be treated as an id
app.get(
  "/daycares/new",
  catchAsync((req, res) => {
    res.render("daycares/new");
  })
);

app.post(
  "/daycares",
  validateDaycare,
  catchAsync(async (req, res) => {
    // if (!req.body.daycare) throw new ExpressError("Invalid input data", 400);
    const daycare = new Daycare(req.body.daycare);
    await daycare.save();
    res.redirect("/daycares/" + daycare.id);
  })
);

app.get(
  "/daycares/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const daycare = await Daycare.findById(id).populate("reviews");
    console.log(daycare);
    res.render("daycares/show", { daycare });
  })
);

app.get(
  "/daycares/:id/edit",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const daycare = await Daycare.findById(id);
    res.render("daycares/edit", { daycare });
  })
);

app.put(
  "/daycares/:id",
  validateDaycare,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const daycare = await Daycare.findByIdAndUpdate(id, {
      ...req.body.daycare,
    });
    res.redirect("/daycares/" + daycare.id);
  })
);

app.delete(
  "/daycares/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const daycare = await Daycare.findByIdAndDelete(id);
    res.redirect("/daycares");
  })
);

app.post(
  "/daycares/:id/reviews",
  validateReview,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const daycare = await Daycare.findById(id);
    const review = new Review(req.body.review);
    daycare.reviews.push(review);
    await review.save();
    await daycare.save();
    res.redirect("/daycares/" + daycare.id);
  })
);

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((error, req, res, next) => {
  const { statusCode = 500 } = error;
  if (!error.message) {
    error.message = "Something went wrong";
  }
  res.status(statusCode).render("error", { error });
});
