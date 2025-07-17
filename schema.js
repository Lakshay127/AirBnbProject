const Joi = require('joi');
const { mainModule } = require('process');
const review = require('./models/review');


const listingSchema = Joi.object({
listing : Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required().min(0),
    description: Joi.string().required(),
    location: Joi.string().required(),
    image: Joi.string().allow("", null)
}).required()
});

