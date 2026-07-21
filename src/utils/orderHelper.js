const Product = require("../models/Product");

// ============================
// Validate Stock
// ============================

const validateStock = async (cartItems) => {

    for (const item of cartItems) {

        const product = await Product.findById(item.product);

        if (!product) {
            throw new Error("Product Not Found");
        }

        if (!product.isActive || product.isDeleted) {
            throw new Error(`${product.name} is unavailable`);
        }

        if (product.stock < item.quantity) {
            throw new Error(
                `${product.name} has only ${product.stock} items left`
            );
        }
    }
};

// ============================
// Reduce Stock
// ============================

const reduceStock = async (orderItems, session = null) => {

    for (const item of orderItems) {

        await Product.findByIdAndUpdate(

            item.product,

            {
                $inc: {
                    stock: -item.quantity
                }
            },

            session ? { session } : {}

        );

    }

};

// ============================
// Restore Stock
// ============================

const restoreStock = async (orderItems, session = null) => {

    for (const item of orderItems) {

        await Product.findByIdAndUpdate(

            item.product,

            {
                $inc: {
                    stock: item.quantity
                }
            },

            session ? { session } : {}

        );

    }

};

// ============================
// Export
// ============================

module.exports = {

    validateStock,

    reduceStock,

    restoreStock

};