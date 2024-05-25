import { User } from "../db/models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const Signup = async (req, res) => {
  try {
    const { name, email, password, profile, publicId } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "Already Registered! Please Login",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashPassword,
      profile,
      publicId,
    });
    return res.status(200).json({
      success: true,
      message: "Signup Successfully! Please Login",
    });
  } catch (error) {
    console.log("error in signup controller", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please Fill All Details",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not find please Signup",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Creadentials",
      });
    }

    const token = await jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    user.password = undefined;

    return res.status(200).json({
      success: true,
      message: "Login Successfully",
      token,
      user,
    });
  } catch (error) {
    console.log("error in Login controller", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const checkAuth = async (req, res) => {
  const reqId = req.id;

  try {
    const user = await User.findById(reqId).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User Not find",
      });
    }
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
