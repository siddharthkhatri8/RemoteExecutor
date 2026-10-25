import { Schema, model } from "mongoose";
import { createError } from "../utils/errorHandler.js";

const User = model(
    "User",
    new Schema({
        username: String,
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
    })
);

export const findUser = async (userObject) => {
    try {
        const user = await User.findOne({ email: userObject.email });
        if (user == null) {
            throw 404;
        }
        return user;
    } catch (error) {
        console.error("Error finding user: ", error);
        if (error === 404) {
            throw createError(`User Not Found`, 404);
        } else {
            throw createError(error.message);
        }
    }
};

export const createUser = async (userObject) => {
    try {
        const user = new User(userObject);
        const preExistingUserNameCheck = await User.findOne({ username: userObject.username });
        const preExistingEmailCheck = await User.findOne({ email: userObject.email });
        if(preExistingUserNameCheck || preExistingEmailCheck){
            throw {errorResponse:{code:11000}};
        }
        await user.save();
        return user;
    } catch (error) {
        console.error("Error creating user: ", error);
        if (error.errorResponse?.code === 11000) {
            throw createError(`User Already Exists`, 409);
        } else {
            throw createError(error.message);
        }
    }
};