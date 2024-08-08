import { Link } from "react-router-dom";
import NavigationBar from "../NavigationBar";
import axios from "axios";
import "./Customers.css";

function CustomerDetails({ customer }) {
  const deleteCustomer = async customerID => {
    try {
      await axios.delete(`http://127.0.0.1:5001/customers/${customerID}`);
      alert("Customer deleted successfully!");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="main-container">
      <NavigationBar />
      <div className="customer-details-container">
        <h1>{customer.name}</h1>
        <ul>
          <li>Unique ID: {customer.customer_id}</li>
          <li>Email: {customer.email}</li>
          <li>Phone: {customer.phone}</li>
        </ul>
        <div className="buttons-container">
        <Link to={`/edit-customer/${customer.customer_id}`}>
          <button className="customer-button">Update</button>
        </Link>
        <Link to={`/customers`}>
          <button className="customer-button" onClick={() => deleteCustomer(customer.customer_id)}>
            Delete
          </button>
        </Link>

        </div>
      </div>
    </div>
  );
}

export default CustomerDetails;
