// Payment.jsx
import React, { useContext, useState } from "react";
import Layout from "../../components/Layout/Layout";
import styles from "./Payment.module.css";
import { DataContext } from "../../components/DataProvider/DataProvider";
import ProductCard from "../../components/Product/ProductCard";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import CurrencyFormatter from "../../components/CurrencyFormat/CurrencyFormat";
import { axiosInstance } from "../../Api/axios"; // Make sure this points to local emulator
import { ClipLoader } from "react-spinners";
import { db } from "../../Utility/firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Type } from "../../Utility/action.type";

function Payment() {
  const { state, dispatch } = useContext(DataContext);
  const { basket, user } = state;

  const totalItem = basket?.reduce((amount, item) => item.amount + amount, 0);
  const totalPrice = basket?.reduce(
    (amount, item) => item.price * item.amount + amount,
    0
  );

  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    e?.error?.message ? setCardError(e.error.message) : setCardError("");
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("You must be logged in to place an order.");
      return;
    }

    setProcessing(true);

    try {
      // 1️⃣ Get client secret from backend (local functions emulator)
      const response = await axiosInstance.post(
        `/payment/create?total=${Math.round(totalPrice * 100)}`
      );

      const clientSecret = response.data?.clientSecret;
      if (!clientSecret) throw new Error("No client secret returned from backend");

      // 2️⃣ Confirm payment on client side
      const confirmation = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (confirmation.error) {
        setCardError(confirmation.error.message);
        setProcessing(false);
        return;
      }

      const { paymentIntent } = confirmation;

      // 3️⃣ Save order in Firestore (emulator if localhost)
      try {
        const orderRef = doc(
          collection(db, "users", user.uid, "orders"),
          paymentIntent.id
        );
        await setDoc(orderRef, {
          basket,
          amount: paymentIntent.amount,
          created: paymentIntent.created,
          status: paymentIntent.status,
        });
        console.log("Order saved in Firestore:", orderRef.path);
      } catch (fireErr) {
        console.error("Failed to save order in Firestore:", fireErr);
      }

      // 4️⃣ Empty basket
      dispatch({ type: Type.EMPTY_BASKET });
      setProcessing(false);

      // 5️⃣ Navigate to orders page
      navigate("/orders", { state: { msg: "You have placed a new order" } });
    } catch (err) {
      console.error("Payment processing failed:", err);
      setProcessing(false);
      setCardError(err.message || "Payment failed. Try again.");
    }
  };

  return (
    <Layout>
      <div className={styles.payment__header}>
        Checkout ({totalItem} items)
      </div>

      <section className={styles.payment}>
        {/* Delivery Address */}
        <div className={styles.flex}>
          <h3>Delivery Address</h3>
          <div>
            <div>{user?.email}</div>
            <div>React Lane</div>
            <div>Chicago, IL</div>
          </div>
        </div>
        <hr />

        {/* Review Items */}
        <div className={styles.flex}>
          <h3>Review items and delivery</h3>
          <div>
            {basket?.map((item, index) => (
              <ProductCard product={item} key={index} flex={true} />
            ))}
          </div>
        </div>
        <hr />

        {/* Payment Method */}
        <div className={styles.flex}>
          <h3>Payment methods</h3>
          <div className={styles.payment__card__container}>
            <div className={styles.payment__details}>
              <form onSubmit={handlePayment}>
                {cardError && <small style={{ color: "red" }}>{cardError}</small>}
                <CardElement onChange={handleChange} />

                <div className={styles.payment__price}>
                  <div>
                    <span style={{ display: "flex", gap: "10px" }}>
                      <p>Total Order</p> | <CurrencyFormatter amount={totalPrice} />
                    </span>
                  </div>
                  <button type="submit" disabled={processing}>
                    {processing ? (
                      <div className={styles.loading}>
                        <ClipLoader size={15} />
                        <p>Please wait ...</p>
                      </div>
                    ) : (
                      "Pay Now"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default Payment;
