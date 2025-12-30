import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./AdminAuth.module.css";
import { ClipLoader } from "react-spinners";

const AdminAuth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAdminAuth = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      // Sign Up flow: allow everyone
      if (isSignUp) {
        sessionStorage.setItem("active-admin", JSON.stringify({ email }));
        navigate("/admin/dashboard");
      } else {
        // Sign In flow
        const storedAdmin = JSON.parse(sessionStorage.getItem("active-admin"));
        if (storedAdmin?.email === email && password) {
          navigate("/admin/dashboard");
        } else if (email && password) {
          // New sign-in: store in session
          sessionStorage.setItem("active-admin", JSON.stringify({ email }));
          navigate("/admin/dashboard");
        } else {
          setError("Invalid admin credentials!");
        }
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <section className={styles.login}>
      <Link to="/">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/905px-Amazon_logo.svg.png"
          alt="Logo"
        />
      </Link>

      <div className={styles.login__container}>
        <h1>{isSignUp ? "Admin Sign Up" : "Admin Sign In"}</h1>

        {error && <small className={styles.error}>{error}</small>}

        <form>
          <div>
            <label htmlFor="email">Admin Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            onClick={handleAdminAuth}
            className={styles.login__signInButton}
          >
            {loading ? <ClipLoader color="#fff" size={20} /> : isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <p style={{ marginTop: "15px", fontSize: "13px" }}>
          {isSignUp ? "Already an admin?" : "New admin?"}{" "}
          <span
            className={styles.toggle}
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError("");
            }}
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </span>
        </p>

        <p style={{ marginTop: "10px", fontSize: "13px" }}>
          By signing in/up, you agree to the Admin Portal rules.
        </p>
      </div>
    </section>
  );
};

export default AdminAuth;
