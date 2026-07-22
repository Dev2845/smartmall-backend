const express = require("express");
const upload = require("../middlewares/upload");

const router = express.Router();

const {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
    toggleCategory
} = require("../controllers/categoryController");

const {
    verifyToken,
    isAdmin
} = require("../middlewares/authMiddleware");

// ==========================
// Public Routes
// ==========================

// Get All Categories
router.get("/", getAllCategories);

// Get Single Category
router.get("/:id", getCategoryById);

// ==========================
// Admin Routes
// ==========================

// Create Category
router.post(
    "/",
    verifyToken,
    isAdmin,
    upload.single("image"),
    createCategory
);

// Update Category
router.put(
    "/:id",
    verifyToken,
    isAdmin,
    upload.single("image"),
    updateCategory
);

// Delete Category
router.delete(
    "/:id",
    verifyToken,
    isAdmin,
    deleteCategory
);

// Active / Inactive
router.patch(
    "/toggle/:id",
    verifyToken,
    isAdmin,
    toggleCategory
);


module.exports = router;