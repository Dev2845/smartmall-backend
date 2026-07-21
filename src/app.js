const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const authRoutes = require("./routes/authRoutes");
const errorHandler=require("./middlewares/errorMiddleware");
const subCategoryRoutes = require("./routes/subCategoryRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const addressRoutes = require("./routes/addressRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const couponRoutes=require("./routes/couponRoutes");
const reviewRoutes=require("./routes/reviewRoutes");


const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));
app.use(helmet());

// Test Route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'SmartMall Backend API Running 🚀'
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/subcategory", subCategoryRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/coupon",couponRoutes);
app.use("/api/review",reviewRoutes);

app.use(errorHandler);

module.exports = app;