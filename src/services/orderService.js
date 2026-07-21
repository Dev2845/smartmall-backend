const mongoose = require("mongoose");

const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Address = require("../models/Address");
const User = require("../models/User");
const sendOrderEmail = require("../utils/sendOrderEmail");
const {
    validateStock,
    reduceStock
} = require("../utils/orderHelper");

const createOrder = async (
    
    userId,

    paymentMethod,

    paymentStatus = "Pending",

    paymentData = {}
) => {

    const session = await mongoose.startSession();

    session.startTransaction();

    try {

        // Cart
        const cart = await Cart.findOne({
            user: userId
        }).populate("items.product");

        if (!cart || cart.items.length === 0) {
            throw new Error("Cart is empty");
        }

        // Validate Stock
     

await reduceStock(orderItems, session);  await validateStock(cart.items);

        // Address
        const address = await Address.findOne({
            user: userId,
            isDefault: true
        });

        if (!address) {
            throw new Error("Default Address not found");
        }

        let subtotal = 0;

        const orderItems = [];

        for (const item of cart.items) {

            const product = item.product;

            const price =
                product.discountPrice > 0
                    ? product.discountPrice
                    : product.price;

            subtotal += price * item.quantity;

            orderItems.push({

                product: product._id,

                name: product.name,

                image: product.images[0],

                price,

                quantity: item.quantity

            });

        }

    const discount = cart.discount || 0;

        const deliveryCharge = subtotal >= 500 ? 0 : 50;

        const tax = Math.round(subtotal * 0.18);

        const totalAmount =
            subtotal +
            deliveryCharge +
            tax -
            discount;

        const orderNumber = "SM" + Date.now();
        const invoiceNumber = "INV" + Date.now();

        const order = await Order.create(
            [{
                user: userId,

                orderNumber,
                invoiceNumber,

                orderItems,

                shippingAddress: {

                    fullName: address.fullName,

                    mobile: address.mobile,

                    alternateMobile: address.alternateMobile,

                    addressLine1: address.addressLine1,

                    addressLine2: address.addressLine2,

                    landmark: address.landmark,

                    city: address.city,

                    state: address.state,

                    country: address.country,

                    pincode: address.pincode

                },

                paymentMethod,

                paymentStatus,

                   paymentId: paymentData.paymentId || "",

        razorpayOrderId: paymentData.razorpayOrderId || "",

        razorpaySignature: paymentData.razorpaySignature || "",


                subtotal,

                discount,

                deliveryCharge,

                tax,

                totalAmount

            }],
            {
                session
            }
        );

        await reduceStock(orderItems, session);

        cart.items = [];

        cart.totalPrice = 0;

        await cart.save({ session });

        await session.commitTransaction();
        const user = await User.findById(userId);

await sendOrderEmail(user.email, order[0]);

        session.endSession();

        return order[0];

    } catch (error) {

        await session.abortTransaction();

        session.endSession();

        throw error;

    }

};

module.exports = createOrder;