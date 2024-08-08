import React, { useState } from "react";
import { Form, Container, Alert } from "react-bootstrap";
import axios from "axios";
import NavigationBar from "../NavigationBar";
import "./Orders.css"
const AddOrder = () => {
  const [orderData, setOrderData] = useState({
    customer_id: "",
    date: "",
    products: [""],
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    if (name === "product_id") {
      const products = [...orderData.products];
      products[index] = value;
      setOrderData({ ...orderData, products });
    } else {
      setOrderData({ ...orderData, [name]: value });
    }
  };

  const handleAddProduct = e => {
    e.preventDefault();
    setOrderData({ ...orderData, products: [...orderData.products, ""] });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formattedDate = new Date(orderData.date).toISOString().split("T")[0];
    const updatedOrderData = {
      ...orderData,
      customer_id: parseInt(orderData.customer_id, 10),
      date: formattedDate,
      products: orderData.products.map(product => parseInt(product, 10)),
    };

    console.log("Submitting order data:", updatedOrderData); // Log the payload
    try {
      const response = await axios.post(
        "http://127.0.0.1:5001/orders",
        updatedOrderData
      );
      setIsLoading(false);
      alert("Order created successfully!");
    } catch (error) {
      setIsLoading(false);
      setError(error.message);
    }
  };

  return (
    <>
      <NavigationBar />
      <Container>
        {isLoading && <Alert variant="info">Creating new order</Alert>}

        {error && (
          <Alert variant="danger">Error creating new order: {error}</Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formGroupName">
            <Form.Label>Customer ID</Form.Label>
            <Form.Control
              type="number"
              name="customer_id"
              value={orderData.customer_id}
              onChange={handleChange}
            ></Form.Control>

            {errors.name && <div style={{ color: "red" }}>{errors.name}</div>}
          </Form.Group>

          <Form.Group controlId="formGroupPrice">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              name="date"
              value={orderData.date}
              onChange={handleChange}
            ></Form.Control>

            {errors.price && <div style={{ color: "red" }}>{errors.price}</div>}
          </Form.Group>

          {orderData.products.map((product, index) => (
            <Form.Group controlId={`formGroupProduct${index}`} key={index}>
              <Form.Label>Product ID</Form.Label>
              <Form.Control
                type="number"
                name="product_id"
                value={product}
                onChange={e => handleChange(e, index)}
              ></Form.Control>
              <button className="new-product-button" onClick={handleAddProduct}>Add Another Product</button>
            </Form.Group>
          ))}
          <div className="form-button">
          <button className="order-button" type="submit">Submit</button>
          </div>
        </Form>
      </Container>
    </>
  );
};

export default AddOrder;
