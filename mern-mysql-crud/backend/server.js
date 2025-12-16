const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load env vars
dotenv.config();

// Route files
const productRoutes = require('./routes/products');
const db = require('./config/db');

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors());

// Create uploads folder if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Set static folder
app.use('/uploads', express.static(uploadsDir));

// Mount routers
app.use('/api/products', productRoutes);

// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to MERN CRUD API with MySQL' });
});

// Health check route
app.get('/api/health', async (req, res) => {
    try {
        const connection = await db.getConnection();
        connection.release();
        res.json({ status: 'Database connected' });
    } catch (error) {
        res.status(500).json({ status: 'Database connection failed', error: error.message });
    }
});

const PORT = process.env.PORT || 5000;

// Initialize database and start server
const initializeDatabase = async () => {
    try {
        // Test database connection
        const connection = await db.getConnection();
        console.log('✓ Database connected successfully');
        connection.release();

        // Create products table if it doesn't exist
        await db.query(`
            CREATE TABLE IF NOT EXISTS products (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                price DECIMAL(10, 2) NOT NULL,
                image VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('✓ Products table ready');

        // Start server
        app.listen(PORT, () => {
            console.log(`✓ Server running on port ${PORT}`);
            console.log(`✓ API URL: http://localhost:${PORT}/api`);
        });
    } catch (error) {
        console.error('✗ Failed to initialize:', error.message);
        process.exit(1);
    }
};

initializeDatabase();