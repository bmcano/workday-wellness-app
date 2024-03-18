import { NavigateFunction } from "react-router-dom";

export const handleLogout = (navigate: NavigateFunction) => {
    localStorage.removeItem("token");
    console.log("Logging Out");
    navigate('/login');
}
