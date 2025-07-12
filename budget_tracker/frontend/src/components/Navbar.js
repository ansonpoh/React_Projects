import { useLocation, useNavigate } from "react-router-dom";


export default function Navbar() {
    
    const nav = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <>
        <div className="navbar">
            <div className={`navbar_item ${isActive("/home") ? "active" : ""}`} 
                onClick={() => nav("/home", )}>Home</div>
            <div className={`navbar_item ${isActive("/transactions") ? "active" : ""}`} 
                onClick={() => nav("/transactions",)}>Transactions</div>
            <div className={`navbar_item ${isActive("/accounts") ? "active" : ""}`} 
                onClick={() => nav("/accounts",)}>Accounts</div>
            <div className={`navbar_item ${isActive("/categories") ? "active" : ""}`} 
                onClick={() => nav("/categories",)}>Categories</div>
            <div className={`navbar_item ${isActive("/settings") ? "active" : ""}`} 
                onClick={() => nav("/settings",)}>Settings</div>
        </div>
        </>
    )
}

