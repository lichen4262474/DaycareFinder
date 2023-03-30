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
const daycares = require("./routes/daycare");
const reviews = require("./routes/review");
const session = require("express-session");
const flash = require("connect-flash");

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
app.use(express.static(path.join(__dirname, "public")));
const sessionConfig = {
  secret: "secret",
  resave: false,
  saveUnintialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/daycares", daycares);
app.use("/daycares/:id/reviews", reviews);

app.listen(8080, () => console.log("Listening at port 8080"));
app.get("/", (req, res) => {
  res.render("home");
});

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
