const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },

        name: String,

        image: String,

        price: Number,

        quantity: Number,
    },
    {
        _id: false,
    }
);

const shippingAddressSchema = new mongoose.Schema(
    {
        fullName: String,
        mobile: String,
        alternateMobile: String,

        addressLine1: String,
        addressLine2: String,

        landmark: String,

        city: String,
        state: String,
        country: String,

        pincode: String,
    },
    {
        _id: false,
    }
);

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        orderItems: [orderItemSchema],

        shippingAddress: shippingAddressSchema,

        paymentId: {
    type: String,
    default: ""
},

razorpayOrderId: {
    type: String,
    default: ""
},

razorpaySignature: {
    type: String,
    default: ""
},

paymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Failed", "Refunded"],
    default: "Pending"
},
        orderStatus: {
            type: String,
            enum: [
                "Pending",
                "Confirmed",
                "Packed",
                "Shipped",
                "Delivered",
                "Cancelled",
            ],
            default: "Pending",
        },

        subtotal: {
            type: Number,
            required: true,
        },

        discount: {
            type: Number,
            default: 0,
        },

        deliveryCharge: {
            type: Number,
            default: 0,
        },

        tax: {
            type: Number,
            default: 0,
        },

        totalAmount: {
            type: Number,
            required: true,
        },
        orderNumber: {
            type: String,
            unique: true,
            required: true
        },
        invoiceNumber: {
    type: String,
    unique: true
},
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Order", orderSchema);