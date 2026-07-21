const User = require("../models/User");
const Product = require("../models/Product");
const Category = require("../models/Category");
const Order = require("../models/Order");

exports.getDashboardStats = async (req, res) => {

    try {

        const totalUsers = await User.countDocuments({
            role: "user"
        });

        const totalAdmins = await User.countDocuments({
            role: "admin"
        });

        const totalProducts = await Product.countDocuments();

        const totalCategories = await Category.countDocuments();

        const totalOrders = await Order.countDocuments();

        const pendingOrders = await Order.countDocuments({
            orderStatus: "Pending"
        });

        const deliveredOrders = await Order.countDocuments({
            orderStatus: "Delivered"
        });

        const totalRevenueData = await Order.aggregate([
            {
                $match: {
                    paymentStatus: "Paid"
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: {
                        $sum: "$totalAmount"
                    }
                }
            }
        ]);

        const totalRevenue =
            totalRevenueData.length > 0
                ? totalRevenueData[0].totalRevenue
                : 0;

        res.status(200).json({

            success: true,

            dashboard: {

                totalUsers,

                totalAdmins,

                totalProducts,

                totalCategories,

                totalOrders,

                pendingOrders,

                deliveredOrders,

                totalRevenue

            }

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

exports.getMonthlySales = async (req, res) => {

    try {

        const sales = await Order.aggregate([

            {
                $match: {
                    paymentStatus: "Paid"
                }
            },

            {
                $group: {

                    _id: {

                        month: {
                            $month: "$createdAt"
                        },

                        year: {
                            $year: "$createdAt"
                        }

                    },

                    totalSales: {

                        $sum: "$totalAmount"

                    },

                    totalOrders: {

                        $sum: 1

                    }

                }

            },

            {

                $sort: {

                    "_id.year": 1,

                    "_id.month": 1

                }

            }

        ]);

        res.json({

            success: true,

            sales

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


exports.getLowStockProducts = async (req, res) => {

    try {

        const products = await Product.find({

            stock: {

                $lte: 5

            }

        });

        res.json({

            success: true,

            total: products.length,

            products

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

exports.getLatestOrders = async (req, res) => {

    try {

        const orders = await Order.find()

            .populate("user", "name email")

            .sort({

                createdAt: -1

            })

            .limit(10);

        res.json({

            success: true,

            orders

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

exports.getLatestUsers = async (req, res) => {

    try {

        const users = await User.find({

            role: "user"

        })

            .sort({

                createdAt: -1

            })

            .limit(10)

            .select("-password");

        res.json({

            success: true,

            users

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};