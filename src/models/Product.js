const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    // Product Name
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },

    // SEO URL
    slug: {
      type: String,
      unique: true,
    },

    // Description
    description: {
      type: String,
      default: "",
    },

    // Category
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    // SubCategory
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subcategory",
      required: true,
    },

    // Brand
    brand: {
      type: String,
      default: "",
      trim: true,
    },

    // Product Images
    images: [
      {
        type: String,
      },
    ],

    // SKU
    sku: {
      type: String,
      unique: true,
    },

    // Price
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    // Discount Price
    discountPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Stock
    stock: {
      type: Number,
      required: true,
      min: 0,
    },

    // Weight
    weight: {
      type: String,
      default: "",
    },

    // Average Rating
    rating: {
      type: Number,
      default: 0,
    },

    // Review Count
    totalReviews: {
      type: Number,
      default: 0,
    },

    // Home Page Sections
    featured: {
      type: Boolean,
      default: false,
    },

    trending: {
      type: Boolean,
      default: false,
    },

    bestSeller: {
      type: Boolean,
      default: false,
    },

    // Product Status
    isActive: {
      type: Boolean,
      default: true,
    },

    // Soft Delete
    isDeleted: {
      type: Boolean,
      default: false,
    },

    // Created By Admin
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);