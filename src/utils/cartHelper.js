const Product = require("../models/Product");

const calculateCartTotal = async (cart) => {

    let totalPrice = 0;

    for (const item of cart.items) {

        const product = await Product.findById(item.product);

        if (!product) continue;

        const price = product.discountPrice > 0
            ? product.discountPrice
            : product.price;

        totalPrice += price * item.quantity;
    }

    cart.totalPrice = totalPrice;

    return totalPrice;
};

module.exports = calculateCartTotal;