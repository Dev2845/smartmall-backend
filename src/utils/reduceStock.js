const Product = require("../models/Product");

const reduceStock = async (orderItems, session) => {

    for (const item of orderItems) {

       await Product.findByIdAndUpdate(
    item.product,
    {
        $inc: {
            stock: -item.quantity
        }
    },
    {
        session
    }
);

    }

};

module.exports = reduceStock;