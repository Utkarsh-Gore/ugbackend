import User from "../models/productModel.js";

// Admin: Get all users
export const getAllUsers = async (req, res) => {
  try {
    const { default: UserModel } = await import("../models/userModel.js");
    const users = await UserModel.find().select("-password").sort({ createdAt: -1 });
    return res.status(200).json({ users });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
