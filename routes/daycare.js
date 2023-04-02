const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Daycare = require("../models/daycare");
const daycareController = require("../controllers/daycare-controller");
const { isLogIn, isAuthor, validateDaycare } = require("../middleware");
const daycare = require("../models/daycare");

router
  .route("/")
  .get(catchAsync(daycareController.index))
  .post(isLogIn, validateDaycare, catchAsync(daycareController.createDaycare));

// put new before id so that new will not be treated as an id
router.get("/new", isLogIn, catchAsync(daycareController.renderNewForm));

router
  .route("/:id")
  .get(catchAsync(daycareController.showDaycare))
  .put(
    isLogIn,
    isAuthor,
    validateDaycare,
    catchAsync(daycareController.updateDaycare)
  )
  .delete(isLogIn, isAuthor, catchAsync(daycareController.deleteDaycare));

router.get(
  "/:id/edit",
  isLogIn,
  isAuthor,
  catchAsync(daycareController.renderEditForm)
);

module.exports = router;
