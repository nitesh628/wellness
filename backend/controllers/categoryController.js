import Category from "../models/categoryModel.js";
import {uploadToS3, deleteOldImage ,upload} from "../config/s3Config.js"


// Create Category
export const createCategory =  async (req, res) => {
  try {
    const { name, slug, description, status, parentCategory, metaTitle, metaDescription } = req.body;
    let imageUrl = "";

    if (req.file) {
      imageUrl = await uploadToS3(req.file);
    }
    if (!name || !slug) {
      return res.status(400).json({ success: false, message: "Name and slug are required" });
    }

    const existing = await Category.findOne({ slug });
    if (existing) {
      return res.status(400).json({ success: false, message: "Slug already exists" });
    }

    const category = await Category.create({
      name,
      slug,
      description,
      imageUrl,
      status,
      parentCategory: parentCategory || null,
      metaTitle,
      metaDescription,
    });

    if (!category) {
      return res.status(400).json({ success: false, message: "Category creation failed" });
    }
    console.log(category);
    

    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get all Categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate("parentCategory", "name slug");
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get single Category
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate("parentCategory", "name slug");
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Update Category
export const updateCategory = async (req, res) => {
  try {
    const { name, description, imageUrl, status, parentCategory, metaTitle, metaDescription } = req.body;

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    // Don't allow slug update for safety
    category.name = name || category.name;
    category.description = description || category.description;
    category.imageUrl = imageUrl || category.imageUrl;
    category.status = status || category.status;
    category.parentCategory = parentCategory || null;
    category.metaTitle = metaTitle || category.metaTitle;
    category.metaDescription = metaDescription || category.metaDescription;

    await category.save();
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Delete Category
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    res.status(200).json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
