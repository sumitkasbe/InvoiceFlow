\# InvoiceFlow



InvoiceFlow is a full-stack Invoice and Client Management System built using the MERN stack.



It allows authenticated users to manage clients, create and manage invoices, calculate invoice totals, track invoice status, and view dashboard statistics.



\## Features



\### Authentication

\- User registration and login

\- Password hashing using bcrypt

\- JWT-based authentication

\- Protected client and invoice APIs



\### Client Management

\- Create, view, update and delete clients

\- Search clients by name, company or email

\- GST/tax number support

\- Prevent deletion of clients that have existing invoices



\### Invoice Management

\- Create, view, update and delete invoices

\- Multiple invoice line items

\- Quantity and rate based calculations

\- Tax and discount support

\- Backend invoice total calculation

\- Unique invoice numbers

\- Draft, Unpaid, Paid and Overdue statuses

\- Search and filter invoices

\- Filter by client, status and date



\### Dashboard

\- Total invoices

\- Total billed amount

\- Total paid amount

\- Outstanding amount

\- Recent invoices



\## Tech Stack



\### Frontend

\- React.js

\- React Router

\- JavaScript

\- CSS



\### Backend

\- Node.js

\- Express.js

\- MongoDB

\- Mongoose

\- JWT

\- bcryptjs



\## Project Structure



```text

InvoiceFlow/

├── backend/

│   ├── config/

│   ├── controllers/

│   ├── middleware/

│   ├── models/

│   ├── routes/

│   ├── .env.example

│   ├── server.js

│   └── package.json

│

├── frontend/

│   ├── src/

│   │   ├── components/

│   │   ├── pages/

│   │   └── services/

│   └── package.json

│

├── .gitignore

└── README.md

