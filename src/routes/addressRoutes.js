const express = require("express");

const router = express.Router();

const {
  addAddress,
  getAllAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
  setDefaultAddress
} = require("../controllers/addressController");

const {
  verifyToken
} = require("../middlewares/authMiddleware");

router.post(
  "/",
  verifyToken,
  addAddress
);

router.post("/", verifyToken, addAddress);

router.get("/", verifyToken, getAllAddresses);

router.patch("/default/:id", verifyToken, setDefaultAddress);

router.get("/:id", verifyToken, getAddressById);

router.put("/:id", verifyToken, updateAddress);

router.delete("/:id", verifyToken, deleteAddress);


module.exports = router;