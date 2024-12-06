// backend/src/app.js
const express = require('express');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/products', productRoutes);

app.get('/api/ping', (req, res) => {
  res.send('Servidor funcionando correctamente');
});

module.exports = app;
