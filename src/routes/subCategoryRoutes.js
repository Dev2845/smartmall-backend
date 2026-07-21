const express = require("express");
const upload = require("../middlewares/upload");

const router = express.Router();

const {

    createSubCategory,

    getAllSubCategories,

    getSubCategoryById,

    updateSubCategory,

    deleteSubCategory,

    toggleSubCategoryStatus,

    getSubCategoryByCategory

} = require("../controllers/subCategoryController");

const {

    verifyToken,

    isAdmin

} = require("../middlewares/authMiddleware");


// ============================
// Public Routes
// ============================

// Get All SubCategories

router.get("/", getAllSubCategories);



// Get SubCategory By Category

router.get("/category/:categoryId", getSubCategoryByCategory);

// Get Single SubCategory

router.get("/:id", getSubCategoryById);

// ============================
// Admin Routes
// ============================

// Create

router.post(

    "/",

    verifyToken,
    isAdmin,
    upload.single("image"),
    createSubCategory

);

// Update

router.put(

    "/:id",

    verifyToken,

    isAdmin,

    updateSubCategory

);

// Delete

router.delete(

    "/:id",

    verifyToken,

    isAdmin,

    deleteSubCategory

);

// Active / Inactive

router.patch(

    "/toggle/:id",

    verifyToken,

    isAdmin,

    toggleSubCategoryStatus

);

module.exports = router;