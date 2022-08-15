import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount } from "../context/authContext";

function LogoutPage() {
  let { logout } = useAccount();
  let navigate = useNavigate();

  useEffect(() => {
    logout();
    navigate("/", { replace: true });
  }, [logout, navigate]);
}

export default LogoutPage;
