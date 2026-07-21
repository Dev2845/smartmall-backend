const express = require("express");

const router = express.Router();

const {

    createReview,

    getReviews,

    updateReview,

    deleteReview,

    adminDeleteReview

} = require("../controllers/reviewController");

const {

    verifyToken,

    isAdmin

} = require("../middlewares/authMiddleware");

router.post(

    "/",

    verifyToken,

    createReview

);

router.get(

    "/:productId",

    getReviews

);

router.put(

    "/:id",

    verifyToken,

    updateReview

);

router.delete(

    "/:id",

    verifyToken,

    deleteReview

);

router.delete(

    "/admin/:id",

    verifyToken,

    isAdmin,

    adminDeleteReview

);
module.exports = router;