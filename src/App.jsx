import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import AddCustomer from "./AddCustomer";
import CustomerList from "./CustomersList";
import AddProduct from "./AddProduct";
import ProductList from "./ProductList";
import NotFound from "./NotFound";
import "./App.css";
import CustomerDetails from "./CustomerDetails";
import EditCustomer from "./EditCustomer";
import EditProduct from "./EditProduct";

function App() {

  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer)
  }

  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleProductSelect = (product) => {
    setSelectedProduct(product)
  }
  return (
    <div className="app-container">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add-customer/" element={<AddCustomer />} />
          <Route path="/edit-customer/:id" element={<EditCustomer customer={selectedCustomer} />} />
          <Route path="/customers" element={<CustomerList onCustomerSelect={handleCustomerSelect}/>} />
          <Route path="/customer/:id" element={selectedCustomer && 
              <CustomerDetails customer={selectedCustomer} />}/>
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/edit-product/:id" element={<EditProduct product={selectedProduct} />} />
          <Route path="/products" element={<ProductList onProductSelect={handleProductSelect} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
