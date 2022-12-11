import { userModel,newUserSchema,userLoginSchema } from "../models/users";
import { Request, Response } from "express";
import { Configs } from "../configs";
import { v4 as uuidv4 } from "uuid";
import * as JWT from "jsonwebtoken";
import bcrypt from "bcrypt";

export const loginSignupControllers = {
    signupNewUser : async (req: Request, res: Response) => {
        const { error } = newUserSchema.validate(req.body);
        if ( error ) {
            return res.status(500).send(error.details[0].message);
        }
        let user = await userModel.findOne({ username: req.body.username });
        if (user) {
            return res.status(400).send('User already exisits!');
        }
        else
        {
        // Generating a random Id in Mongodb for unique docs
        const _id = `${uuidv4()}`
        const details = {...req.body,...{_id}};

        // Hashing the password before saving it to Mongo.
        const salt = await bcrypt.genSalt(10);
        details.password = await bcrypt.hash(details.password, salt);
        
        // Saving the details to db, it will throw error if validation not satisfy, user already exists.
        await userModel.create(details);

        return res.status(200).send("User Successfully Created");
        }
    },

    loginUser : async (req: Request, res:Response) => {
        // Validation of login data
        const { error } = userLoginSchema.validate(req.body);
        if ( error ) {
            return res.status(500).send(error.details[0].message);
        }

        // Destructuring the request body
        const {username,password,userType} = req.body;

        // Check if user exists with this username
        let user = await userModel.findOne({ username: username });
        if (!user) {
            return res.status(400).send('Incorrect username. Make sure you have account already created.');
        }

        // Compare the password, one is in string, the stored is hashed.
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).send('Incorrect password.');
        }

        // returning a JWT token on successful authetication
        const bearerToken = `Bearer ${JWT.sign({ _id: user._id }, Configs.auth.jwtSecret, {
            expiresIn: "30d"}
            )}}`;
        return res.header('x-auth-token', bearerToken).send("Successfully logged in. Check Headers for Bearer Token");
    }
}