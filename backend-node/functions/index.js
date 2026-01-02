const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");
require("dotenv").config(); // Load .env

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(cors({ origin: "http://localhost:5173" })); // allow frontend
app.use(express.json());

// Payment route
app.post("/payment/create", async (req, res) => {
  try {
    const { total } = req.body;

    // Create a Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total, // in cents
      currency: "usd",
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

exports.api = functions.https.onRequest(app);
