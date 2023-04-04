if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

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
const daycaresRoutes = require("./routes/daycare");
const reviewsRoutes = require("./routes/review");
const userRoutes = require("./routes/user");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user");
const mongoSanitize = require("express-mongo-sanitize");
const db_url = process.env.DB_URL || "mongodb://127.0.0.1:27017/daycare-finder";
const secret = process.env.secret || "secret";
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(db_url);
  console.log("Database is connected!");
}
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(morgan("common"));
app.use(express.static(path.join(__dirname, "public")));
app.use(mongoSanitize());

const sessionConfig = {
  store: MongoStore.create({
    mongoUrl: db_url,
    touchAfter: 24 * 3600, // time period in seconds
  }),
  name: "session",
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
  //console.log(req.session?.passport?.user);
  //res.locals.currentUser = req.session?.passport?.user;
  console.log(req.user);
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/daycares", daycaresRoutes);
app.use("/daycares/:id/reviews", reviewsRoutes);
app.use("/", userRoutes);

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
