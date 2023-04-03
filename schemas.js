const Joi = require("joi");
module.exports.daycareSchema = Joi.object({
  daycare: Joi.object({
    title: Joi.string().required(),
    location: Joi.string().required(),
    price: [Joi.array().items(Joi.number()).required()],
    // image: Joi.string().required(),
    description: Joi.string().required(),
  }).required(),
  deleteImages: Joi.array(),
});

module.exports.reviewsSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required(),
  }).required(),
});
