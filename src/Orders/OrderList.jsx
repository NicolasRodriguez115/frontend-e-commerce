import { useEffect, useState } from "react"
import NavigationBar from "../NavigationBar"
import axios from "axios";
import { Link } from "react-router-dom";
import "./Orders.css"
const OrderList = ({onOrderSelect}) => {
    const [orders, setOrders] = useState([]);
    
    const fetchOrders = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:5001/orders")
            setOrders(response.data);
        } catch (error) {
            console.log("Error fetching orders:", error);
        }
    }

    useEffect(() => {
        fetchOrders()
    }, []);

    return (
        <>
            <NavigationBar/>
        <div className="order-list-container">
            <h1 className="orders">Orders</h1>
            <ul className="order-list">
                {orders.map(order => (
                    <li className="order" key={order.order_id}>
                        Order ID: {order.order_id}
                        
                        <Link
                            to={`/order/${order.order_id}`}
                            onClick={() => onOrderSelect(order)}
                        >
                            <button className="order-button" type="button">
                                Details
                            </button>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
        </>
    )
}

export default OrderList