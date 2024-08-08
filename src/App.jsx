import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import AddCustomer from "./Customers/AddCustomer";
import CustomerList from "./Customers/CustomersList";
import AddProduct from "./Products/AddProduct";
import ProductList from "./Products/ProductList";
import NotFound from "./NotFound";
import "./App.css";
import CustomerDetails from "./Customers/CustomerDetails";
import EditCustomer from "./Customers/EditCustomer";
import EditProduct from "./Products/EditProduct";
import OrderList from "./Orders/OrderList";
import AddOrder from "./Orders/PlaceOrder";
import OrderDetails from "./Orders/OrderDetails";

function App() {
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const handleCustomerSelect = customer => {
    setSelectedCustomer(customer);
  };

  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleProductSelect = product => {
    setSelectedProduct(product);
  };

  const [selectedOrder, setSelectedOrder] = useState(null);
  const handleOrderSelect = order => {
    setSelectedOrder(order)
  }
  return (
    <div className="app-container">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add-customer/" element={<AddCustomer />} />
          <Route
            path="/edit-customer/:id"
            element={<EditCustomer customer={selectedCustomer} />}
          />
          <Route
            path="/customers"
            element={<CustomerList onCustomerSelect={handleCustomerSelect} />}
          />
          <Route
            path="/customer/:id"
            element={
              selectedCustomer && (
                <CustomerDetails customer={selectedCustomer} />
              )
            }
          />
          <Route path="/add-product" element={<AddProduct />} />
          <Route
            path="/edit-product/:id"
            element={<EditProduct product={selectedProduct} />}
          />
          <Route
            path="/products"
            element={<ProductList onProductSelect={handleProductSelect} />}
          />
          <Route path="/orders" element={<OrderList onOrderSelect={handleOrderSelect}/>}/>
          <Route path="/order/:id" element={
            selectedOrder && (
              <OrderDetails order={selectedOrder}/>
            )
          }
          />
          <Route path="/add-order" element={<AddOrder/>} />
          <Route/>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
