const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const path = require("path");
const Daycare = require("./models/daycare");
const ejsMate = require("ejs-mate");

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

app.listen(8080, () => console.log("Listening at port 8080"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/daycares", async (req, res) => {
  const daycares = await Daycare.find({});
  res.render("daycares/index", { daycares });
});
// put new before id so that new will not be treated as an id
app.get("/daycares/new", (req, res) => {
  res.render("daycares/new");
});

app.post("/daycares", async (req, res) => {
  const daycare = new Daycare(req.body.daycare);
  await daycare.save();
  res.redirect("/daycares/" + daycare.id);
});

app.get("/daycares/:id", async (req, res) => {
  const { id } = req.params;
  const daycare = await Daycare.findById(id);
  res.render("daycares/show", { daycare });
});

app.get("/daycares/:id/edit", async (req, res) => {
  const { id } = req.params;
  const daycare = await Daycare.findById(id);
  res.render("daycares/edit", { daycare });
});

app.put("/daycares/:id", async (req, res) => {
  const { id } = req.params;
  const daycare = await Daycare.findByIdAndUpdate(id, { ...req.body.daycare });
  res.redirect("/daycares/" + daycare.id);
});

app.delete("/daycares/:id", async (req, res) => {
  const { id } = req.params;
  const daycare = await Daycare.findByIdAndDelete(id);
  res.redirect("/daycares");
});

app.use((req, res) => {
  res.status(404).send("Not Found!");
});
