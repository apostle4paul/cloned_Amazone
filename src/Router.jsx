import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./Pages/Landing/Landing";
import ProductDetail from "./Pages/ProductDetail/ProductDetail";
import Cart from "./Pages/Cart/Cart";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Auth from "./Pages/Auth/Auth";
import Payment from "./Pages/Payment/Payment";
import Orders from "./Pages/Orders/Orders";
import Results from "./Pages/Results/Results";

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(
  "pk_test_51SAbBEFq9SOG7vnyXBb48JWIo2xFf9qKIi9s2lO2VFmn41dP07COfURKDB989wdYUGnMgtR31qbjnvtuaK0uSyGy00vhipqovr"
);

function Router() {
   return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/payments"
            element={
              <ProtectedRoute
                msg={"You must login to pay"}
                redirect={"/payments"}
              >
                <Elements stripe={stripePromise}>
                  <Payment />
                </Elements>
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute
                msg={"You must need to Sign in to access your orders"}
                redirect={"/orders"}
              >
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route path="/category/:categoryName" element={<Results />} />
          <Route path="/product/:productId" element={<ProductDetail />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
export default Router;