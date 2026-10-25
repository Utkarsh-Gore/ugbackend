import { Router } from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
} from "../controller/orderController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", verifyToken, createOrder);
router.get("/", verifyToken, getMyOrders);
router.get("/:id", verifyToken, getOrderById);

export default router;
