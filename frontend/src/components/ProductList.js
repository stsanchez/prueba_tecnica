import React, { useState } from "react";

const ProductList = ({ products, currentPage, setCurrentPage, totalPages }) => {
  const [sortOrder, setSortOrder] = useState("asc");

  const handlePurchase = async (productId, productName) => {
    try {
      const response = await fetch(`/api/products/${productId}/purchase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.success) {
        alert(`Compra simulada con éxito para ${productName}`);
        window.location.reload(); // Recargar los productos para reflejar cambios
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error al realizar la compra:", error);
      alert("Ocurrió un error al procesar la compra.");
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    return sortOrder === "asc" ? a.list_price - b.list_price : b.list_price - a.list_price;
  });

  return (
    <div>
      {/* Ordenamiento */}
      <div className="sorting">
        <button onClick={() => setSortOrder("asc")}>&#8595; Precio</button>
        <button onClick={() => setSortOrder("desc")}>&#8593; Precio</button>
      </div>

      {/* Lista de productos */}
      <div className="product-list">
        {sortedProducts.map((product) => (
          <div key={product.id} className="product-card">
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>Categoría: {product.category_name}</p>
            <p>Precio: ${product.list_price}</p>
            <p>Stock: {product.cant_aprox > 0 ? product.cant_aprox : "Sin stock"}</p>
            <button
              onClick={() => handlePurchase(product.id, product.name)}
              disabled={product.cant_aprox === 0}
            >
              {product.cant_aprox > 0 ? "Comprar" : "Agotado"}
            </button>
          </div>
        ))}
      </div>

      {/* Paginación */}
      <div className="pagination">
        {[...Array(totalPages).keys()].map((number) => (
          <button
            key={number}
            onClick={() => setCurrentPage(number + 1)}
            className={currentPage === number + 1 ? "active" : ""}
          >
            {number + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
