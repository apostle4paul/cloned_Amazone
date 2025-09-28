import { useContext, useEffect } from "react";
import { DataContext } from "../DataProvider/DataProvider";
import { useNavigate } from "react-router-dom";

function ProtectedRoute({ children, msg, redirect }) {
  const { state } = useContext(DataContext); 
  const { user } = state; 
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/auth", { state: { msg, redirect } });
    }
  }, [user, navigate, msg, redirect]);

  return children;
}

export default ProtectedRoute;
