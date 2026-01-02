import { useContext, useState } from "react";
import { DataContext } from "../../components/DataProvider/DataProvider";
import { useNavigate, Link, useLocation } from "react-router-dom";
import styles from "./auth.module.css";
import { ClipLoader } from "react-spinners";
import axios from "axios";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../Utility/firebase";
import { Type } from "../../Utility/action.type";

function Auth() {
  const { dispatch } = useContext(DataContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState({ signIn: false, signUp: false });
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  // ---------------- LOGIN ----------------
  const signInHandler = async (e) => {
    e.preventDefault();
    setLoading({ signIn: true });
    setError("");

    try {
      // 1️⃣ Firebase login
      const firebaseUser = await signInWithEmailAndPassword(auth, email, password);

      // 2️⃣ Load user from DB
      const res = await axios.post("http://localhost:8081/api/user/login", {
        emailId: email,
        password: password,
        role: "USER",
      });

      const userData = res.data;

      // Ensure displayName exists
      if (!userData.displayName) {
        userData.displayName = userData.firstName || userData.emailId;
      }

      // 3️⃣ Save DB user
      sessionStorage.setItem("active-user", JSON.stringify(userData));
      dispatch({ type: Type.SET_USER, user: userData });

      navigate(location?.state?.redirect || "/");
    } catch (err) {
      setError("Invalid credentials");
    } finally {
      setLoading({ signIn: false });
    }
  };

  // ---------------- SIGN UP ----------------
  const signUpHandler = async () => {
    setLoading({ signUp: true });
    setError("");

    try {
      // 1️⃣ Firebase signup
      const firebaseUser = await createUserWithEmailAndPassword(auth, email, password);

      // 2️⃣ Save user in DB
      const res = await axios.post("http://localhost:8081/api/user/register", {
        firstName: "User",
        lastName: "Account",
        emailId: email,
        password: password,
        phoneNo: "0000000000",
        city: "Addis",
        street: "Unknown",
        pincode: 0,
        role: "USER",
      });

      const userData = res.data;

      // Ensure displayName exists
      if (!userData.displayName) {
        userData.displayName = userData.firstName || userData.emailId;
      }

      // 3️⃣ Store DB user
      sessionStorage.setItem("active-user", JSON.stringify(userData));
      dispatch({ type: Type.SET_USER, user: userData });

      navigate("/");
    } catch (err) {
      setError("Signup failed");
    } finally {
      setLoading({ signUp: false });
    }
  };

  return (
    <section className={styles.login}>
      <Link to="/">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/905px-Amazon_logo.svg.png"
          alt="Amazon"
        />
      </Link>

      <div className={styles.login__container}>
        <h1>Sign In</h1>

        {error && <small className={styles.error}>{error}</small>}

        <form>
          <div>
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div>
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <button onClick={signInHandler} className={styles.login__signInButton}>
            {loading.signIn ? <ClipLoader size={18} color="#fff" /> : "Sign In"}
          </button>
        </form>

        <button onClick={signUpHandler} className={styles.login__registerButton}>
          {loading.signUp ? <ClipLoader size={18} /> : "Create your Amazon Account"}
        </button>

        <p>
          By signing-in you agree to AMAZON FAKE CLONE Conditions.
        </p>
      </div>
    </section>
  );
}

export default Auth;
