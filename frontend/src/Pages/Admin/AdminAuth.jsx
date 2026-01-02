import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";
import styles from "./AdminAuth.module.css";

const AdminAuth = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    password: "",
    phoneNo: "",
    city: "",
    street: "",
    pincode: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = isSignUp
        ? { ...formData, pincode: parseInt(formData.pincode), role: "ADMIN" }
        : { emailId: formData.emailId, password: formData.password, role: "ADMIN" };

      const res = await fetch(
        isSignUp
          ? "http://localhost:8081/api/user/register"
          : "http://localhost:8081/api/user/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Request failed: ${res.status} - ${text}`);
      }

      const data = await res.json();
      sessionStorage.setItem("active-admin", JSON.stringify(data));
      toast.success(isSignUp ? "Admin signed up!" : "Admin logged in!", {
        position: "top-center",
      });
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error(err.message || "Error occurred!", { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.login}>
      <div className={styles.login__container}>
        <h1>{isSignUp ? "Admin Sign Up" : "Admin Sign In"}</h1>

        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <>
              <input name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleInputChange} required />
              <input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleInputChange} required />
              <input name="phoneNo" placeholder="Phone Number" value={formData.phoneNo} onChange={handleInputChange} required />
              <input name="city" placeholder="City" value={formData.city} onChange={handleInputChange} required />
              <input name="street" placeholder="Street" value={formData.street} onChange={handleInputChange} required />
              <input name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleInputChange} required />
            </>
          )}

          <input type="email" name="emailId" placeholder="Email" value={formData.emailId} onChange={handleInputChange} required />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} required />

          <button className={styles.login__signInButton} type="submit">
            {loading ? <ClipLoader size={18} color="#111" /> : isSignUp ? "Create Admin Account" : "Sign In"}
          </button>
        </form>

        <p>
          {isSignUp ? "Already have an admin account?" : "New admin?"}{" "}
          <span className={styles.toggle} onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? "Sign In" : "Create one"}
          </span>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AdminAuth;
