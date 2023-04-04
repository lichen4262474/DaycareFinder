const Daycare = require("../models/daycare");
const cities = require("./cities");
const { places, descriptors } = require("./seedsHelper");
const mongoose = require("mongoose");
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/daycare-finder");
  console.log("Database is connected!");
}

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Daycare.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 1000) + 800;
    const daycare = new Daycare({
      author: "6426fa22099fcc57d6139ab0",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      price: [price, price, price, price],
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      image: [
        {
          url: "https://res.cloudinary.com/dpvvvxzgt/image/upload/v1680540887/DaycareFinder/bbc-creative-1w20Cysy1cg-unsplash_ki13mo.jpg",
          filename: "image1 of daycare",
        },
        {
          url: "https://res.cloudinary.com/dpvvvxzgt/image/upload/v1680540887/DaycareFinder/gautam-arora-OVDtgUhUPBY-unsplash_sdej7p.jpg",
          filename: "image2 of daycare",
        },
      ],
    });
    await daycare.save();
  }
};

seedDB();
