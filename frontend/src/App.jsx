import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Invoices from "./pages/Invoices";
import InvoiceDetails from "./pages/InvoiceDetails";
import EditInvoice from "./pages/EditInvoice";
import CreateInvoice from "./pages/CreateInvoice";
import Navbar from "./components/Navbar";

function ProtectedRoute({ children }) {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return (
        <>
            <Navbar />
            {children}
        </>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Authentication */}
                <Route path="/login" element={<Login />} />

                <Route path="/register" element={<Register />} />

                {/* Protected Routes */}
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/clients"
                    element={
                        <ProtectedRoute>
                            <Clients />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/invoices"
                    element={
                        <ProtectedRoute>
                            <Invoices />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/invoices/create"
                    element={
                        <ProtectedRoute>
                            <CreateInvoice />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/invoices/:id/edit"
                    element={
                        <ProtectedRoute>
                            <EditInvoice />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/invoices/:id"
                    element={
                        <ProtectedRoute>
                            <InvoiceDetails />
                        </ProtectedRoute>
                    }
                />

                {/* Unknown URL */}
                <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;