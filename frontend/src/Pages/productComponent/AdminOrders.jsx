import { useEffect, useState } from "react";
import axios from "axios";
import classes from "./AdminOrders.module.css";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  // Fetch all orders from backend
  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/orders/all");
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className={classes.admin_orders_container}>
      <h2>All Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className={classes.order_card}>
            <p><b>Order ID:</b> {order.id}</p>
            <p><b>User:</b> {order.userName}</p>
            <p><b>Address:</b> {order.address}</p>
            <p><b>Total:</b> ₹{order.total}</p>
            <div className={classes.products}>
              {order.products.map((product, index) => (
                <div key={index} className={classes.product}>
                  <img src={`http://localhost:8080/api/product/${product.imageName}`} alt={product.title} />
                  <p>{product.title} - Qty: {product.quantity}</p>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminOrders;
