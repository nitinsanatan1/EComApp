import { Schema, model } from "mongoose";
import Joi from "joi";

const userSchema: Schema = new Schema({
    _id: String,
    username: {
        type: String,
        required: true,
        unique: true
      },
    password: {
        type: String,
        required: true
      },
    userType: {
        type: String,
        required: true
      }
});

export const newUserSchema = Joi.object({
      username: Joi.string().min(5).max(50).required(),
      password: Joi.string().min(5).required(),
      userType: Joi.string().valid('Buyer', 'Seller')
});

export const userLoginSchema = Joi.object({
  username: Joi.string().min(5).max(50).required(),
  password: Joi.string().min(5).required()
});

const userCollection = "Users";
const userModel: any = model(userCollection, userSchema);

export { userModel }