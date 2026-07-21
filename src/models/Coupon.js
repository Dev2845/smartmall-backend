const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({

    code:{
        type:String,
        required:true,
        unique:true,
        uppercase:true
    },

    description:{
        type:String
    },

    discountType:{
        type:String,
        enum:["Percentage","Fixed"],
        default:"Percentage"
    },

    discountValue:{
        type:Number,
        required:true
    },

    minimumAmount:{
        type:Number,
        default:0
    },

    maximumDiscount:{
        type:Number,
        default:0
    },

    expiryDate:{
        type:Date,
        required:true
    },

    usageLimit:{
        type:Number,
        default:100
    },

    usedCount:{
        type:Number,
        default:0
    },

    isActive:{
        type:Boolean,
        default:true
    }

},{timestamps:true});

module.exports=mongoose.model("Coupon",couponSchema);