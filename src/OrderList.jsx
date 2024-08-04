import React, {useEffect, useState} from "react";

// GOAL": load the orders for the selectedCustomer 
function OrderList(props) {
  // We want to take in a parameter, customerID 
  const { customerID } = props; 

  // UseState to define the list of orders (default is set to an empty array)
  // const [variable, setVariable (function to update state value)] = useState(default value)
  const [orders, setOrders] = useState([])

  // Order object (id, date)

  // UseEffect(A function that runs when you load the page) - the first parameter is the function, the second is an array of dependencies 
  // no dependencies can trigger infinity re-render 
  // [] will prevent it from re-rendering 

  // Load the customer orders IF we have a customerID 
  // [customerID] Re-render the page if the customerID changes 
  useEffect(() => {
    if (customerID){
      // Load = fetch our orders 
      // fetch(`https://fakeapi.com/${customerID}`)
      const fetchedOrders = [
        { id: 101, date: '2024-01-31'},
        { id: 102, date: '2024-03-03'},
        { id: 103, date: '2024-01-31'},
        { id: 104, date: '2024-03-03'},
        { id: 105, date: '2024-07-31'},
        { id: 106, date: '2024-01-31'},
        { id: 107, date: '2024-03-03'},
        { id: 108, date: '2024-07-31'}
      ]
      setOrders(fetchedOrders)
    }

    console.log("Use effect ran")
  }, []); 
  
  const handleOrderClick = (id) => {
    props.onOrderSelect(id); 
  }

  return (
    <div className="order-list">
      <h2>Orders for customer: {customerID}</h2>
      <ul>
        {/* Map out the orders array where the key is the order.id */}
        {/* LI "Order ID: x Date: x" */}
        {/* If you want to call the prop function directly in the onClick
          onClick={() => props.onOrderSelect(order.id)} 
         */}
        { orders.map(order => (
          <li key={order.id} onClick={handleOrderClick(order.id)}>
            Order ID: {order.id} Date: {order.date}
          </li>
        )) }
      </ul>
    </div>
  )
}

export default OrderList;