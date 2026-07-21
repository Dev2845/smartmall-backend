const Cart = require("../models/Cart");
const Product = require("../models/Product");
const calculateCartTotal = require("../utils/cartHelper");


exports.addToCart = async (req, res) => {
  try {

    const { productId, quantity } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required"
      });
    }

    // Find Product
    const product = await Product.findById(productId);

    if (!product || product.isDeleted || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // Check Stock
    const qty = quantity || 1;

    if (qty > product.stock) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock"
      });
    }

    // Find User Cart
    let cart = await Cart.findOne({
      user: req.user.id
    });

    // Create Cart
    if (!cart) {
      cart = new Cart({
        user: req.user.id,
        items: []
      });
    }

    // Check Existing Product
    const existingItem = cart.items.find(
      item => item.product.toString() === productId
    );

    if (existingItem) {

      existingItem.quantity += qty;

      if (existingItem.quantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: "Stock limit exceeded"
        });
      }

    } else {

      cart.items.push({
        product: productId,
        quantity: qty
      });

    }

    // Calculate Total
    await calculateCartTotal(cart);

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Product Added To Cart",
      cart
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

exports.getCart = async (req, res) => {
  try {

    const cart = await Cart.findOne({
      user: req.user.id
    }).populate({
      path: "items.product",
      select: "name images price discountPrice stock"
    });

    if (!cart) {
      return res.status(200).json({
        success: true,
        cart: {
          items: [],
          totalPrice: 0
        }
      });
    }

    res.status(200).json({
      success: true,
      cart
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

exports.removeProduct = async (req, res) => {

  try {

    const { productId } = req.params;

    const cart = await Cart.findOne({
      user: req.user.id
    });

    if (!cart) {

      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });

    }

    cart.items = cart.items.filter(

      item => item.product.toString() !== productId

    );

   await calculateCartTotal(cart)

    cart.totalPrice = total;

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Product Removed",
      cart
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

exports.clearCart = async (req, res) => {

  try {

    const cart = await Cart.findOne({
      user: req.user.id
    });

    if (!cart) {

      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });

    }

    cart.items = [];

    cart.totalPrice = 0;

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart Cleared"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

exports.updateQuantity = async (req, res) => {

  try {

    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({
      user: req.user.id
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }

    const item = cart.items.find(
      item => item.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart"
      });
    }

    const product = await Product.findById(productId);

    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: "Stock not available"
      });
    }

    item.quantity = quantity;

    // Recalculate Total
    await calculateCartTotal(cart);

    cart.totalPrice = total;

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Quantity Updated",
      cart
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};