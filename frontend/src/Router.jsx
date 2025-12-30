import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./Pages/Landing/Landing";
import ProductDetail from "./Pages/ProductDetail/ProductDetail";
import Cart from "./Pages/Cart/Cart";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Auth from "./Pages/Auth/Auth";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import Payment from "./Pages/Payment/Payment";
import Orders from "./Pages/Orders/Orders";
import Results from "./Pages/Results/Results";

// Admin pages
import AdminAuth from "./Pages/Admin/AdminAuth"; 

// Initialize Stripe
const stripePromise = loadStripe(
  "pk_test_51SAbBEFq9SOG7vnyXBb48JWIo2xFf9qKIi9s2lO2VFmn41dP07COfURKDB989wdYUGnMgtR31qbjnvtuaK0uSyGy00vhipqovr"
);

// Helper to check admin login
const isAdminLoggedIn = !!sessionStorage.getItem("active-admin");

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/category/:categoryName" element={<Results />} />
        <Route path="/product/:productId" element={<ProductDetail />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* Payment & Orders - protected for users */}
        <Route
          path="/payments"
          element={
            <ProtectedRoute msg="You must login to pay" redirect="/auth">
              <Elements stripe={stripePromise}>
                <Payment />
              </Elements>
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute msg="You must sign in to access your orders" redirect="/auth">
              <Orders />
            </ProtectedRoute>
          }
        />

        {/* Admin Route */}
        <Route path="/admin/auth" element={<AdminAuth />} />
        <Route
          path="/admin/dashboard"
          element={isAdminLoggedIn ? (
            <div> {/* Placeholder for your admin dashboard */} 
              <h1>Welcome Admin!</h1>
            </div>
          ) : (
            <Navigate to="/admin/auth" />
          )}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
