import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./config/db.js";
import userRouter from "./routes/UserRouter.js";
import productRouter from "./routes/productRouter.js";
import orderRouter from "./routes/orderRouter.js";
import paymentRouter from "./routes/paymentRouter.js";
import adminRouter from "./routes/adminRouter.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
const app = express();
const port = process.env.PORT;

app.use(
  cors({
    origin: "https://kaleidoscopic-chaja-f70ad3.netlify.app",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api", userRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/admin", adminRouter);

app.listen(port, () => {
  connectDb();
  console.log("Server is Listening on port : " + port);
});


//admin : admin@ugsales.com
//pass : admin123