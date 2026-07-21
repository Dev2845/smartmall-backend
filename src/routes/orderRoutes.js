const express = require("express");

const router = express.Router();

const {
     placeOrder,
    getMyOrders,
    getOrderDetails,
    cancelOrder,
    getAllOrders,
    updateOrderStatus
} = require("../controllers/orderController");

const {
    verifyToken,isAdmin
} = require("../middlewares/authMiddleware");

router.post(
    "/place",
    verifyToken,
    placeOrder
);


router.get(
    "/my-orders",
    verifyToken,
    getMyOrders
);


// Admin
router.get(
    "/admin/all",
    verifyToken,
    isAdmin,
    getAllOrders
);

router.patch(
    "/cancel/:id",
    verifyToken,
    cancelOrder
);

router.patch(
    "/admin/status/:id",
    verifyToken,
    isAdmin,
    updateOrderStatus
);

router.get(
    "/:id",
    verifyToken,
    getOrderDetails
);


module.exports = router;