const API_URL = "http://localhost:8000/api";

// ==================== Authentication ====================

export const registerUser = async (userData) => {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Registration failed");
    }

    return data;
};

export const loginUser = async (userData) => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Login failed");
    }

    return data;
};


// ==================== Authentication Headers ====================

export const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
    };
};


// ==================== Dashboard ====================

export const getDashboard = async () => {
    const response = await fetch(
        `${API_URL}/invoices/dashboard`,
        {
            method: "GET",
            headers: getAuthHeaders()
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch dashboard");
    }

    return data;
};


// ==================== Clients ====================

export const getClients = async (search = "") => {
    const response = await fetch(
        `${API_URL}/clients?search=${encodeURIComponent(search)}`,
        {
            method: "GET",
            headers: getAuthHeaders()
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch clients");
    }

    return data;
};

export const createClient = async (clientData) => {
    const response = await fetch(`${API_URL}/clients`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(clientData)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to create client");
    }

    return data;
};

export const updateClient = async (id, clientData) => {
    const response = await fetch(`${API_URL}/clients/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(clientData)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to update client");
    }

    return data;
};

export const deleteClient = async (id) => {
    const response = await fetch(`${API_URL}/clients/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to delete client");
    }

    return data;
};


// ==================== Invoices ====================

export const getInvoices = async (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.search) {
        params.append("search", filters.search);
    }

    if (filters.client) {
        params.append("client", filters.client);
    }

    if (filters.status) {
        params.append("status", filters.status);
    }

    if (filters.fromDate) {
        params.append("fromDate", filters.fromDate);
    }

    if (filters.toDate) {
        params.append("toDate", filters.toDate);
    }

    const response = await fetch(
        `${API_URL}/invoices?${params.toString()}`,
        {
            method: "GET",
            headers: getAuthHeaders()
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch invoices");
    }

    return data;
};

export const createInvoice = async (invoiceData) => {
    const response = await fetch(`${API_URL}/invoices`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(invoiceData)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to create invoice");
    }

    return data;
};

export const getInvoiceById = async (id) => {
    const response = await fetch(`${API_URL}/invoices/${id}`, {
        method: "GET",
        headers: getAuthHeaders()
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch invoice");
    }

    return data;
};

export const updateInvoice = async (id, invoiceData) => {
    const response = await fetch(`${API_URL}/invoices/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(invoiceData)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to update invoice");
    }

    return data;
};

export const deleteInvoice = async (id) => {
    const response = await fetch(`${API_URL}/invoices/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to delete invoice");
    }

    return data;
};