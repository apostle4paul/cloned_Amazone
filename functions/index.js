const { setGlobalOptions } = require("firebase-functions/v2");
const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables first
dotenv.config();

// Initialize Stripe after dotenv
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Initialize Express app
const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Limit global options for Firebase Functions
setGlobalOptions({ maxInstances: 10 });

// Root route
app.get("/", (req, res) => {
  res.status(200).json({ message: "success!" });
});

// Unified Stripe payment route
app.post("/payment/create", async (req, res) => {
  try {
    // Accept total from body (preferred) or query (fallback)
    const total = parseInt(req.body.total) || req.query.total;

    if (!total || isNaN(total) || total <= 0) {
      return res.status(400).json({
        error: "Valid total amount is required (greater than 0)",
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: parseInt(total, 10), // always use integer cents
      currency: "usd",
    });

    // Log to console + Firebase logger
    console.log("💰 Payment created:", paymentIntent);
    logger.info("Payment created", paymentIntent);

    // Send full details back in response (for Thunder Client)
    res.status(201).json({
      message: "Payment intent created successfully",
      clientSecret: paymentIntent.client_secret,
      paymentIntent, // includes id, amount, status, etc.
    });
  } catch (error) {
    console.error("❌ Payment failed:", error);
    logger.error("Payment failed:", error);
    res.status(500).json({ error: error.message });
  }
});

// Export as Firebase Function
exports.api = onRequest(app);
