import React, { useState } from "react";
import { Form, Container, Alert } from "react-bootstrap";
import axios from "axios";
import NavigationBar from "../NavigationBar";
import "./Customers.css";

const EditCustomer = ({ customer }) => {
  const [customerData, setCustomerData] = useState({
    name: customer.name || "",
    phone: customer.phone || "",
    email: customer.email || "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = e => {
    const { name, value } = e.target;
    setCustomerData({ ...customerData, [name]: value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.put(
        `http://127.0.0.1:5001/customers/${customer.customer_id}`,
        customerData
      );
      setIsLoading(false);
      alert("Customer data submitted successfully!");
    } catch (error) {
      setIsLoading(false);
      setError(error.message);
    }
  };

  return (
    <>
      <NavigationBar />
      <Container>
        {isLoading && <Alert variant="info">Submitting customer data</Alert>}

        {error && (
          <Alert variant="danger">
            Error submitting customer data: {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formGroupName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={customerData.name}
              onChange={handleChange}
            ></Form.Control>

            {errors.name && <div style={{ color: "red" }}>{errors.name}</div>}
          </Form.Group>

          <Form.Group controlId="formGroupPhone">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="text"
              name="phone"
              value={customerData.phone}
              onChange={handleChange}
            ></Form.Control>

            {errors.phone && <div style={{ color: "red" }}>{errors.phone}</div>}
          </Form.Group>

          <Form.Group controlId="formGroupEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="text"
              name="email"
              value={customerData.email}
              onChange={handleChange}
            ></Form.Control>
          </Form.Group>
          <div className="form-button">
          <button className="customer-button" type="submit">Submit</button>

          </div>
        </Form>
      </Container>
    </>
  );
};

export default EditCustomer;
