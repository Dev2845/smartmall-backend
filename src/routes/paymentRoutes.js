const express = require("express");

const router = express.Router();
const { isAdmin } = require("../middlewares/authMiddleware");
const {
    createRazorpayOrder,verifyPayment,paymentFailed,updatePaymentStatus
} = require("../controllers/paymentController");

const {
    verifyToken
} = require("../middlewares/authMiddleware");

router.post(
    "/create-order",
    verifyToken,
    createRazorpayOrder
);

// Verify Payment
router.post(
    "/verify",
    verifyToken,
    verifyPayment
);

router.post(
    "/failed",
    verifyToken,
    paymentFailed
);
router.put(
    "/status/:id",
    verifyToken,
    isAdmin,
    updatePaymentStatus
);
module.exports = router;