const express = require("express");

const router = express.Router();

const {
  addToCart,
  getCart,
  updateQuantity,
  removeProduct,
  clearCart
} = require("../controllers/cartController");

const {
  verifyToken
} = require("../middlewares/authMiddleware");

// Add To Cart
router.post(
  "/add",
  verifyToken,
  addToCart
);

router.get("/", verifyToken, getCart);

router.put("/update", verifyToken, updateQuantity);

router.delete("/clear/all", verifyToken, clearCart);

router.delete("/:productId", verifyToken, removeProduct);

module.exports = router;