import React, { useContext, useState } from "react";
import LayOut from "../../components/LayOut/LayOut";
import classes from "./Payment.module.css";
import { DataContext } from "../../components/DataProvider/DataProvider";
import ProductCard from "../../components/Product/ProductCard";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import CurrencyFormat from "../../components/CurrencyFormat/CurrencyFormat";
import { axiosInstance } from "../../Api/axios";
import { ClipLoader } from "react-spinners";
import { db } from "../../Utility/firebase";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Type } from "../../Utility/action.type";

function Payment() {
  const { state, dispatch } = useContext(DataContext);
  const { user, basket } = state;

  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const totalItem = basket?.reduce((amount, item) => amount + item.amount, 0);
  const totalPrice = basket?.reduce((amount, item) => amount + item.price * item.amount, 0);

  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setError(e?.error?.message || "");
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!user?.uid) {
      setError("User not logged in.");
      return;
    }

    if (!stripe || !elements) {
      setError("Stripe has not loaded yet.");
      return;
    }

    if (basket.length === 0) {
      setError("Your basket is empty.");
      return;
    }

    try {
      setProcessing(true);
      setError(null);

      // Create PaymentIntent on backend
      const response = await axiosInstance.post("/payment/create", { total: totalPrice * 100 });
      const clientSecret = response.data?.clientSecret;

      if (!clientSecret) {
        setError("Failed to get client secret from Stripe.");
        setProcessing(false);
        return;
      }

      // Confirm payment
      const { paymentIntent, error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      if (stripeError) {
        setError(stripeError.message);
        setProcessing(false);
        return;
      }

      // Save order to Firestore under user orders
      await setDoc(
        doc(collection(db, "users", user.uid, "orders"), paymentIntent.id),
        {
          basket,
          amount: paymentIntent.amount,
          created: serverTimestamp(),
        }
      );

      // Empty basket
      dispatch({ type: Type.EMPTY_BASKET });

      setProcessing(false);
      navigate("/orders", { state: { msg: "You have placed a new order" } });
    } catch (err) {
      setError(err.message);
      setProcessing(false);
    }
  };

  return (
    <LayOut>
      <div className={classes.payment__header}>Checkout ({totalItem}) items</div>

      <section className={classes.payment}>
        {/* Address */}
        <div className={classes.flex}>
          <h3>Delivery Address</h3>
          <div>
            <div>{user?.email || "No user logged in"}</div>
            <div>123 React Lane</div>
            <div>Chicago, IL</div>
          </div>
        </div>
        <hr />

        {/* Product Review */}
        <div className={classes.flex}>
          <h3>Review items and delivery</h3>
          <div>
            {basket?.map((item) => (
              <ProductCard key={item.id} product={item} flex={true} renderAdd={true} />
            ))}
          </div>
        </div>
        <hr />

        {/* Card Form */}
        <div className={classes.flex}>
          <h3>Payment Method</h3>
          <div className={classes.payment__card__container}>
            <div className={classes.payment__details}>
              <form onSubmit={handlePayment}>
                {error && <small style={{ color: "red" }}>{error}</small>}
                <CardElement onChange={handleChange} />
                <div className={classes.payment__price}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
                    <p>Total Order</p>
                    <CurrencyFormat amount={totalPrice} />
                  </div>
                  <button type="submit" disabled={processing || !stripe}>
                    {processing ? (
                      <div className={classes.loading}>
                        <ClipLoader color="gray" size={15} />
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
    </LayOut>
  );
}

export default Payment;
