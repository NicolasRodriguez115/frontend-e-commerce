import axios from "axios"
import NavigationBar from "../NavigationBar"
import { Link } from "react-router-dom"
import "./Orders.css"
const OrderDetails = ({order}) => {

    const deleteOrder = async orderID => {
        try {
            await axios.delete(`http://127.0.0.1:5001/orders/${orderID}`)
            alert("Order delete succesfully!")
        } catch (error) {
            console.log(error);
        }
    }

    const statusMessage = (status) => {
        if (status == 1) {
            return "Active"
        }
        else {
            return "Closed"
        }
    }
    return (
        <>
            <NavigationBar/>
            <div className="order-list-container">
                <h1>Order ID: {order.order_id}</h1>
                <ul className="order-list">
                    <li>Customer ID: {order.customer_id}</li>
                    <li>Date: {order.date}</li>                    
                    <li>
                    <h5>Products:</h5>
                        <ul>
                        {
                                order.products.length > 0 ? (
                                    order.products.map(product => (
                                        <li key={product.product_id}>
                                            {product.name}: ${product.price}
                                        </li>
                                    ))
                                ) : (
                                    <li>No products in this order.</li>
                                )
                            }
                        </ul>
                    </li>
                    <li>Status: {statusMessage(order.status)} </li>
                <Link to={`/orders`}>
                    <button className="order-button" onClick={() => deleteOrder(order.order_id)}>Delete</button>       
                </Link>
                </ul>    
            </div>
        </>
    )
}

export default OrderDetails