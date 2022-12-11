import { Schema, model } from "mongoose";
import Joi from "joi";

const productSchema: Schema = new Schema({
    _id: false,
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});

const catalogSchema: Schema = new Schema({
        sellerId: String,
        products:{
            type: [productSchema]
        },
        orders: {
            type: [productSchema]
        }
});

const productKeySchema = Joi.object().keys({
    name: Joi.string().required(),
    price: Joi.number().min(5).required()
  });

const productJoiSchema = Joi.array().items(productKeySchema);

const catalogCollection = "Catalog";
const catalogModel = model(catalogCollection,catalogSchema);

export { catalogModel,productJoiSchema };