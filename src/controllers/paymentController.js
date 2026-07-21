const razorpay = require("../config/razorpay");
const Cart = require("../models/Cart");
const crypto = require("crypto");
const mongoose = require("mongoose");
const Order = require("../models/Order");
const Address = require("../models/Address");
const createOrder = require("../services/orderService");


const {
    validateStock,
    reduceStock
} = require("../utils/orderHelper");

exports.createRazorpayOrder = async (req, res) => {

    try {

        const cart = await Cart.findOne({
            user: req.user.id
        });

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty"
            });
        }

        const amount = Math.round(cart.totalPrice * 100);

        const options = {

            amount,

            currency: "INR",

            receipt: "SM_" + Date.now()

        };

        const razorpayOrder = await razorpay.orders.create(options);

        res.status(200).json({

            success: true,

            order: razorpayOrder,

            key: process.env.RAZORPAY_KEY_ID

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

exports.verifyPayment = async (req, res) => {

    const session = await mongoose.startSession();

    session.startTransaction();
  
    try {

        const {

            razorpay_order_id,

            razorpay_payment_id,

            razorpay_signature,

            paymentMethod

        } = req.body;

        const body =
            razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {

            return res.status(400).json({

                success: false,

                message: "Invalid Payment Signature"

            });

        }

        // આગળ અહીં Order Create થશે


        const order = await createOrder(

    req.user.id,

    paymentMethod,

    "Paid",{
                paymentId: razorpay_payment_id,

        razorpayOrderId: razorpay_order_id,

        razorpaySignature: razorpay_signature

    }

);
        await session.commitTransaction();

        session.endSession();

       res.status(200).json({

    success:true,

    message:"Payment Successful",

    order

        });

    }

    catch (error) {

        await session.abortTransaction();

        session.endSession();

        res.status(200).json({

    success:true,

    message:"Payment Successful",

    order

        });

    }

};

exports.paymentFailed = async (req, res) => {

    try {

        res.status(400).json({

            success: false,

            message: "Payment Failed"

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
exports.updatePaymentStatus = async (req, res) => {

    try {

        const order = await Order.findById(req.params.id);

        if (!order) {

            return res.status(404).json({

                success: false,

                message: "Order Not Found"

            });

        }

        order.paymentStatus = req.body.paymentStatus;

        await order.save();

        res.json({

            success: true,

            message: "Payment Status Updated",

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