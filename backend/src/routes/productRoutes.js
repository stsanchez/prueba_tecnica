// backend/src/routes/productRoutes.js
const express = require('express');
const {
  getAllProducts,
  getProductsByCategory,
  purchaseProduct,
} = require('../controllers/productController');

const router = express.Router();

router.get('/', getAllProducts);
router.get('/category/:category', getProductsByCategory);
router.post('/:id/purchase', purchaseProduct);

module.exports = router;
