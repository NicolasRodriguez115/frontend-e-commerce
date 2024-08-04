import React, {useState, useEffect} from "react";
import NavigationBar from "./NavigationBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProductList = () => {
  const [products, setProducts] = useState([]); 
  const navigate = useNavigate(); 

  // Fetch product function
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5001/products'); 
      setProducts(response.data)

    } catch (error)  {
      console.log("Error fetching products:", error)
      const fetchedProducts = [
        { 
          product_id: 1,
          name: "TeaLatteLove",
          price: "0.03"
        }, 
        {
          product_id: 2,
          name: "ILoveFrontend",
          price: "1.34"
        }
      ]
      setProducts(fetchedProducts)
    }
  }

  // Delete product function 
  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5001/products/${id}`)
      fetchProducts(); 
    } catch (error) {
      console.log(`Error deleting products ${products}`)
    }
  }

  useEffect(() => {
    // Fetch products 
    fetchProducts(); 
  }, [])

  return (
    <div className="product-list">
      <NavigationBar />
      <h3>Products</h3>
      <ul>
        {products.map(product => (
          <li key={product.product_id}>
            <p>{product.name}: ${product.price}</p>
            <button onClick={() => navigate(`/edit-product/${product.product_id}`)}>Edit</button>
            <button onClick={() => deleteProduct(product.product_id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )

}

export default ProductList