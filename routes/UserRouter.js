import { Router } from "express";
import {
  login,
  logout,
  signup,
  getProfile,
  updateProfile,
  addAddress,
  deleteAddress,
  checkAuth,
} from "../controller/userController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = Router();

// Public
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// Protected
router.get("/me", verifyToken, checkAuth);
router.get("/profile", verifyToken, getProfile);
router.put("/profile", verifyToken, updateProfile);
router.post("/address", verifyToken, addAddress);
router.delete("/address/:addressId", verifyToken, deleteAddress);

export default router;