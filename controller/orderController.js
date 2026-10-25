import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

// Create order (after payment verification)
export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentInfo, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }
    if (!shippingAddress) {
      return res.status(400).json({ message: "Shipping address required" });
    }

    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      paymentInfo: {
        ...paymentInfo,
        status: "paid",
      },
      totalAmount,
      status: "Placed",
      statusHistory: [
        {
          status: "Placed",
          date: new Date(),
          note: "Order placed successfully",
        },
      ],
    });

    // Reduce stock for each product
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    return res.status(201).json({ message: "Order placed", order });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get current user's orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("items.product", "name image price");

    return res.status(200).json({ orders });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get single order detail
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "items.product",
      "name image price"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Only allow the owner or admin
    if (
      order.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    return res.status(200).json({ order });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Admin: Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status && status !== "All") {
      query.status = status;
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .populate("user", "name email")
      .populate("items.product", "name image price");

    return res.status(200).json({ orders });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Admin: Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    order.statusHistory.push({
      status,
      date: new Date(),
      note: note || `Order ${status.toLowerCase()}`,
    });

    // If cancelled, restore stock
    if (status === "Cancelled") {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity },
        });
      }
      order.paymentInfo.status = "refunded";
    }

    await order.save();

    return res.status(200).json({ message: "Order status updated", order });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Admin: Dashboard stats
export const getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const deliveredOrders = await Order.countDocuments({ status: "Delivered" });
    const pendingOrders = await Order.countDocuments({
      status: { $in: ["Placed", "Confirmed", "Shipped", "Out for Delivery"] },
    });
    const cancelledOrders = await Order.countDocuments({ status: "Cancelled" });

    // Total revenue from paid & delivered orders
    const revenueResult = await Order.aggregate([
      { $match: { "paymentInfo.status": "paid", status: { $ne: "Cancelled" } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    // Recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("user", "name email");

    // Orders by status
    const ordersByStatus = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // Monthly revenue (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
          "paymentInfo.status": "paid",
          status: { $ne: "Cancelled" },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          revenue: { $sum: "$totalAmount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const totalProducts = await Product.countDocuments();

    return res.status(200).json({
      totalOrders,
      deliveredOrders,
      pendingOrders,
      cancelledOrders,
      totalRevenue,
      totalProducts,
      recentOrders,
      ordersByStatus,
      monthlyRevenue,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
