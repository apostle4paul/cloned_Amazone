import { useEffect, useState } from "react";
import axios from "axios";
import classes from "./DeliveryDashboard.module.css";

const DeliveryDashboard = () => {
  const [assignedOrders, setAssignedOrders] = useState([]);

  // For simplicity, assume delivery guy ID is stored in session
  const deliveryGuyId = sessionStorage.getItem("delivery-id");

  const fetchAssignedOrders = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/orders/assigned/${deliveryGuyId}`
      );
      setAssignedOrders(response.data);
    } catch (error) {
      console.error("Error fetching assigned orders:", error);
    }
  };

  const markDelivered = async (orderId) => {
    try {
      await axios.post(
        `http://localhost:8080/api/orders/delivered/${orderId}`
      );
      alert("Order marked as delivered!");
      fetchAssignedOrders();
    } catch (error) {
      console.error("Error marking order as delivered:", error);
    }
  };

  useEffect(() => {
    fetchAssignedOrders();
  }, []);

  return (
    <div className={classes.delivery_container}>
      <h2>Assigned Orders</h2>
      {assignedOrders.length === 0 ? (
        <p>No orders assigned yet.</p>
      ) : (
        assignedOrders.map((order) => (
          <div key={order.id} className={classes.order_card}>
            <p><b>Order ID:</b> {order.id}</p>
            <p><b>User:</b> {order.userName}</p>
            <p><b>Address:</b> {order.address}</p>
            <p><b>Total:</b> ₹{order.total}</p>
            <div className={classes.products}>
              {order.products.map((p, idx) => (
                <div key={idx} className={classes.product}>
                  <img src={`http://localhost:8080/api/product/${p.imageName}`} alt={p.title} />
                  <p>{p.title} - Qty: {p.quantity}</p>
                </div>
              ))}
            </div>
            <button onClick={() => markDelivered(order.id)} className={classes.deliver_btn}>
              Mark as Delivered
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default DeliveryDashboard;
