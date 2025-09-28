import { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth } from "../../Utility/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { DataContext } from "../../components/DataProvider/DataProvider";
import { Type } from "../../Utility/action.type";
import classes from "./Auth.module.css";
import { ClipLoader } from "react-spinners";

function Auth() {
  const navigate = useNavigate();
  const navStateData = useLocation();
  const { dispatch } = useContext(DataContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Sign In
  const signIn = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
      };

      dispatch({ type: Type.SET_USER, user });
      navigate(navStateData?.state?.redirect || "/", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Sign Up
  const register = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
      };

      dispatch({ type: Type.SET_USER, user });
      navigate(navStateData?.state?.redirect || "/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Sign Out
  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      dispatch({ type: Type.SET_USER, user: null });
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={classes.auth}>
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <ClipLoader size={80} color="#f0c14b" />
        </div>
      )}

      <Link to="/">
        <img
          className={classes.logo}
          src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
          alt="Amazon"
        />
      </Link>

      <div className={classes.container}>
        {auth.currentUser ? (
          <>
            <h1>Welcome back</h1>
            <p style={{ marginBottom: "15px" }}>
              You are signed in as <strong>{auth.currentUser.email}</strong>
            </p>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <button
              type="button"
              onClick={handleSignOut}
              className={classes.signInButton}
              disabled={loading}
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <h1>Sign-in</h1>

            {/* ✅ Fixed optional chaining + fontWeight */}
            {navStateData?.state?.msg && (
              <small
                style={{
                  color: "red",
                  textAlign: "center",
                  fontWeight: "bold",
                  padding: "5px",
                }}
              >
                {navStateData?.state?.msg}
              </small>
            )}

            <form>
              <h5>Email</h5>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <h5>Password</h5>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {error && (
                <p style={{ color: "red", marginTop: "10px" }}>{error}</p>
              )}

              <button
                type="submit"
                className={classes.signInButton}
                onClick={signIn}
                disabled={loading}
              >
                Sign In
              </button>
            </form>

            <p style={{ fontSize: "12px", marginTop: "10px" }}>
              By signing-in you agree to Amazon's Conditions of Use & Sale.
              Please see our Privacy Notice, Cookies Notice, and
              Interest-Based Ads Notice.
            </p>

            <button
              type="button"
              onClick={register}
              className={classes.registerButton}
              disabled={loading}
            >
              Create your Amazon Account
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Auth;
