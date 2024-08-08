import React, { useState } from "react";
import { Form, Container, Alert } from "react-bootstrap";
import axios from "axios";
import NavigationBar from "../NavigationBar";
import "./Products.css";

const AddProduct = () => {
  const [productData, setProductData] = useState({ name: "", price: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = e => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://127.0.0.1:5001/products",
        productData
      );
      setIsLoading(false);
      alert("Product created successfully!");
    } catch (error) {
      setIsLoading(false);
      setError(error.message);
    }
  };

  return (
    <>
      <NavigationBar />
      <Container>
        {isLoading && <Alert variant="info">Creating new product</Alert>}

        {error && (
          <Alert variant="danger">Error creating new product: {error}</Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formGroupName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={productData.name}
              onChange={handleChange}
            ></Form.Control>

            {errors.name && <div style={{ color: "red" }}>{errors.name}</div>}
          </Form.Group>

          <Form.Group controlId="formGroupPrice">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="text"
              name="price"
              value={productData.price}
              onChange={handleChange}
            ></Form.Control>

            {errors.price && <div style={{ color: "red" }}>{errors.price}</div>}
          </Form.Group>
          <div className="form-button">
          <button className="product-button" type="submit">Submit</button>
          </div>
        </Form>
      </Container>
    </>
  );
};

export default AddProduct;
