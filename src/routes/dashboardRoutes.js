const express = require("express");

const router = express.Router();

const {
    getDashboardStats,  getMonthlySales,

    getLowStockProducts,

    getLatestOrders,

    getLatestUsers
} = require("../controllers/dashboardController");

const {
    verifyToken,
    isAdmin
} = require("../middlewares/authMiddleware");

router.get(
    "/stats",
    verifyToken,
    isAdmin,
    getDashboardStats
);

router.get(
    "/monthly-sales",
    verifyToken,
    isAdmin,
    getMonthlySales
);

router.get(
    "/low-stock",
    verifyToken,
    isAdmin,
    getLowStockProducts
);

router.get(
    "/latest-orders",
    verifyToken,
    isAdmin,
    getLatestOrders
);

router.get(
    "/latest-users",
    verifyToken,
    isAdmin,
    getLatestUsers
);

module.exports = router;