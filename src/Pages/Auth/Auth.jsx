import React, { useContext, useState } from "react";
import { DataContext } from "../../components/DataProvider/DataProvider";
import { useNavigate, Link, useLocation } from "react-router-dom";
import styles from "./Auth.module.css";
import { ClipLoader } from "react-spinners";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../Utility/firebase";
import { Type } from "../../Utility/action.type";

function Auth() {
  const { state, dispatch } = useContext(DataContext);
  const { user } = state;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState({ signIn: false, signUp: false });

  const navigate = useNavigate();
  const location = useLocation();

  const authHandler = async (e) => {
    e.preventDefault();
    const actionType = e.target.name;

    setError(""); // reset error

    try {
      if (actionType === "signin") {
        setLoading({ ...loading, signIn: true });
        const userInfo = await signInWithEmailAndPassword(auth, email, password);
        dispatch({ type: Type.SET_USER, user: userInfo.user });
        setLoading({ ...loading, signIn: false });
        navigate(location?.state?.redirect || "/");
      } else if (actionType === "signup") {
        setLoading({ ...loading, signUp: true });
        const userInfo = await createUserWithEmailAndPassword(auth, email, password);
        dispatch({ type: Type.SET_USER, user: userInfo.user });
        setLoading({ ...loading, signUp: false });
        navigate(location?.state?.redirect || "/");
      }
    } catch (err) {
      setError(err.message);
      setLoading({ signIn: false, signUp: false });
    }
  };

  return (
    <section className={styles.login}>
      {/* Logo */}
      <Link to="/">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/905px-Amazon_logo.svg.png"
          alt="Amazon Logo"
        />
      </Link>

      {/* Form Container */}
      <div className={styles.login__container}>
        <h1>Sign In</h1>

        {location?.state?.msg && (
          <small style={{ padding: "5px", textAlign: "center", color: "red", fontWeight: "bold" }}>
            {location.state.msg}
          </small>
        )}

        <form>
          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            name="signin"
            onClick={authHandler}
            className={styles.login__signInButton}
          >
            {loading.signIn ? <ClipLoader color="#fff" size={20} /> : "Sign In"}
          </button>
        </form>

        {/* Create Account Button */}
        <button
          type="button"
          name="signup"
          onClick={authHandler}
          className={styles.login__registerButton}
        >
          {loading.signUp ? <ClipLoader color="#fff" size={20} /> : "Create your Amazon Account"}
        </button>

        {/* Error Message */}
        {error && <small style={{ paddingTop: "5px", color: "red" }}>{error}</small>}

        {/* Agreement */}
        <p>
          By signing-in you agree to the AMAZON FAKE CLONE Conditions of Use & Sale. Please see our
          Privacy Notice, our Cookies Notice and our Interest-Based Ads Notice.
        </p>
      </div>
    </section>
  );
}

export default Auth;
