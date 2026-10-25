import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/productModel.js";
import User from "./models/userModel.js";
import bcrypt from "bcryptjs";

dotenv.config();

const products = [
  {
    name: "iPhone 16",
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400",
    price: 69999,
    rating: 4.8,
    category: "Smartphone",
    brand: "Apple",
    description: "Premium smartphone with an advanced camera.",
    stock: 25,
  },
  {
    name: "Samsung Galaxy S24",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
    price: 54999,
    rating: 4.7,
    category: "Smartphone",
    brand: "Samsung",
    description: "Powerful Android smartphone with a vivid display.",
    stock: 30,
  },
  {
    name: "OnePlus Nord CE",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400",
    price: 24999,
    rating: 4.5,
    category: "Smartphone",
    brand: "OnePlus",
    description: "Fast smartphone for everyday use.",
    stock: 18,
  },
  {
    name: "Redmi Note Series",
    image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400",
    price: 16999,
    rating: 4.3,
    category: "Smartphone",
    brand: "Redmi",
    description: "Budget-friendly smartphone with a large display.",
    stock: 40,
  },
  {
    name: "Wireless Headphones",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    price: 2999,
    rating: 4.4,
    category: "Electronics",
    brand: "Sony",
    description: "Comfortable headphones for music and calls.",
    stock: 35,
  },
  {
    name: "Smart Watch",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
    price: 3999,
    rating: 4.2,
    category: "Electronics",
    brand: "Noise",
    description: "Smartwatch with fitness tracking features.",
    stock: 20,
  },
  {
    name: "Bluetooth Speaker",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400",
    price: 2499,
    rating: 4.5,
    category: "Electronics",
    brand: "JBL",
    description: "Portable speaker with rich sound.",
    stock: 28,
  },
  {
    name: "Wireless Keyboard",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400",
    price: 1799,
    rating: 4.1,
    category: "Electronics",
    brand: "Logitech",
    description: "Wireless keyboard for work and study.",
    stock: 15,
  },
  {
    name: "Gaming Mouse",
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400",
    price: 1299,
    rating: 4.3,
    category: "Electronics",
    brand: "Logitech",
    description: "Responsive mouse designed for gaming.",
    stock: 22,
  },
  {
    name: "Samsung 43-inch Smart TV",
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400",
    price: 32999,
    rating: 4.6,
    category: "TV",
    brand: "Samsung",
    description: "Smart television for streaming and entertainment.",
    stock: 10,
  },
  {
    name: "LG 55-inch 4K TV",
    image: "https://images.unsplash.com/photo-1461151304267-38535e780c79?w=400",
    price: 49999,
    rating: 4.7,
    category: "TV",
    brand: "LG",
    description: "Large 4K screen for immersive viewing.",
    stock: 8,
  },
  {
    name: "Sony 32-inch LED TV",
    image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400",
    price: 18999,
    rating: 4.3,
    category: "TV",
    brand: "Sony",
    description: "Compact LED television for bedrooms.",
    stock: 12,
  },
  {
    name: "Football",
    image: "https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?w=400",
    price: 999,
    rating: 4.4,
    category: "Sports",
    brand: "Nivia",
    description: "Durable football for practice and matches.",
    stock: 50,
  },
  {
    name: "Cricket Bat",
    image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400",
    price: 2499,
    rating: 4.5,
    category: "Sports",
    brand: "SG",
    description: "Cricket bat suitable for training sessions.",
    stock: 16,
  },
  {
    name: "Running Shoes",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
    price: 3499,
    rating: 4.6,
    category: "Sports",
    brand: "Nike",
    description: "Lightweight shoes for running and exercise.",
    stock: 24,
  },
  {
    name: "Yoga Mat",
    image: "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=400",
    price: 899,
    rating: 4.2,
    category: "Sports",
    brand: "Boldfit",
    description: "Comfortable mat for yoga and stretching.",
    stock: 32,
  },
  {
    name: "Face Moisturizer",
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400",
    price: 599,
    rating: 4.3,
    category: "Beauty",
    brand: "Minimalist",
    description: "Daily moisturizer for a skincare routine.",
    stock: 40,
  },
  {
    name: "Perfume",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400",
    price: 1999,
    rating: 4.5,
    category: "Beauty",
    brand: "Bella Vita",
    description: "Fragrance for everyday use.",
    stock: 27,
  },
  {
    name: "Lipstick",
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400",
    price: 499,
    rating: 4.1,
    category: "Beauty",
    brand: "Maybelline",
    description: "Color-rich lipstick for everyday styling.",
    stock: 45,
  },
  {
    name: "Skincare Serum",
    image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=400",
    price: 799,
    rating: 4.4,
    category: "Beauty",
    brand: "Minimalist",
    description: "Lightweight serum for skincare routines.",
    stock: 19,
  },
  {
    name: "Men's T-Shirt",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
    price: 699,
    rating: 4.3,
    category: "Clothing",
    brand: "Roadster",
    description: "Casual cotton T-shirt for daily wear.",
    stock: 60,
  },
  {
    name: "Denim Jeans",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400",
    price: 1499,
    rating: 4.4,
    category: "Clothing",
    brand: "Levi's",
    description: "Classic denim jeans with a comfortable fit.",
    stock: 35,
  },
  {
    name: "Women's Dress",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400",
    price: 1899,
    rating: 4.6,
    category: "Clothing",
    brand: "H&M",
    description: "Stylish dress for casual outings.",
    stock: 20,
  },
  {
    name: "Hoodie",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400",
    price: 1299,
    rating: 4.5,
    category: "Clothing",
    brand: "Puma",
    description: "Warm hoodie for cool weather.",
    stock: 28,
  },
  {
    name: "Casual Sneakers",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
    price: 2199,
    rating: 4.2,
    category: "Clothing",
    brand: "Puma",
    description: "Everyday sneakers with a modern design.",
    stock: 17,
  },
  {
    name: "Samsung 43-inch 4K Smart TV",
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400",
    price: 32999,
    rating: 4.6,
    category: "TV",
    brand: "Samsung",
    description: "4K Smart TV for streaming and entertainment.",
    stock: 12,
  },
  {
    name: "LG 55-inch OLED TV",
    image: "https://images.unsplash.com/photo-1461151304267-38535e780c79?w=400",
    price: 79999,
    rating: 4.8,
    category: "TV",
    brand: "LG",
    description: "OLED television with vivid colors and deep blacks.",
    stock: 8,
  },
  {
    name: "Sony Bravia 50-inch TV",
    image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400",
    price: 59999,
    rating: 4.7,
    category: "TV",
    brand: "Sony",
    description: "Smart television for movies and gaming.",
    stock: 10,
  },
  {
    name: "Mi 32-inch Android TV",
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400",
    price: 14999,
    rating: 4.3,
    category: "TV",
    brand: "Xiaomi",
    description: "Compact Android TV for everyday entertainment.",
    stock: 20,
  },
  {
    name: "TCL 55-inch QLED TV",
    image: "https://images.unsplash.com/photo-1461151304267-38535e780c79?w=400",
    price: 42999,
    rating: 4.5,
    category: "TV",
    brand: "TCL",
    description: "Large QLED screen for an immersive viewing experience.",
    stock: 9,
  },
  {
    name: "OnePlus 43-inch Smart TV",
    image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400",
    price: 27999,
    rating: 4.4,
    category: "TV",
    brand: "OnePlus",
    description: "Smart TV with a modern design and streaming features.",
    stock: 14,
  },
  {
    name: "Acer 40-inch Full HD TV",
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400",
    price: 19999,
    rating: 4.2,
    category: "TV",
    brand: "Acer",
    description: "Full HD television for home entertainment.",
    stock: 16,
  },
  {
    name: "Panasonic 50-inch LED TV",
    image: "https://images.unsplash.com/photo-1461151304267-38535e780c79?w=400",
    price: 38999,
    rating: 4.4,
    category: "TV",
    brand: "Panasonic",
    description: "Large LED television for family movie nights.",
    stock: 11,
  },
];

async function seed() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/Ecom");
    console.log("MongoDB Connected");

    // Clear existing data
    await Product.deleteMany({});
    console.log("Cleared existing products");

    // Insert products
    const insertedProducts = await Product.insertMany(products);
    console.log(`Seeded ${insertedProducts.length} products`);

    // Create admin user if not exists
    const adminExists = await User.findOne({ email: "admin@ugsales.com" });
    if (!adminExists) {
      const hashpass = await bcrypt.hash("admin123", 10);
      await User.create({
        name: "Admin",
        email: "admin@ugsales.com",
        password: hashpass,
        role: "admin",
      });
      console.log("Admin user created (admin@ugsales.com / admin123)");
    } else {
      // Update existing admin to have admin role
      adminExists.role = "admin";
      await adminExists.save();
      console.log("Admin user already exists");
    }

    console.log("\n✅ Seed completed successfully!");
    console.log("Admin login: admin@ugsales.com / admin123");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seed();
