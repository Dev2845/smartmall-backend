const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");

exports.addToWishlist = async (req, res) => {
  try {

    const { productId } = req.body;

    const product = await Product.findById(productId);

    if (!product || product.isDeleted || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    let wishlist = await Wishlist.findOne({
      user: req.user.id
    });

    if (!wishlist) {
      wishlist = new Wishlist({
        user: req.user.id,
        products: []
      });
    }

    const exists = wishlist.products.find(
      item => item.toString() === productId
    );

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Product already in wishlist"
      });
    }

    wishlist.products.push(productId);

    await wishlist.save();

    res.status(200).json({
      success: true,
      message: "Added To Wishlist",
      wishlist
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};
exports.getWishlist = async (req, res) => {

    res.json({
        success: true,
        message: "Wishlist API Working"
    });

};