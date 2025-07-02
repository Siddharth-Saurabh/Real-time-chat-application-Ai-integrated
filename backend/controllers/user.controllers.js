import { createUser,getAllUsers } from "../services/user.service.js";
import { validationResult } from "express-validator";
import userModel from "../models/user.model.js";



export const createUserController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await createUser(req.body);
    const token = await user.generateAuthToken();
    delete user._doc.password; // Remove password from the response
    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        _id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const loginController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email }).select("+password");

    if (!user || !(await user.isValidPassword(password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = user.generateAuthToken();

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const profileController = async (req,res) => {
  try {
    const user = await userModel.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const logoutController = async (req, res) => {
  try {
    // Optional: clear cookie if you're using cookies for JWT
    res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "None" });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllUsersController = async (req, res) => {
  try {
    const userId = req.user._id;
    const allUsers = await getAllUsers({ userId });

    res.status(200).json({
      message: "Users fetched successfully",
      users: allUsers.map((user) => ({
        _id: user._id,
        email: user.email,
      })),
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};