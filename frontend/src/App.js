import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductList from './components/ProductList';
import "./styles.css";

const App = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  // Cargar productos desde el backend
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/products")
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  // Extraer categorías únicas
  useEffect(() => {
    const uniqueCategories = [
      ...new Set(products.map((product) => product.category_name)),
    ];
    setCategories(uniqueCategories);
  }, [products]);

  // Filtrar productos por categoría
  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category_name === selectedCategory)
    : products;

  // Paginación
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  return (
    <div className="app">
      <header>
        <h1>Tienda de Productos</h1>
        <select
          onChange={(e) => setSelectedCategory(e.target.value)}
          value={selectedCategory}
        >
          <option value="">Todas las Categorías</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </header>
      <ProductList
        products={currentProducts}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={Math.ceil(filteredProducts.length / productsPerPage)}
      />
    </div>
  );
};

export default App;
