// index.js o app.js

const express = require('express');
const { Pool } = require('pg'); // Para la conexión a PostgreSQL
const dotenv = require('dotenv');

// Configurar el entorno y las variables de entorno
dotenv.config();

// Crear la instancia de Express
const app = express();

// Crear la conexión a la base de datos
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

const cors = require('cors');

app.use(cors());

// Middleware para parsear las solicitudes con JSON
app.use(express.json());

// Ruta simple para probar el servidor
app.get('/api/ping', (req, res) => {
  res.send('Servidor funcionando correctamente');
});

// Ruta para obtener todos los productos
app.get('/api/products', async (req, res) => {
  const client = await pool.connect();
  try {
    const queryText = `
      SELECT pt.*, pc.name AS category_name
      FROM product_template pt
      LEFT JOIN product_category pc ON pt.categ_id = pc.id
      WHERE pt.categ_id IS NOT null AND pt.list_price IS NOT null
      LIMIT 400;
    `;
    const result = await client.query(queryText);
    res.json(result.rows); // Devuelve los productos como JSON
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener los productos' });
  } finally {
    client.release();
  }
});

// Ruta para filtrar productos por categoría
app.get('/api/products/category/:category', async (req, res) => {
  const { category } = req.params;
  const client = await pool.connect();
  try {
    const queryText = `
      SELECT pt.*, pc.name AS category_name
      FROM product_template pt
      LEFT JOIN product_category pc ON pt.categ_id = pc.id
      WHERE pc.name = $1 AND pt.list_price IS NOT null
      LIMIT 400;
    `;
    const result = await client.query(queryText, [category]);
    res.json(result.rows); // Devuelve los productos de esa categoría
  } catch (error) {
    console.error('Error al obtener productos por categoría:', error);
    res.status(500).json({ error: 'Error al obtener productos por categoría' });
  } finally {
    client.release();
  }
});

// Configuración del puerto y arranque del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

app.post('/api/products/:id/purchase', async (req, res) => {
    const { id } = req.params;
    const client = await pool.connect();
    try {
      const queryText = `
        UPDATE product_template
        SET qty_available = qty_available - 1
        WHERE id = $1 AND qty_available > 0;
      `;
      const result = await client.query(queryText, [id]);
  
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
  });
  