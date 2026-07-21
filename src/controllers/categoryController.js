const Category = require("../models/Category");
const slugify = require("slugify");


exports.createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        // Validation
        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Category name is required",
            });
        }

        // Duplicate Check
        const categoryExists = await Category.findOne({
            name: name.trim(),
            isDeleted: false,
        });

        if (categoryExists) {
            return res.status(400).json({
                success: false,
                message: "Category already exists",
            });
        }

        const image = req.file ? req.file.path : "";
        // Create Category
        const category = await Category.create({
            name: name.trim(),
            slug: slugify(name, { lower: true, strict: true }),
            description,
            image
        });

        res.status(201).json({
            success: true,
            message: "Category created successfully",
            category,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// get all
exports.getAllCategories = async (req, res) => {

    try {

        const categories = await Category.find({
            isDeleted: false,
        }).sort({
            createdAt: -1,
        });

        res.status(200).json({
            success: true,
            total: categories.length,
            categories,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

// single id
exports.getCategoryById = async (req, res) => {

    try {

        const category = await Category.findById(req.params.id);

        if (!category || category.isDeleted) {

            return res.status(404).json({
                success: false,
                message: "Category not found",
            });

        }

        res.status(200).json({
            success: true,
            category,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

// update 
exports.updateCategory = async (req, res) => {

    try {

        const { name, description } = req.body;

        const category = await Category.findById(req.params.id);

        if (!category) {

            return res.status(404).json({

                success: false,

                message: "Category not found"

            });

        }

        category.name = name || category.name;

        category.description = description || category.description;

        category.slug = slugify(category.name, { lower: true });

        await category.save();

        res.status(200).json({

            success: true,

            message: "Category Updated",

            category

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

}

exports.deleteCategory = async (req, res) => {

    try {

        const category = await Category.findById(req.params.id);

        if (!category) {

            return res.status(404).json({

                success: false,

                message: "Category Not Found"

            });

        }

        category.isDeleted = true;

        await category.save();

        res.status(200).json({

            success: true,

            message: "Category Deleted"

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

}

// inactive and avtive
exports.toggleCategory = async (req, res) => {

    try {

        const category = await Category.findById(req.params.id);

        category.isActive = !category.isActive;

        await category.save();

        res.json({

            success: true,

            category

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

}

// search category
exports.searchCategory = async (req, res) => {

    const keyword = req.query.keyword || "";

    const categories = await Category.find({

        name: {

            $regex: keyword,

            $options: "i"

        },

        isDeleted: false

    });

    res.json({

        success: true,

        categories

    });

}

// get catro pegination
exports.getCategories = async (req, res) => {

    const page = Number(req.query.page) || 1;

    const limit = 10;

    const skip = (page - 1) * limit;

    const categories = await Category.find({

        isDeleted: false

    })

        .skip(skip)

        .limit(limit)

        .sort({

            createdAt: -1

        });

    const total = await Category.countDocuments({

        isDeleted: false

    });

    res.json({

        success: true,

        page,

        pages: Math.ceil(total / limit),

        total,

        categories

    });

}