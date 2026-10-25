import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../middleware/generateToken.js";

export const signup = async (req, res) => {
  try {
    let { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    let existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    let hashpass = await bcrypt.hash(password, 10);
    let user = await User.create({ name, email, password: hashpass });

    const token = generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: "User created successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    let existUser = await User.findOne({ email });
    if (!existUser) {
      return res.status(400).json({ message: "User not registered" });
    }
    let isMatch = await bcrypt.compare(password, existUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const token = generateToken(existUser._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      user: {
        _id: existUser._id,
        name: existUser.name,
        email: existUser.email,
        role: existUser.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return res.status(200).json({
    message: "Logout successful",
  });
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (name) user.name = name;
    if (phone) user.phone = phone;
    await user.save();

    return res.status(200).json({
      message: "Profile updated",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        addresses: user.addresses,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const addAddress = async (req, res) => {
  try {
    const { name, phone, street, city, state, pincode, isDefault } = req.body;
    if (!name || !phone || !street || !city || !state || !pincode) {
      return res.status(400).json({ message: "All address fields are required" });
    }

    const user = await User.findById(req.user._id);

    // If this is set as default, unset others
    if (isDefault) {
      user.addresses.forEach((addr) => (addr.isDefault = false));
    }

    // If it's the first address, make it default
    const makeDefault = user.addresses.length === 0 ? true : isDefault || false;

    user.addresses.push({ name, phone, street, city, state, pincode, isDefault: makeDefault });
    await user.save();

    return res.status(201).json({
      message: "Address added",
      addresses: user.addresses,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses = user.addresses.filter(
      (addr) => addr._id.toString() !== req.params.addressId
    );
    await user.save();

    return res.status(200).json({
      message: "Address deleted",
      addresses: user.addresses,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const checkAuth = async (req, res) => {
  try {
    return res.status(200).json({
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
