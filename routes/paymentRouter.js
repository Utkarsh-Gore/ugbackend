import { Router } from "express";
import {
  createPaymentOrder,
  verifyPayment,
  getRazorpayKey,
} from "../controller/paymentController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/key", verifyToken, getRazorpayKey);
router.post("/create-order", verifyToken, createPaymentOrder);
router.post("/verify", verifyToken, verifyPayment);

export default router;
