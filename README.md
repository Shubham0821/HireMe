# 🚀 HireMe - Modern Full-Stack Job Portal

![MERN Stack](https://img.shields.io/badge/MERN-Stack-blue?style=for-the-badge&logo=mongodb)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=Cloudinary&logoColor=white)

**HireMe** is a premium, full-stack Job Portal web application built using the **MERN** stack (MongoDB, Express, React, Node.js). It is designed to bridge the gap between job seekers and recruiters with a highly interactive, responsive, and robust platform. 

This platform features a dual-role system (Student & Recruiter), advanced Regex-based search algorithms, secure authentication via HTTP-only cookies, and cloud-based file storage integration.

---

## 🔗 Live Demo
**[Insert Deployment Link Here]**

## 📸 Screenshots
*(Insert 2-3 screenshots of the Home page, the Job listing page, and the Admin dashboard here)*

---

## 🛠️ Tech Stack & Architecture

### Frontend (Client)
* **Framework:** React.js powered by Vite for lightning-fast HMR.
* **Styling:** Tailwind CSS (Mobile-First, fully responsive design with Dark/Light mode support).
* **State Management:** Redux Toolkit (RTK) for centralized state management.
* **Routing:** React Router v6.
* **HTTP Client:** Axios (configured with `withCredentials: true` for HTTP-Only Cookies).
* **Icons:** Lucide React.

### Backend (Server)
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB & Mongoose (NoSQL, Relational Document matching using `.populate()`).
* **Authentication:** JSON Web Tokens (JWT) & bcryptjs (Password Hashing).
* **Cloud Storage:** Cloudinary & DataURI (for seamless Resume and Company Logo uploads directly from memory).
* **Middleware:** Multer (memory storage implementation).

---

## ✨ Core Features

* **Role-Based Access Control (RBAC):** Distinct dashboard interfaces for `Students` (applicants) and `Recruiters` (admins).
* **Secure File Uploads (Cloudinary):** Uses Cloudinary API to host Resumes (PDFs) and Company Logos in the cloud, preventing data loss on ephemeral server restarts.
* **Advanced Search Algorithms:** Utilizes MongoDB's `$or`, `$regex`, and precise word boundary (`\b`) pattern matching for highly accurate, case-insensitive keyword filtering (e.g., distinguishing "Software" vs "Software Engineering").
* **Filter Stacking:** Multi-layer URL-based parameter filtering allowing users to simultaneously filter by Category, Location, and Salary without losing state on refresh.
* **Security First:** Protects against XSS attacks by storing JWTs securely inside HTTP-only cookies rather than LocalStorage.
* **Complex Data Population:** Implements deep Mongoose `.populate()` methods to retrieve relational datasets across Jobs, Users, Companies, and Applications.

---

## 💻 Local Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/HireMe.git
cd HireMe
```

### 2. Setup the Backend
```bash
cd backend
npm install
```
* Create a `.env` file in the `backend/` directory with the following variables:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hireme
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_super_secret_jwt_key

# Cloudinary Setup for File Uploads
CLOUD_NAME=your_cloudinary_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
```
* Run the API:
```bash
npm run dev
```

### 3. Setup the Frontend
```bash
cd ../frontend
npm install
```
* Create a `.env` file in the `frontend/` directory (optional, if overriding defaults):
```env
VITE_API_URL=http://localhost:5000/api/v1
```
* Start the React development server:
```bash
npm run dev
```

---

## 🚀 Deployment Guide
* **Frontend:** Highly optimized for deployment on Vercel or Netlify. Ensure to set the `VITE_API_URL` environment variable.
* **Backend:** Ready for deployment on Render, Railway, or Heroku. Cloudinary ensures that ephemeral disk storage does not affect user media (Resumes/Logos).

---
*Built with ❤️ for a modern web experience.*
