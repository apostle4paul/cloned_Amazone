import { useContext, useState } from "react";
import { FaSearch, FaShoppingCart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import classes from "./Header.module.css";
import { DataContext } from "../DataProvider/DataProvider";
import { Type } from "../../Utility/action.type";
import { auth } from "../../Utility/firebase";
import { signOut } from "firebase/auth";

function Header() {
  const { state, dispatch } = useContext(DataContext);
  const { basket, user } = state;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      dispatch({ type: Type.SET_USER, user: null });
      sessionStorage.removeItem("active-user"); // clear session
      navigate("/");
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={classes.header_container}>
      {/* Logo */}
      <div className={classes.logo_container}>
        <Link to="/">
          <img
            src="https://i.pinimg.com/564x/be/cd/c3/becdc36784ad3731e1c1789f78b9a1a6.jpg"
            alt="logo"
          />
        </Link>
      </div>

      {/* Search Bar */}
      <div className={classes.search}>
        <select>
          <option value="">All</option>
        </select>
        <input type="text" placeholder="Search product" />
        <FaSearch size={37} />
      </div>

      {/* Right Side Links */}
      <div className={classes.order_container}>
        <div className={classes.language}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Flag_of_the_United_States_%28Web_Colors%29.svg/250px-Flag_of_the_United_States_%28Web_Colors%29.svg.png"
            alt="USA flag"
          />
          <select>
            <option value="">EN</option>
          </select>
        </div>

        {/* User / Admin Links */}
        {user ? (
          <div
            style={{ cursor: loading ? "wait" : "pointer" }}
            onClick={handleSignOut}
          >
            <p>{loading ? "Signing out..." : "Hello, " + (user.displayName || user.emailId || "User")}</p>
            <span>Sign Out</span>
          </div>
        ) : (
          <>
            {/* Normal User Sign In */}
            <Link to="/auth">
              <div>
                <p>Hello, Guest</p>
                <span>Sign In</span>
              </div>
            </Link>

            {/* Admin Sign In */}
            <Link to="/admin/auth">
              <div>
                <p>Admin</p>
                <span>Sign In</span>
              </div>
            </Link>
          </>
        )}

        {/* Orders Link */}
        <Link to="/orders">
          <div>
            <p>Returns</p>
            <span>& Orders</span>
          </div>
        </Link>

        {/* Cart */}
        <Link to="/cart" className={classes.cart}>
          <FaShoppingCart size={25} />
          <span>{basket?.length || 0}</span>
        </Link>
      </div>
    </section>
  );
}

export default Header;
