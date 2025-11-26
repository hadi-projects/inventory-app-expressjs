const pool = require('../config/database');

class Inventory {
  static async getAll() {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.query('SELECT * FROM items ORDER BY created_at DESC');
      connection.release();
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.query('SELECT * FROM items WHERE id = ?', [id]);
      connection.release();
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async create(data) {
    try {
      const connection = await pool.getConnection();
      const { name, description, quantity, price, category } = data;
      const [result] = await connection.query(
        'INSERT INTO items (name, description, quantity, price, category) VALUES (?, ?, ?, ?, ?)',
        [name, description, quantity, price, category]
      );
      connection.release();
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async update(id, data) {
    try {
      const connection = await pool.getConnection();
      const { name, description, quantity, price, category } = data;
      await connection.query(
        'UPDATE items SET name = ?, description = ?, quantity = ?, price = ?, category = ? WHERE id = ?',
        [name, description, quantity, price, category, id]
      );
      connection.release();
      return true;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const connection = await pool.getConnection();
      await connection.query('DELETE FROM items WHERE id = ?', [id]);
      connection.release();
      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Inventory;