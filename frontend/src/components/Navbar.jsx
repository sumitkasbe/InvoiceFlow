import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">
                InvoiceFlow
            </Link>

            <div className="navbar-links">
                <Link to="/">Dashboard</Link>
                <Link to="/clients">Clients</Link>
                <Link to="/invoices">Invoices</Link>

                <button onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;