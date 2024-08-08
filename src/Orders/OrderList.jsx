import { useEffect, useState } from "react"
import NavigationBar from "../NavigationBar"
import axios from "axios";
import { Link } from "react-router-dom";

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
        <div className="order-list">
            <NavigationBar/>
            <h1>Orders</h1>
            <ul>
                {orders.map(order => (
                    <li key={order.order_id}>
                        <p>
                            Order ID: {order.order_id}
                        </p>
                        <Link
                            to={`/order/${order.order_id}`}
                            onClick={() => onOrderSelect(order)}
                        >
                            <button type="button">
                                Details
                            </button>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default OrderList