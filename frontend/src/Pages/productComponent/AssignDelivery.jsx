import { useEffect, useState } from "react";
import axios from "axios";
import classes from "./AssignDelivery.module.css";

const AssignDelivery = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/orders/pending");
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const assignDelivery = async (orderId) => {
    try {
      await axios.post(`http://localhost:8080/api/orders/assign/${orderId}`);
      alert("Delivery assigned!");
      fetchOrders();
    } catch (error) {
      console.error("Error assigning delivery:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className={classes.assign_delivery_container}>
      <h2>Assign Delivery</h2>
      {orders.length === 0 ? (
        <p>No pending orders.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className={classes.order_card}>
            <p><b>Order ID:</b> {order.id}</p>
            <p><b>User:</b> {order.userName}</p>
            <p><b>Address:</b> {order.address}</p>
            <p><b>Total:</b> ₹{order.total}</p>
            <button onClick={() => assignDelivery(order.id)} className={classes.assign_btn}>
              Assign Delivery
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default AssignDelivery;
