# InvoiceFlow – Invoice & Client Management System

## Project Overview

InvoiceFlow is a MERN stack web application for managing clients and invoices.

The application allows authenticated users to:

- Register and login securely
- Manage clients
- Create and manage itemized invoices
- Automatically calculate invoice totals
- Search and filter clients and invoices
- Track invoice statuses
- View billing information through a dashboard

## Technology Stack

- **Frontend:** React.js, React Router, Axios, CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** JWT, bcryptjs

---

## Features

### Authentication

- User registration and login
- Password hashing using bcryptjs
- JWT-based authentication
- Protected client and invoice routes
- User-specific data access

### Client Management

- Create, view, update and delete clients
- Search clients by name, company or email
- Store name, company, email, phone and billing address
- Optional GST/tax number

### Invoice Management

- Create invoices for selected clients
- Multiple invoice line items
- Description, quantity and rate for each item
- Automatic line amount calculation
- Tax percentage support
- Discount support
- Automatic subtotal, tax and grand total calculation
- Unique invoice numbers such as `INV-2026-001`
- Issue date and due date
- Draft, Unpaid, Paid and Overdue statuses
- View invoice details
- Edit and delete invoices
- Search and filter invoices by client, invoice number, status and date

### Dashboard

- Total invoices
- Total billed amount
- Total paid amount
- Outstanding amount
- Recent invoices and their statuses

---

## Project Structure

    InvoiceFlow/
    │
    ├── backend/
    │   ├── config/
    │   │   └── db.js
    │   ├── controllers/
    │   │   ├── authController.js
    │   │   ├── clientController.js
    │   │   └── invoiceController.js
    │   ├── middleware/
    │   │   └── authMiddleware.js
    │   ├── models/
    │   │   ├── User.js
    │   │   ├── Client.js
    │   │   └── Invoice.js
    │   ├── routes/
    │   │   ├── authRoutes.js
    │   │   ├── clientRoutes.js
    │   │   └── invoiceRoutes.js
    │   ├── .env.example
    │   ├── server.js
    │   └── package.json
    │
    ├── frontend/
    │   ├── src/
    │   │   ├── components/
    │   │   │   └── Navbar.jsx
    │   │   ├── pages/
    │   │   │   ├── Login.jsx
    │   │   │   ├── Register.jsx
    │   │   │   ├── Dashboard.jsx
    │   │   │   ├── Clients.jsx
    │   │   │   ├── Invoices.jsx
    │   │   │   ├── CreateInvoice.jsx
    │   │   │   ├── EditInvoice.jsx
    │   │   │   └── InvoiceDetails.jsx
    │   │   ├── services/
    │   │   │   └── api.js
    │   │   ├── App.jsx
    │   │   ├── App.css
    │   │   ├── index.css
    │   │   └── main.jsx
    │   └── package.json
    │
    ├── .gitignore
    └── README.md

---

## Prerequisites

Before running the project, make sure the following are installed:

- Node.js
- npm
- MongoDB or MongoDB Atlas
- Git

---

## Setup Steps

### 1. Clone the Repository

    git clone https://github.com/sumitkasbe/InvoiceFlow.git
    cd InvoiceFlow

### 2. Backend Setup

Navigate to the backend directory:

    cd backend

Install backend dependencies:

    npm install

Create a `.env` file inside the `backend` folder and add the required environment variables.

Start the backend server:

    node server.js

The backend server will run on:

    http://localhost:8000

### 3. Frontend Setup

Open a new terminal and navigate to the frontend directory:

    cd frontend

Install frontend dependencies:

    npm install

Start the frontend development server:

    npm run dev

Open the frontend URL displayed by Vite in the terminal.

---

## Environment Variables

The backend uses environment variables for database configuration and authentication.

Create the following file:

    backend/.env

Add:

    PORT=8000
    MONGO_URI=mongodb+srv://invoiceUser:invoice6355@cluster0.fx5rfpn.mongodb.net/invoiceflow?appName=Cluster0
    JWT_SECRET=invoicesupersecretekeyishere

### Environment Variable Description

| Variable | Description |
|---|---|
| `PORT` | Port number used by the Express server 8000 |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key used to generate and verify JWT tokens |

A `.env.example` file is included in the repository as a reference.

### Important Security Note

The actual `.env` file is not committed to GitHub.

The repository does not contain:

- Database passwords
- JWT secrets
- Private keys
- Real credentials
- `.env` files
- `node_modules`

---

## Authentication and Sample Login Details

Authentication is implemented using JWT and bcryptjs.

### Authentication Flow

1. User registers with name, email and password.
2. Password is securely hashed using bcryptjs.
3. User logs in using email and password.
4. The backend verifies the password.
5. A JWT token is generated after successful login.
6. Protected routes require the JWT token.
7. The authenticated user's ID is used to access only their own client and invoice data.

### Sample Login Details

No real or pre-seeded credentials are stored in the repository.

Create a test account using the Register page.

Example test account:

    Name: Sumit
    Email: sumit@test.com
    Password: 123456

These are example credentials for creating a local test account. They are not pre-seeded credentials and are not connected to a real account.



---

## API Overview

### Authentication APIs

    POST /api/auth/register
    POST /api/auth/login

### Client APIs

    GET    /api/clients
    POST   /api/clients
    GET    /api/clients/:id
    PUT    /api/clients/:id
    DELETE /api/clients/:id

### Invoice APIs

    GET    /api/invoices
    POST   /api/invoices
    GET    /api/invoices/:id
    PUT    /api/invoices/:id
    DELETE /api/invoices/:id
    GET    /api/invoices/dashboard

---

## Important Design Decisions

### 1. JWT Authentication

JWT is used to protect client and invoice APIs.

The authenticated user's ID is extracted from the JWT and used to ensure that users can only access their own data.

### 2. Password Hashing

Passwords are hashed using bcryptjs before being stored in MongoDB.

Plain-text passwords are not stored.

### 3. Backend Invoice Calculations

Invoice totals are calculated on the backend instead of trusting totals sent from the frontend.

The backend calculates:

    Line Amount = Quantity × Rate
    Subtotal = Sum of all line item amounts
    Tax Amount = Subtotal × Tax Percentage
    Grand Total = Subtotal + Tax Amount - Discount

This prevents manipulated totals from being directly accepted from the browser.

### 4. Unique Invoice Numbers

Each invoice receives a unique invoice number such as:

    INV-2026-001
    INV-2026-002

The invoice number is configured as unique in the MongoDB schema.

### 5. Overdue Status

Invoice status is updated based on the due date and payment status.

An unpaid invoice whose due date has passed can be updated to `Overdue`.

### 6. Client Deletion

A client cannot be deleted if existing invoices are associated with that client.

This prevents existing invoices from referencing a deleted client.

### 7. User Data Isolation

Client and invoice queries are filtered using the authenticated user's ID.

This ensures that one authenticated user cannot access another user's business data.

---

## Known Limitations

The project focuses on the required core assignment functionality.

The following features were not implemented because they were listed as bonus features:

- PDF invoice generation
- Printable invoice layout
- Company logo
- Partial/full payment history
- Email invoice sending
- CSV export
- Billing/payment charts
- Automated test suite

These features can be added in future versions.

---

## Screenshots / Demo

The application includes the following main screens:

- Login
<img width="700" height="790" alt="Screenshot 2026-09-21 140608" src="https://github.com/user-attachments/assets/9b713319-6284-497b-a75e-5a97bbde003a" />

- Registration
<img width="700" height="790" alt="Screenshot 2026-09-21 140628" src="https://github.com/user-attachments/assets/5413a79d-9589-434b-9ff7-d9efcaf08cf0" />
  
- Dashboard
<img width="1482" height="870" alt="Screenshot 2026-09-21 140737" src="https://github.com/user-attachments/assets/6d965be4-54fc-4e06-96c9-efe78fd7c0e9" />

- Client Management
<img width="1447" height="882" alt="Screenshot 2026-09-21 140813" src="https://github.com/user-attachments/assets/5a211cfe-0a68-4a77-bd4d-39b403f5ebfd" />

- Invoice List
<img width="1461" height="872" alt="Screenshot 2026-09-21 140831" src="https://github.com/user-attachments/assets/235ddfae-737a-4b2e-a0bc-4f28f5251588" />

- Create Invoice
<img width="758" height="792" alt="Screenshot 2026-09-21 140906" src="https://github.com/user-attachments/assets/108a4874-f6f3-4623-b452-544e8a5f250c" />

- Edit Invoice
<img width="720" height="777" alt="image" src="https://github.com/user-attachments/assets/e7b6314d-38d3-4828-8466-82b586b1f44b" />

- Invoice Details
<img width="745" height="592" alt="Screenshot 2026-09-21 140928" src="https://github.com/user-attachments/assets/81e39792-b31c-4538-801d-a0a984b884f2" />

- Add Clients
<img width="742" height="870" alt="Screenshot 2026-09-21 140949" src="https://github.com/user-attachments/assets/ce406334-e812-496a-9b6e-334690dd2c15" />



---

## Security

The repository does not contain:

- `node_modules`
- `.env` files
- Database passwords
- JWT secrets
- Private keys
- Real user credentials

Sensitive configuration must be provided through environment variables locally.

---

## GitHub Repository

https://github.com/sumitkasbe/InvoiceFlow

---

## Author

**Sumit Kasbe**

GitHub: https://github.com/sumitkasbe
