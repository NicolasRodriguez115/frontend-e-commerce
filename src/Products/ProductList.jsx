import React, { useState, useEffect } from "react";
import NavigationBar from "../NavigationBar";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Products.css";

const ProductList = ({ onProductSelect }) => {
  const [products, setProducts] = useState([]);

  // Fetch product function
  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5001/products");
      setProducts(response.data);
    } catch (error) {
      console.log("Error fetching products:", error);
    }
  };

  // Delete product function
  const deleteProduct = async id => {
    try {
      await axios.delete(`http://127.0.0.1:5001/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.log(`Error deleting products ${products}`);
    }
  };

  useEffect(() => {
    // Fetch products
    fetchProducts();
  }, []);

  return (
    <div>
      <NavigationBar />
      <div className="products-list-container">
      <div className="product-list">
      <h3>Products</h3>
      <ul className="product-ul">
        {products.map(product => (
          <li key={product.product_id}>
            <div>
            <p>
              {product.name}: ${product.price}
            </p>
            <div className="buttons-container">

            </div>
            <Link
              to={`/edit-product/${product.product_id}`}
              onClick={() => onProductSelect(product)}
            >
              <button className="product-button" type="button">Update</button>
            </Link>
            <button className="product-button" type="button" onClick={() => deleteProduct(product.product_id)}>
              Delete
            </button>

            </div>
          </li>
        ))}
      </ul>

      </div>

      </div>
    </div>
  );
};

export default ProductList;
