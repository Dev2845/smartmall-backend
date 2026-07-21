const Product = require("../models/Product");
const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");
const slugify = require("slugify");

exports.createProduct = async (req, res) => {
  try {

    const {name, description,category,subCategory,brand,price,discountPrice,stock,weight} = req.body;

    // Validation
    if (
      !name ||
      !category ||
      !subCategory ||
      !price ||
      stock === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields"
      });
    }

    // Category Check
    const categoryExists = await Category.findById(category);

    if (!categoryExists || categoryExists.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    // SubCategory Check
    const subCategoryExists = await SubCategory.findById(subCategory);

    if (!subCategoryExists || subCategoryExists.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "SubCategory not found"
      });
    }

    // Check Relation
    if (
      subCategoryExists.category.toString() !== category.toString()
    ) {
      return res.status(400).json({
        success: false,
        message: "SubCategory does not belong to selected Category"
      });
    }

    // Images
    const images = req.files
      ? req.files.map(file => file.path)
      : [];

    // SKU Generate
    const sku = "SM-" + Date.now();

    const product = await Product.create({
      name,
      slug: slugify(name, {
        lower: true,
        strict: true
      }),
      description,
      category,
      subCategory,
      brand,
      images,
      sku,
      price,
      discountPrice,
      stock,
      weight,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: "Product Created Successfully",
      product
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

exports.getAllProducts = async (req, res) => {

    try {

        const page = Number(req.query.page) || 1;

        const limit = Number(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const {

            keyword,

            category,

            subcategory,

            minPrice,

            maxPrice

        } = req.query;

        let filter = {

            isDeleted: false,

            isActive: true

        };

        if (keyword) {

            filter.name = {

                $regex: keyword,

                $options: "i"

            };

        }

        if (category) {

            filter.category = category;

        }

        if (subcategory) {

            filter.subcategory = subcategory;

        }

        if (minPrice || maxPrice) {

            filter.price = {};

            if (minPrice) filter.price.$gte = Number(minPrice);

            if (maxPrice) filter.price.$lte = Number(maxPrice);

        }

        const total = await Product.countDocuments(filter);

        const products = await Product.find(filter)

            .populate("category", "name")

            .populate("subcategory", "name")

            .skip(skip)

            .limit(limit)

            .sort({ createdAt: -1 });

        res.json({

            success: true,

            page,

            totalPages: Math.ceil(total / limit),

            totalProducts: total,

            products

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

exports.getProductById = async (req, res) => {

  try {

    const product = await Product.findById(req.params.id)
      .populate("category", "name")
      .populate("subCategory", "name");

    if (!product || product.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      product
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

exports.searchProducts = async (req, res) => {

  try {

    const keyword = req.query.keyword || "";

    const products = await Product.find({

      name: {
        $regex: keyword,
        $options: "i"
      },

      isDeleted: false,

      isActive: true

    });

    res.status(200).json({

      success: true,

      total: products.length,

      products

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};

exports.getProductsByCategory = async (req, res) => {

  try {

    const products = await Product.find({

      category: req.params.categoryId,

      isDeleted: false,

      isActive: true

    });

    res.status(200).json({

      success: true,

      total: products.length,

      products

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};

exports.getProductsBySubCategory = async (req, res) => {

  try {

    const products = await Product.find({

      subCategory: req.params.subCategoryId,

      isDeleted: false,

      isActive: true

    });

    res.status(200).json({

      success: true,

      total: products.length,

      products

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};


exports.updateProduct = async (req, res) => {
  try {

    const product = await Product.findById(req.params.id);

    if (!product || product.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    const {
      name,
      description,
      category,
      subCategory,
      brand,
      price,
      discountPrice,
      stock,
      weight
    } = req.body;

    // Validate Category
    if (category) {
      const categoryExists = await Category.findById(category);

      if (!categoryExists || categoryExists.isDeleted) {
        return res.status(404).json({
          success: false,
          message: "Category not found"
        });
      }

      product.category = category;
    }

    // Validate SubCategory
    if (subCategory) {
      const subCategoryExists = await SubCategory.findById(subCategory);

      if (!subCategoryExists || subCategoryExists.isDeleted) {
        return res.status(404).json({
          success: false,
          message: "SubCategory not found"
        });
      }

      product.subCategory = subCategory;
    }

    if (name) {
      product.name = name;
      product.slug = slugify(name, {
        lower: true,
        strict: true
      });
    }

    if (description) product.description = description;
    if (brand) product.brand = brand;
    if (price) product.price = price;
    if (discountPrice) product.discountPrice = discountPrice;
    if (stock !== undefined) product.stock = stock;
    if (weight) product.weight = weight;

    // Replace Images (Optional)
    if (req.files && req.files.length > 0) {
      product.images = req.files.map(file => file.path);
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product Updated Successfully",
      product
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

exports.deleteProduct = async (req, res) => {

  try {

    const product = await Product.findById(req.params.id);

    if (!product) {

      return res.status(404).json({
        success: false,
        message: "Product not found"
      });

    }

    product.isDeleted = true;

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product Deleted Successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

exports.toggleProductStatus = async (req, res) => {

  try {

    const product = await Product.findById(req.params.id);

    if (!product) {

      return res.status(404).json({
        success: false,
        message: "Product not found"
      });

    }

    product.isActive = !product.isActive;

    await product.save();

    res.status(200).json({
      success: true,
      product
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

exports.toggleFeatured = async (req, res) => {

  try {

    const product = await Product.findById(req.params.id);

    product.featured = !product.featured;

    await product.save();

    res.json({
      success: true,
      product
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

exports.toggleTrending = async (req, res) => {

  try {

    const product = await Product.findById(req.params.id);

    product.trending = !product.trending;

    await product.save();

    res.json({
      success: true,
      product
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

exports.toggleBestSeller = async (req, res) => {

  try {

    const product = await Product.findById(req.params.id);

    product.bestSeller = !product.bestSeller;

    await product.save();

    res.json({
      success: true,
      product
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};
exports.softDeleteProduct = async (req, res) => {

    try {

        const product = await Product.findById(req.params.id);

        if (!product) {

            return res.status(404).json({

                success: false,

                message: "Product Not Found"

            });

        }

        product.isDeleted = true;

        await product.save();

        res.json({

            success: true,

            message: "Product Deleted Successfully"

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


exports.restoreProduct = async (req, res) => {

    try {

        const product = await Product.findById(req.params.id);

        if (!product) {

            return res.status(404).json({

                success: false,

                message: "Product Not Found"

            });

        }

        product.isDeleted = false;

        await product.save();

        res.json({

            success: true,

            message: "Product Restored Successfully"

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};