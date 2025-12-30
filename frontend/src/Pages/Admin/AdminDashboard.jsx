import React, { useState } from "react";
import AdminHeader from "./AdminHeader";
import AddCategoryForm from "../productComponent/AddCategoryForm";
import AddProductForm from "../productComponent/AddProductForm";
import GetAllCategories from "../productComponent/GetAllCategories";
import AdminAllProducts from "../productComponent/AdminAllProducts";
import AdminOrders from "../productComponent/AdminOrders";
import AssignDelivery from "../productComponent/AssignDelivery";
import classes from "./AdminDashboard.module.css";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("home");

  const renderContent = () => {
    switch (activeSection) {
      case "addCategory":
        return (
          <>
            <h1>Add Category</h1>
            <AddCategoryForm />
            <GetAllCategories />
          </>
        );

      case "addProduct":
        return (
          <>
            <h1>Add Product</h1>
            <AddProductForm />
            <AdminAllProducts />
          </>
        );

      case "orders":
        return <AdminOrders />;

      case "assignDelivery":
        return <AssignDelivery />;

      default:
        return (
          <>
            <h1>Admin Dashboard</h1>
            <div className={classes.cards}>
              <div
                className={classes.card}
                onClick={() => setActiveSection("addCategory")}
              >
                <h2>Categories</h2>
                <p>Manage product categories</p>
              </div>

              <div
                className={classes.card}
                onClick={() => setActiveSection("addProduct")}
              >
                <h2>Products</h2>
                <p>Add or update products</p>
              </div>

              <div
                className={classes.card}
                onClick={() => setActiveSection("orders")}
              >
                <h2>Orders</h2>
                <p>View customer orders</p>
              </div>

              <div
                className={classes.card}
                onClick={() => setActiveSection("assignDelivery")}
              >
                <h2>Assign Delivery</h2>
                <p>Assign orders to delivery personnel</p>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className={classes.dashboard_container}>
      <AdminHeader />

      <div className={classes.dashboard_body}>
        <aside className={classes.sidebar}>
          <ul>
            <li
              className={activeSection === "home" ? classes.active : ""}
              onClick={() => setActiveSection("home")}
            >
              Dashboard
            </li>

            <li
              className={activeSection === "addCategory" ? classes.active : ""}
              onClick={() => setActiveSection("addCategory")}
            >
              Categories
            </li>

            <li
              className={activeSection === "addProduct" ? classes.active : ""}
              onClick={() => setActiveSection("addProduct")}
            >
              Products
            </li>

            <li
              className={activeSection === "orders" ? classes.active : ""}
              onClick={() => setActiveSection("orders")}
            >
              Orders
            </li>

            <li
              className={activeSection === "assignDelivery" ? classes.active : ""}
              onClick={() => setActiveSection("assignDelivery")}
            >
              Assign Delivery
            </li>
          </ul>
        </aside>

        <main className={classes.main_content}>{renderContent()}</main>
      </div>
    </div>
  );
};

export default AdminDashboard;
