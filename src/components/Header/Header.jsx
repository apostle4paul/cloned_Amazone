import { useContext, useState } from "react";
import { FaSearch, FaShoppingCart } from "react-icons/fa";
import { CiLocationOn } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import classes from "./Header.module.css";
import LowerHeader from "./LowerHeader";
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
      navigate("/");
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className={classes.header_container}>
        <div className={classes.logo_container}>
          <Link to="/">
            <img
              src="https://pngimg.com/uploads/amazon/amazon_PNG11.png"
              alt="amazon logo"
            />
          </Link>
          <div className={classes.delivery}>
            <span>
              <CiLocationOn />
            </span>
            <div>
              <p>Delivered to</p>
              <span>Ethiopia</span>
            </div>
          </div>
        </div>

        <div className={classes.search}>
          <select name="" id="">
            <option value="">All</option>
          </select>
          <input type="text" placeholder="search product" />
          <FaSearch size={37} />
        </div>

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

          {user ? (
            <div
              style={{ cursor: loading ? "wait" : "pointer" }}
              onClick={handleSignOut}
            >
              <p>{loading ? "Signing out..." : "Hello, " + (user.displayName || user.email)}</p>
              <span>Sign Out</span>
            </div>
          ) : (
            <Link to={!user &&"/auth"}>
              <div>
                <p>Hello, Guest</p>
                <span>Sign In</span>
              </div>
            </Link>
          )}

          <Link to="/orders">
            <div>
              <p>Returns</p>
              <span>& Orders</span>
            </div>
          </Link>

          <Link to="/cart" className={classes.cart}>
            <FaShoppingCart size={25} />
            <span>{basket.length}</span>
          </Link>
        </div>
      </section>
      <LowerHeader />
    </>
  );
}

export default Header;
