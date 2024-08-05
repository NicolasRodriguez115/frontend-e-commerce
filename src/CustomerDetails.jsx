import { Link } from "react-router-dom";
import NavigationBar from "./NavigationBar";

function CustomerDetails({customer}){

    return(
        <div>
            <NavigationBar/>
            <div className="customer-details-container">
                <h1>{customer.name}</h1>
                <ul>
                    <li>Unique ID: {customer.customer_id}</li>
                    <li>Email: {customer.email}</li>
                    <li>Phone: {customer.phone}</li>
                </ul>
                <Link to={`/edit-customer/${customer.customer_id}`}>
                    <button>Update</button>
                
                </Link>
            </div>
        </div>
    )
}

export default CustomerDetails;