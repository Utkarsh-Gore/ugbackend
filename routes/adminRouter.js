import { Router } from "express";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";
import {
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controller/productController.js";
import {
  getAllOrders,
  updateOrderStatus,
  getDashboardStats,
} from "../controller/orderController.js";
import { getAllUsers } from "../controller/adminController.js";

const router = Router();

// All admin routes need auth + admin
router.use(verifyToken, isAdmin);

// Dashboard
router.get("/dashboard", getDashboardStats);

// Product management
router.post("/products", createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

// Order management
router.get("/orders", getAllOrders);
router.put("/orders/:id/status", updateOrderStatus);

// User management
router.get("/users", getAllUsers);

export default router;
