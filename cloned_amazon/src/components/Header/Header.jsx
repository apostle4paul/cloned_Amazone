import React from "react";
import { FaSearch } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { CiLocationOn } from "react-icons/ci";
import classes from "./Header.module.css";
import LowerHeader from "./LowerHeader";

const Header = () => {
  return (
    <>
    <section>
      <div className={classes.header_container}>
        {/* logo + delivery */}
        <div className={classes.logo_container}>
          <a href="/">
            <img
              src="https://pngimg.com/uploads/amazon/amazon_PNG11.png"
              alt="amazon logo"
            />
          </a>
          {/* delivery */}
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

        {/* search */}
        <div className={classes.search}>
          <select name="" id="">
            <option value="">All</option>
          </select>
          <input type="text" placeholder="search product" />
          <FaSearch size={25} />
        </div>

        {/* right side links */}
        <div className={classes.order_container}>
          {/* language selector */}
          <div className={classes.language}>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Flag_of_the_United_States_%28Web_Colors%29.svg/250px-Flag_of_the_United_States_%28Web_Colors%29.svg.png"
              alt="USA flag"
            />
            <select>
              <option value="">EN</option>
            </select>
          </div>

          {/* sign in */}
          <a href="/">
            <div>
              <p>Sign In</p>
              <span>Account & Lists</span>
            </div>
          </a>

          {/* orders */}
          <a href="/">
            <div>
              <p>Returns</p>
              <span>& Orders</span>
            </div>
          </a>

          {/* cart */}
          <a href="/" className={classes.cart}>
            <FaShoppingCart size={25} />
            <span>0</span>
          </a>
        </div>
      </div>
    </section>
    <LowerHeader/>
   </>
  );
};

export default Header;
