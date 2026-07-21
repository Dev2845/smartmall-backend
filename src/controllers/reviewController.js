const Review = require("../models/Review");
const Product = require("../models/Product");
const Order = require("../models/Order");


exports.createReview = async (req, res) => {

    try {

        const {

            productId,

            rating,

            review

        } = req.body;

        // ખરીદ્યું છે કે નહીં?

        const order = await Order.findOne({

            user: req.user.id,

            "orderItems.product": productId,

            orderStatus: "Delivered"

        });

        if (!order) {

            return res.status(400).json({

                success: false,

                message: "Purchase this product first"

            });

        }

        const already = await Review.findOne({

            user: req.user.id,

            product: productId

        });

        if (already) {

            return res.status(400).json({

                success: false,

                message: "Review already exists"

            });

        }

        const newReview = await Review.create({

            user: req.user.id,

            product: productId,

            rating,

            review

        });

        res.status(201).json({

            success: true,

            newReview

        });
        await updateRating(productId);

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }
    

}
const updateRating = async (productId) => {

    const reviews = await Review.find({

        product: productId

    });

    let avg = 0;

    reviews.forEach(r => {

        avg += r.rating;

    });

    avg = reviews.length === 0 ? 0 : avg / reviews.length;

    await Product.findByIdAndUpdate(productId, {

        ratings: avg,

        numReviews: reviews.length

    });

}

exports.getReviews = async (req, res) => {

    try {

        const page = Number(req.query.page) || 1;

        const limit = Number(req.query.limit) || 5;

        const skip = (page - 1) * limit;

        const total = await Review.countDocuments({

            product: req.params.productId

        });

        const reviews = await Review.find({

            product: req.params.productId

        })
        .populate("user", "name")
        .skip(skip)
        .limit(limit)
        .sort({

            createdAt: -1

        });

        res.json({

            success: true,

            page,

            totalPages: Math.ceil(total / limit),

            totalReviews: total,

            reviews

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

exports.updateReview = async (req, res) => {

    try {

        const { rating, review } = req.body;

        const reviewData = await Review.findOne({

            _id: req.params.id,

            user: req.user.id

        });

        if (!reviewData) {

            return res.status(404).json({

                success: false,

                message: "Review Not Found"

            });

        }

        reviewData.rating = rating;
        reviewData.review = review;

        await reviewData.save();

        await updateRating(reviewData.product);

        res.json({

            success: true,

            message: "Review Updated",

            reviewData

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

exports.deleteReview = async (req, res) => {

    try {

        const review = await Review.findOne({

            _id: req.params.id,

            user: req.user.id

        });

        if (!review) {

            return res.status(404).json({

                success: false,

                message: "Review Not Found"

            });

        }

        const productId = review.product;

        await review.deleteOne();

        await updateRating(productId);

        res.json({

            success: true,

            message: "Review Deleted"

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

exports.adminDeleteReview = async (req, res) => {

    try {

        const review = await Review.findById(req.params.id);

        if (!review) {

            return res.status(404).json({

                success: false,

                message: "Review Not Found"

            });

        }

        const productId = review.product;

        await review.deleteOne();

        await updateRating(productId);

        res.json({

            success: true,

            message: "Review Deleted By Admin"

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};