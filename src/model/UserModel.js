import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,

    // validate is inbuilt while validator is a package
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is required");
      }
    },
  },
  name: {
    type: String,
    required: true,
    lowercase: true,

    // checks if the alphabets contains a number and replaces all sapces with no spaces for the validator function to run
    validate(value) {
      if (!validator.isAlpha(value.replace(/ /g, ""))) {
        throw new Error("Invalid name");
      }
    },
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      let number = value;
      if (number.chartAt(0) === "+") {
        if (number.substring(0, 4) !== "+234") {
          throw new Error("Invalid phone number");
        }
        number = number.substring(4);
      }
      if (!validator.isMobilePhone(number, ["en-NG"])) {
        throw new Error("invalid phone number");
      }
    },
  },
  verifiedPhoneNumnber: {
    type: Boolean,
    default: false,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

// schema.pre();
schema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRETE);
  console.log(user.token);
  return token;
};

const UserModel = mongoose.model("user", schema);
export default UserModel;
