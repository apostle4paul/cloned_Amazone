import React, { useContext, useEffect, useState } from "react";
import LayOut from "../../components/LayOut/LayOut";
import { db } from "../../Utility/firebase";
import { DataContext } from "../../components/DataProvider/DataProvider";
import classes from "./Order.module.css";
import ProductCard from "../../components/Product/ProductCard";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { useLocation } from "react-router-dom";

function Orders() {
  const [{ user }] = useContext(DataContext);
  const [orders, setOrders] = useState([]);
  const location = useLocation();
  const successMsg = location.state?.msg;

  useEffect(() => {
    if (user) {
      const ordersRef = collection(db, "users", user.uid, "orders");
      const q = query(ordersRef, orderBy("created", "desc"));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        setOrders(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        );
      });

      return () => unsubscribe();
    } else {
      setOrders([]);
    }
  }, [user]);

  return (
    <LayOut>
      <section className={classes.container}>
        {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}
        <div className={classes.orders__container}>
          <h2>Your Orders</h2>
          {orders.length === 0 && <p>No orders yet</p>}
          <div>
            {orders.map((eachOrder, i) => (
              <div key={i}>
                <hr />
                <p>Order ID: {eachOrder.id}</p>
                {eachOrder.data.basket?.map((order) => (
                  <ProductCard flex={true} product={order} key={order.id} renderAdd={true} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </LayOut>
  );
}

export default Orders;
