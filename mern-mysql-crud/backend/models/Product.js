const db = require('../config/db');

class Product {
    static async getAll() {
        const [rows] = await db.query('SELECT * FROM products ORDER BY created_at DESC');
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
        return rows[0];
    }

    static async create({ name, description, price, image }) {
        const [result] = await db.query(
            'INSERT INTO products (name, description, price, image) VALUES (?, ?, ?, ?)',
            [name, description, price, image]
        );
        return { id: result.insertId, name, description, price, image };
    }

    static async update(id, { name, description, price, image }) {
        if (image) {
            await db.query(
                'UPDATE products SET name = ?, description = ?, price = ?, image = ? WHERE id = ?',
                [name, description, price, image, id]
            );
        } else {
            await db.query(
                'UPDATE products SET name = ?, description = ?, price = ? WHERE id = ?',
                [name, description, price, id]
            );
        }
        return { id, name, description, price, image };
    }

    static async delete(id) {
        await db.query('DELETE FROM products WHERE id = ?', [id]);
        return true;
    }
}

module.exports = Product;