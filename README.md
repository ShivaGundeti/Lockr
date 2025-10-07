Lockr

Lockr is a secure and modern password and vault manager built with Next.js. It allows users to safely store credentials, notes, and URLs in encrypted form. All sensitive data is encrypted on the frontend before sending to the backend, and stored securely in MongoDB. The application also includes role-based access, authentication, and a dashboard to manage vault items efficiently.

Features

Secure user registration and login with encrypted credentials.

Passwords and sensitive vault data encrypted before storage.

Role-based access (User/Admin, if extended).

Vault management: Add, Edit, Delete, View credentials and notes.

Toggleable password visibility and copy to clipboard functionality.

Dark and light theme support.

Responsive and modern UI.

Tech Stack

Frontend: Next.js (App Router), React, Tailwind CSS

Backend: Next.js API Routes, Node.js

Database: MongoDB (via Mongoose)

Authentication: NextAuth.js or custom JWT-based auth

Encryption: CryptoJS (AES)

Notifications: react-hot-toast

Icons: Lucide-react

Installation

Clone the repository

git clone https://github.com/YOUR_USERNAME/REPO_NAME.git
cd REPO_NAME


Install dependencies

npm install


Configure Environment Variables

Create a .env.local file at the root of the project:

MONGODB_URI=<your_mongodb_connection_string>
NEXT_PUBLIC_CRYPTO_SECRET_KEY=<your_frontend_encryption_key>
CRYPTO_SECRET_KEY=<your_backend_encryption_key>
NEXTAUTH_URL=http://localhost:3000


Ensure that the frontend and backend use the same encryption key.

Run the development server

npm run dev


Open http://localhost:3000
 to view your app in the browser.

Folder Structure (Simplified)

/app - Next.js app directory

/app/api - API routes for user and vault operations

/app/Context - Theme and global state context

/lib - Database connection and Mongoose models

/components - UI components

/public - Static assets

Usage

Register a new account.

Log in securely.

Add vault items (credentials, URL, notes).

Edit or delete vault items as needed.

Search and filter vault items.

Toggle dark/light theme.

All data is encrypted before being stored in the database.

Encryption

Frontend: All user credentials and vault data are encrypted using AES via CryptoJS before sending to backend.

Backend: Data is received as encrypted strings and stored directly in MongoDB.

Passwords: User account passwords are additionally hashed with bcrypt.
