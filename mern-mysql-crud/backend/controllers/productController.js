const Product = require('../models/Product');
const path = require('path');
const fs = require('fs');

// Get all products
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.getAll();
        res.json({ success: true, data: products });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get single product
exports.getProduct = async (req, res) => {
    try {
        const product = await Product.getById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }
        res.json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Create product
exports.createProduct = async (req, res) => {
    try {
        const { name, description, price } = req.body;
        const image = req.file ? req.file.filename : null;

        if (!name || !price) {
            return res.status(400).json({ success: false, error: 'Name and price are required' });
        }

        const product = await Product.create({ name, description, price, image });
        res.status(201).json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Update product
exports.updateProduct = async (req, res) => {
    try {
        const { name, description, price } = req.body;
        const image = req.file ? req.file.filename : null;

        // Get old product to delete old image if exists
        const oldProduct = await Product.getById(req.params.id);
        
        // Update product
        const product = await Product.update(req.params.id, { name, description, price, image });

        // Delete old image if new image uploaded
        if (image && oldProduct && oldProduct.image) {
            const oldImagePath = path.join(__dirname, '../uploads', oldProduct.image);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        res.json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Delete product
exports.deleteProduct = async (req, res) => {
    try {
        // Get product to delete image
        const product = await Product.getById(req.params.id);
        
        // Delete product from database
        await Product.delete(req.params.id);

        // Delete image file if exists
        if (product && product.image) {
            const imagePath = path.join(__dirname, '../uploads', product.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};