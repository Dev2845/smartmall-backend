const express = require("express");

const router = express.Router();
const {
    getWishlist
} = require("../controllers/wishlistController");

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
router.get("/", verifyToken, getWishlist);

module.exports = router;