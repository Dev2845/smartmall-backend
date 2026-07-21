const express = require("express");

const router = express.Router();

const {
    createProduct,
  getAllProducts,
  getProductById,
  searchProducts,
  getProductsByCategory,
  getProductsBySubCategory,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
  toggleFeatured,
  toggleTrending,
  toggleBestSeller,restoreProduct,softDeleteProduct
} = require("../controllers/productController");

const {
  verifyToken,
  isAdmin
} = require("../middlewares/authMiddleware");

const upload = require("../middlewares/upload");

// Create Product
router.post(
  "/",
  verifyToken,
  isAdmin,
  upload.array("images", 5),
  createProduct
);

// Search
router.get("/search", searchProducts);

// Category
router.get("/category/:categoryId", getProductsByCategory);

// SubCategory
router.get("/subcategory/:subCategoryId", getProductsBySubCategory);

// Get All
router.get("/", getAllProducts);

// Get Single
router.get("/:id", getProductById);

// Update Product
router.put(
  "/:id",
  verifyToken,
  isAdmin,
  upload.array("images", 5),
  updateProduct
);

// Delete Product
router.delete(
  "/:id",
  verifyToken,
  isAdmin,
  deleteProduct
);

// Toggle Active
router.patch(
  "/toggle-status/:id",
  verifyToken,
  isAdmin,
  toggleProductStatus
);

// Toggle Featured
router.patch(
  "/featured/:id",
  verifyToken,
  isAdmin,
  toggleFeatured
);

// Toggle Trending
router.patch(
  "/trending/:id",
  verifyToken,
  isAdmin,
  toggleTrending
);

// Toggle Best Seller
router.patch(
  "/best-seller/:id",
  verifyToken,
  isAdmin,
  toggleBestSeller
);

router.put(
    "/soft-delete/:id",
    verifyToken,
    isAdmin,
    softDeleteProduct
);

router.put(
    "/restore/:id",
    verifyToken,
    isAdmin,
    restoreProduct
);

module.exports = router;