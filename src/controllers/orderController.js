const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Address = require("../models/Address");
const mongoose = require("mongoose");
const razorpay = require("../config/razorpay");

const validateStock = require("../utils/orderHelper");

const reduceStock = require("../utils/reduceStock");

const createOrder = require("../services/orderService");
const { restoreStock } = require("../utils/orderHelper");

//  COD ORDER
// ============================

exports.placeOrder = async (req, res) => {

    try {

        const order = await createOrder(

            req.user.id,

            "COD",

            "Pending"

        );

        res.status(201).json({

            success: true,

            message: "Order Placed Successfully",

            order

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ============================
// USER ORDERS
// ============================

exports.getMyOrders = async (req, res) => {

    try {

        const orders = await Order.find({

            user: req.user.id

        }).sort({

            createdAt: -1

        });

        res.status(200).json({

            success: true,

            total: orders.length,

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

// ============================
// SINGLE ORDER
// ============================

exports.getOrderDetails = async (req, res) => {

    try {

        const order = await Order.findOne({

            _id: req.params.id,

            user: req.user.id

        });

        if (!order) {

            return res.status(404).json({

                success: false,

                message: "Order not found"

            });

        }

        res.status(200).json({

            success: true,

            order

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ============================
// CANCEL ORDER
// ============================

exports.cancelOrder = async (req, res) => {

    try {

        const order = await Order.findOne({

            _id: req.params.id,

            user: req.user.id

        });

        if (!order) {

            return res.status(404).json({

                success: false,

                message: "Order not found"

            });

        }

        if (

            order.orderStatus === "Shipped" ||

            order.orderStatus === "Delivered"

        ) {

            return res.status(400).json({

                success: false,

                message: "Order cannot be cancelled"

            });

        }

       await restoreStock(order.orderItems);

order.orderStatus = "Cancelled";

await order.save();

        res.status(200).json({

            success: true,

            message: "Order Cancelled Successfully",

            order

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ============================
// ADMIN ALL ORDERS
// ============================

exports.getAllOrders = async (req, res) => {

    try {

        const orders = await Order.find()

            .populate("user", "name email")

            .sort({

                createdAt: -1

            });

        res.status(200).json({

            success: true,

            total: orders.length,

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

// ============================
// UPDATE STATUS
// ============================

exports.updateOrderStatus = async (req, res) => {

    try {

        const { orderStatus } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {

            return res.status(404).json({

                success: false,

                message: "Order not found"

            });

        }

        order.orderStatus = orderStatus;

        await order.save();

        res.status(200).json({

            success: true,

            message: "Order Status Updated",

            order

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};