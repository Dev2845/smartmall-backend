const Coupon=require("../models/Coupon");
const Cart = require("../models/Cart");


exports.createCoupon=async(req,res)=>{

try{

const coupon=await Coupon.create(req.body);

res.status(201).json({

success:true,

coupon

});

}

catch(error){

res.status(500).json({

success:false,

message:error.message

});

}

}
exports.getCoupons=async(req,res)=>{

try{

const coupons=await Coupon.find().sort({createdAt:-1});

res.json({

success:true,

coupons

});

}

catch(error){

res.status(500).json({

success:false,

message:error.message

});

}

}
exports.getCoupon=async(req,res)=>{

try{

const coupon=await Coupon.findById(req.params.id);

if(!coupon){

return res.status(404).json({

success:false,

message:"Coupon Not Found"

});

}

res.json({

success:true,

coupon

});

}

catch(error){

res.status(500).json({

success:false,

message:error.message

});

}

}

exports.deleteCoupon=async(req,res)=>{

try{

await Coupon.findByIdAndDelete(req.params.id);

res.json({

success:true,

message:"Coupon Deleted"

});

}

catch(error){

res.status(500).json({

success:false,

message:error.message

});

}

}
exports.applyCoupon = async (req, res) => {

    try {

        const { code } = req.body;

        const coupon = await Coupon.findOne({
            code: code.toUpperCase(),
            isActive: true
        });

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Invalid Coupon"
            });
        }

        if (coupon.expiryDate < new Date()) {
            return res.status(400).json({
                success: false,
                message: "Coupon Expired"
            });
        }

        const cart = await Cart.findOne({
            user: req.user.id
        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart Not Found"
            });
        }

        if (cart.totalPrice < coupon.minimumAmount) {
            return res.status(400).json({
                success: false,
                message: `Minimum Order ₹${coupon.minimumAmount}`
            });
        }

        let discount = 0;

        if (coupon.discountType === "Percentage") {

            discount = (cart.totalPrice * coupon.discountValue) / 100;

            if (
                coupon.maximumDiscount > 0 &&
                discount > coupon.maximumDiscount
            ) {
                discount = coupon.maximumDiscount;
            }

        } else {

            discount = coupon.discountValue;

        }

        cart.coupon = coupon._id;
        cart.discount = discount;
        cart.finalAmount = cart.totalPrice - discount;

        await cart.save();

        res.json({

            success: true,

            message: "Coupon Applied",

            discount,

            finalAmount: cart.finalAmount

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
exports.removeCoupon = async (req, res) => {

    try {

        const cart = await Cart.findOne({
            user: req.user.id
        });

        if (!cart) {

            return res.status(404).json({

                success: false,

                message: "Cart Not Found"

            });

        }

        cart.coupon = null;
        cart.discount = 0;
        cart.finalAmount = cart.totalPrice;

        await cart.save();

        res.json({

            success: true,

            message: "Coupon Removed",

            cart

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};