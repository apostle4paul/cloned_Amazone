import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import classes from "./AdminHeader.module.css";

const AdminHeader = () => {
  const navigate = useNavigate();
  const admin = JSON.parse(sessionStorage.getItem("active-admin"));

  const adminLogout = () => {
    toast.success("Logged out!", {
      position: "top-center",
      autoClose: 1000,
    });

    
    sessionStorage.removeItem("active-admin");

  
    navigate("/admin/auth");
  };

  return (
    <nav className={classes.admin_nav}>
      <div className={classes.admin_logo}>
        <Link to="/admin/dashboard">
          <h2>Admin Panel</h2>
        </Link>
      </div>

      <ul className={classes.admin_links}>
        <li>
          <Link to="/addcategory">Add Category</Link>
        </li>
        <li>
          <Link to="/addproduct">Add Product</Link>
        </li>
        <li>
          <Link to="/user/admin/allorder">All Orders</Link>
        </li>
        <li>
          <Link to="/user/admin/assigndelivery">Assign Delivery</Link>
        </li>
        <li>
          <button onClick={adminLogout} className={classes.logout_btn}>
            Logout
          </button>
        </li>
      </ul>

      <ToastContainer />
    </nav>
  );
};

export default AdminHeader;
