# VVA Architecture & Interiors - Setup & Deployment Guide

This document outlines the architecture, local development setup, and deployment instructions for the VVA  Design Studio web application.

## 🏛️ Project Architecture

This architecture portfolio is built with modern, high-performance web technologies:
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS with custom Obsidian/Ivory minimalistic design variables
- **Animations**: Framer Motion for UI reveals & GSAP for heavy scroll-triggered image interactions
- **Scrolling**: Lenis (Studio Freight) for buttery smooth application-level scrolling
- **Data/Database**: MongoDB with Mongoose ODM for persistent project management

## 💻 Local Development Setup

To run this project locally, ensure you have Node.js (v18 or higher) installed.

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Environment Configuration:**
   Create a `.env.local` file in the root directory and add your MongoDB connection string:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=password
   ```

3. **Migrate Initial Data:**
   Run the seeding script to populate your database with initial project data:
   ```bash
   node seed-db.js
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```

5. **View the Application:**
   Open your browser and navigate to `http://localhost:3000`.

### Local Admin Dashboard
Navigate to `http://localhost:3000/admin` to manage your projects through the secure administrative interface.

---

## 🚀 Production Deployment

For detailed instructions on deploying this project to a live domain (using Vercel, MongoDB Atlas, etc.), please refer to the:

### 👉 [DEPLOYMENT.md](./DEPLOYMENT.md)
