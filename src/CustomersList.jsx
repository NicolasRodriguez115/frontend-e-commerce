import React, {Component, useEffect, useState} from "react";
import { Link } from "react-router-dom";
import NavigationBar from "./NavigationBar";
import axios from "axios";
// import { OrderList } from "./OrderList";


function CustomersLists({ onCustomerSelect }){
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCustomers = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:5001/customers")
            const data = response.data
            setCustomers(data)
            setLoading(false);
            console.log("success")
        } catch (error) {
            setError("Error fetching customer list")
            setLoading(false)
            console.log(error)
        }
    }

    useEffect(() => {
        fetchCustomers()
    }, []);

    if (loading) {
        return <div className="loading">Loading...</div>;
      }
    
      if (error) {
        return <div>{error}</div>;
      }

    return (
        <>
            <NavigationBar/>
            <div className="customer-details-container">
                <h1>Customers</h1>
            <ul>
                {customers.map(customer => (
                    <li key={customer.customer_id}>
                        {customer.name}
                        <Link to={`/customer/${customer.customer_id}`}
                              onClick={() => onCustomerSelect(customer)}  
                        >
                            <button type="button">Details</button>
                        </Link>
                    </li>
                    
                ))}
            </ul>

            </div>
        </>
    )
}

export default CustomersLists; 