
// import { OpenAI } from "openai";
import dotenv from "dotenv";
import { parseJsonString } from "./blogController.js";
import Product from '../models/productsModel.js';

dotenv.config();


// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// // const extractMultipleProductDetails = async (base64Images) => {
//   try {
//     const prompt = `
// You are a product expert. Given multiple product images, extract structured product details for each image in a JSON array.

// Each product detail must contain:
// - Product Name  
// - Category  
// - Price (with currency)  
// - Original Price  
// - Stock Quantity  
// - Short Description  
// - Weight/Size  
// - Long Description  
// - Expiry Date  
// - Ingredients  
// - Benefits (one per line)  
// - Dosage Instructions  
// - Manufacturer  

// Return a JSON array ONLY with no extra explanation.

// Example Output:
// [
//   {
//     "Product Name": "Vitamin C Supplement",
//     "Category": "Supplements",
//     "Price": "₹49.99",
//     "Original Price": "₹79.99",
//     "Stock Quantity": "150",
//     "Short Description": "Boost your immunity with Vitamin C",
//     "Weight/Size": "2.2 lbs",
//     "Long Description": "A powerful Vitamin C supplement to strengthen your immune system and improve overall health.",
//     "Expiry Date": "2025-12-31",
//     "Ingredients": "Ascorbic Acid, Filler, Capsule Shell",
//     "Benefits": "- Boosts immunity\n- Helps skin health\n- Reduces oxidative stress",
//     "Dosage Instructions": "Take one capsule daily after meal.",
//     "Manufacturer": "HealthPlus Labs"
//   }
// ]

// Here are the images in base64 format:
// ${base64Images.map((img, idx) => `Image ${idx + 1}: ${img}`).join('\n\n')}
// `;

//     const response = await openai.chat.completions.create({
//       model: "gpt-4",
//       input: [
//         { role: "system", content: "You are an expert at extracting structured product details from images." },
//         { role: "user", content: prompt }
//       ]
//     });

//     const rawOutput = response.output_text;

//     const jsonMatch = parseJsonString(rawOutput)

//     if (!jsonMatch) {
//       throw new Error('No valid JSON array found in OpenAI response');
//     }

//     return JSON.parse(jsonMatch);
//   } catch (error) {
//     console.error('Failed to extract multiple product details:', error.message);
//     return null;
//   }
// // };

// export const productGenerate= async (req, res) => {
//   if (!req.files || req.files.length === 0) {
//     return res.status(400).json({ error: "At least one image is required" });
//   }

//   const base64Images = req.files.map(file => file.buffer.toString('base64'));

//   const productDetailsArray = await extractMultipleProductDetails(base64Images);

//   if (!productDetailsArray) {
//     return res.status(500).json({ error: "Failed to extract product details" });
//   }

//   res.status(200).json({ products: productDetailsArray });
// };

// CREATE - Create a new product
export const createProduct = async (req, res) => {
  try {
    const productData = { ...req.body };

    const product = await Product.create(productData);
    if (!product) {
      res.status(401).json({
        message: "Somthing went Wrong while Creating Product"
      })
    }

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create product',
      error: error.message
    });
  }
};

// READ - Get all products with pagination and filtering
export const getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      search,
      minPrice,
      maxPrice,
      inStock
    } = req.query;

    const query = {};

    // Filter by category
    if (category) query.category = category;

    // Filter by stock availability
    if (inStock === 'true') query.stockQuantity = { $gt: 0 };

    // Price range filter
    if (minPrice || maxPrice) {
      query['price.amount'] = {};
      if (minPrice) query['price.amount'].$gte = parseFloat(minPrice);
      if (maxPrice) query['price.amount'].$lte = parseFloat(maxPrice);
    }

    // Search in name and description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
        hasNext: Number(page) * Number(limit) < total,
        hasPrev: Number(page) > 1
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
};

// READ - Get single product by ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message
    });
  }
};

// READ - Get single product by Slug
export const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const product = await Product.findOne({ slug });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message
    });
  }
};

// UPDATE - Update product by ID
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    const product = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update product',
      error: error.message
    });
  }
};

// DELETE - Delete product by ID
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message
    });
  }
};

// UPDATE - Update stock quantity
export const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stockQuantity } = req.body;

    const product = await Product.findByIdAndUpdate(
      id,
      { stockQuantity },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Stock updated successfully',
      data: product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update stock',
      error: error.message
    });
  }
};

// READ - Get products by category
export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const products = await Product.find({ category })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products by category',
      error: error.message
    });
  }
};


