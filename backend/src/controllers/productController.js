// backend/src/controllers/productController.js
const pool = require('../config/db');

// Obtener todos los productos
const getAllProducts = async (req, res) => {
  const client = await pool.connect();
  try {
    const query = `
      SELECT pt.*, pc.name AS category_name
      FROM product_template pt
      LEFT JOIN product_category pc ON pt.categ_id = pc.id
      WHERE pt.categ_id IS NOT null AND pt.list_price IS NOT null
      LIMIT 400;
    `;
    const result = await client.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener los productos' });
  } finally {
    client.release();
  }
};

// Obtener productos por categoría
const getProductsByCategory = async (req, res) => {
  const { category } = req.params;
  const client = await pool.connect();
  try {
    const query = `
      SELECT pt.*, pc.name AS category_name
      FROM product_template pt
      LEFT JOIN product_category pc ON pt.categ_id = pc.id
      WHERE pc.name = $1 AND pt.list_price IS NOT null
      LIMIT 400;
    `;
    const result = await client.query(query, [category]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener productos por categoría:', error);
    res.status(500).json({ error: 'Error al obtener productos por categoría' });
  } finally {
    client.release();
  }
};

// Simular compra
const purchaseProduct = async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();
  try {
    const query = `
      UPDATE product_template
      SET qty_available = qty_available - 1
      WHERE id = $1 AND qty_available > 0;
    `;
    const result = await client.query(query, [id]);

    if (result.rowCount > 0) {
      res.json({ success: true, message: "Compra simulada con éxito" });
    } else {
      res.status(400).json({ success: false, message: "Stock insuficiente" });
    }
  } catch (error) {
    console.error('Error al simular compra:', error);
    res.status(500).json({ success: false, message: "Error en el servidor" });
  } finally {
    client.release();
  }
};

module.exports = {
  getAllProducts,
  getProductsByCategory,
  purchaseProduct,
};
