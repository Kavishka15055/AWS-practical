const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

// Create connection to MySQL
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

connection.connect((err) => {
    if (err) {
        console.error('✗ Connection failed:', err.message);
        process.exit(1);
    }
    console.log('✓ Connected to MySQL');

    // Create database
    const createDbQuery = `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`;
    connection.query(createDbQuery, (err) => {
        if (err) {
            console.error('✗ Error creating database:', err.message);
            process.exit(1);
        }
        console.log(`✓ Database '${process.env.DB_NAME}' ready`);

        // Use the database
        connection.query(`USE ${process.env.DB_NAME}`, (err) => {
            if (err) {
                console.error('✗ Error selecting database:', err.message);
                process.exit(1);
            }

            // Create products table
            const createTableQuery = `
                CREATE TABLE IF NOT EXISTS products (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    description TEXT,
                    price DECIMAL(10, 2) NOT NULL,
                    image VARCHAR(255),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                )
            `;

            connection.query(createTableQuery, (err) => {
                if (err) {
                    console.error('✗ Error creating table:', err.message);
                    process.exit(1);
                }
                console.log('✓ Table "products" created/verified');
                connection.end();
                console.log('✓ Database initialization complete!');
            });
        });
    });
});
