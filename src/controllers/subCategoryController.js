const SubCategory = require("../models/SubCategory");
const Category = require("../models/Category");
const slugify = require("slugify");


exports.createSubCategory = async (req, res) => {
  try {

    const { name, category, description } = req.body;

    // Validation
    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: "Name and Category are required",
      });
    }

    // Check Category Exists
    const categoryExists = await Category.findById(category);

    if (!categoryExists || categoryExists.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Duplicate Check
    const alreadyExists = await SubCategory.findOne({
      name: name.trim(),
      category,
      isDeleted: false,
    });

    if (alreadyExists) {
      return res.status(400).json({
        success: false,
        message: "SubCategory already exists",
      });
    }
    const image = req.file ? req.file.path : "";

    const subCategory = await SubCategory.create({
      name: name.trim(),
      slug: slugify(name, {
        lower: true,
        strict: true,
      }),
      category,
      description,
       image
    });

    res.status(201).json({
      success: true,
      message: "SubCategory created successfully",
      subCategory,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

exports.getAllSubCategories = async (req, res) => {
  try {

    const subCategories = await SubCategory.find({
      isDeleted: false,
    })
      .populate("category", "name slug")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: subCategories.length,
      subCategories,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

exports.getSubCategoryById = async (req, res) => {

  try {

    const subCategory = await SubCategory.findById(req.params.id)
      .populate("category", "name slug");

    if (!subCategory || subCategory.isDeleted) {

      return res.status(404).json({
        success: false,
        message: "SubCategory not found",
      });

    }

    res.status(200).json({
      success: true,
      subCategory,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

exports.updateSubCategory = async (req, res) => {
  try {

    const { name, category, description } = req.body;

    const subCategory = await SubCategory.findById(req.params.id);

    if (!subCategory || subCategory.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "SubCategory not found"
      });
    }

    // Check Category
    if (category) {
      const categoryExists = await Category.findById(category);

      if (!categoryExists || categoryExists.isDeleted) {
        return res.status(404).json({
          success: false,
          message: "Category not found"
        });
      }

      subCategory.category = category;
    }

    if (name) {
      subCategory.name = name.trim();
      subCategory.slug = slugify(name, {
        lower: true,
        strict: true
      });
    }

    if (description) {
      subCategory.description = description;
    }

    await subCategory.save();

    res.status(200).json({
      success: true,
      message: "SubCategory Updated Successfully",
      subCategory
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

exports.deleteSubCategory = async (req, res) => {

  try {

    const subCategory = await SubCategory.findById(req.params.id);

    if (!subCategory) {

      return res.status(404).json({
        success: false,
        message: "SubCategory not found"
      });

    }

    subCategory.isDeleted = true;

    await subCategory.save();

    res.status(200).json({
      success: true,
      message: "SubCategory Deleted Successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

exports.toggleSubCategoryStatus = async (req, res) => {

  try {

    const subCategory = await SubCategory.findById(req.params.id);

    if (!subCategory) {

      return res.status(404).json({
        success: false,
        message: "SubCategory not found"
      });

    }

    subCategory.isActive = !subCategory.isActive;

    await subCategory.save();

    res.status(200).json({
      success: true,
      message: "Status Updated Successfully",
      subCategory
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

exports.getSubCategoryByCategory = async (req, res) => {

  try {

    const { categoryId } = req.params;

    const subCategories = await SubCategory.find({

      category: categoryId,

      isDeleted: false,

      isActive: true

    }).sort({
      name: 1
    });

    res.status(200).json({

      success: true,

      total: subCategories.length,

      subCategories

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};