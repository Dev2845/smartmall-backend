const express=require("express");

const router=express.Router();

const{

createCoupon,

getCoupons,

getCoupon,

deleteCoupon,
  applyCoupon,
    removeCoupon

}=require("../controllers/couponController");

const{

verifyToken,

isAdmin

}=require("../middlewares/authMiddleware");

router.post("/",verifyToken,isAdmin,createCoupon);

router.get("/",getCoupons);

router.get("/:id",getCoupon);

router.delete("/:id",verifyToken,isAdmin,deleteCoupon);
router.post(
    "/apply",
    verifyToken,
    applyCoupon
);

router.delete(
    "/remove",
    verifyToken,
    removeCoupon
);

module.exports=router;