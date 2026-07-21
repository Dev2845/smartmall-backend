const express = require("express");

const router = express.Router();

const {
  addToWishlist
} = require("../controllers/wishlistController");

const {
  verifyToken
} = require("../middlewares/authMiddleware");

router.post(
  "/add",
  verifyToken,
  addToWishlist
);

module.exports = router;