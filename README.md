# ⚡ QR Code Studio - Full Stack App

A modern, production-grade Decoupled Full-Stack Web Application for generating, managing, and tracking dynamic QR Codes with multi-user authentication.

![Quarkus](https://img.shields.io/badge/Backend-Quarkus%203.x-red?style=for-the-badge&logo=quarkus)
![React](https://img.shields.io/badge/Frontend-React%2019%20%2B%20TS-blue?style=for-the-badge&logo=react)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?style=for-the-badge&logo=postgresql)
![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind%20CSS%20v4-38B2AC?style=for-the-badge&logo=tailwindcss)
![ShadcnUI](https://img.shields.io/badge/UI-Shadcn%20UI-black?style=for-the-badge)

---

## ✨ Features

- 🔐 **Multi-User Authentication**: Register & Login with BCrypt password hashing & SmallRye JWT token security.
- ⚡ **Dynamic QR Code Generation**: High-performance PNG streaming powered by Google ZXing library.
- 🗄️ **Personal QR Vault**: User-scoped history vault stored in PostgreSQL (Users can only view, download, & delete their own QR codes).
- 🎨 **Monochrome Dark Aesthetics**: Premium dark theme UI crafted with Shadcn UI & Tailwind CSS v4.
- 🌐 **Decoupled Architecture**: Clean separation between Quarkus REST Backend API and Vite React Frontend.

---

## 🛠️ Tech Stack

### **Backend (`/qr-generator`)**
- **Framework**: Quarkus (Java / OpenJDK)
- **Database**: PostgreSQL + Hibernate Panache ORM
- **Security**: SmallRye JWT + BCrypt Password Hashing
- **QR Engine**: Google ZXing Core & JavaSE

### **Frontend (`/qr-frontend`)**
- **Framework**: Vite + React + TypeScript
- **Styling**: Tailwind CSS v4 + Shadcn UI
- **Routing**: React Router DOM
- **HTTP Client**: Axios (with Request & Response Interceptors)

---

## 🚀 Getting Started

### Prerequisites
- JDK 17+ or JDK 25
- Node.js 18+ & npm
- PostgreSQL running locally at `localhost:5432`

---

### 1. Backend Setup (`qr-generator`)

```bash
# Navigate to backend directory
cd qr-generator

# Start Quarkus in Live Coding Dev Mode
./mvnw quarkus:dev
