# VVA Architecture & Interiors - Setup & Deployment Guide

This document outlines the architecture, local development setup, and deployment instructions for the VVA  Design Studio web application.

## 🏛️ Project Architecture

This architecture portfolio is built with modern, high-performance web technologies:
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS with custom Obsidian/Ivory minimalistic design variables
- **Animations**: Framer Motion for UI reveals & GSAP for heavy scroll-triggered image interactions
- **Scrolling**: Lenis (Studio Freight) for buttery smooth application-level scrolling
- **Data/CMS**: File-system-based local CMS storing projects in `src/data/projects.json`

## 💻 Local Development Setup

To run this project locally, ensure you have Node.js (v18 or higher) installed.

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Run the Development Server:**
   ```bash
   npm run dev
   ```

3. **View the Application:**
   Open your browser and navigate to `http://localhost:3000`.

### Local Admin Dashboard
You can navigate to `http://localhost:3000/admin/projects` locally to use your built-in CMS. Since this runs on your local machine, writes made to the Projects database will instantly persist to the `projects.json` filesystem.

---

## 🚀 Depolying on Netlify 

Next.js projects run excellently on Netlify, but they utilize a serverless architecture.

### Continuous Deployment Setup
1. **Push your code to a Git Repository** (GitHub, GitLab, or Bitbucket).
2. **Log into Netlify** and click **Add New Site** > **Import an existing project**.
3. **Select your repository**. Netlify will automatically detect that this is a Next.js project.
4. **Deploy Settings:**
   - **Build Command:** `npm run build`
   - **Publish Directory:** `.next`
   - Netlify will automatically install the Essential Next.js plugin (`@netlify/plugin-nextjs`) which handles SSR, API routes, and Server Components dynamically.
5. Click **Deploy Site**.

### ⚠️ CRITICAL WARNING REGARDING THE CMS ON NETLIFY

The built-in CMS relies on the Node.js `fs` (FileSystem) module to overwrite the `src/data/projects.json` file. 

**Netlify (and other serverless hosts) features a Read-Only File System in production.**
When you trigger Serverless Functions (API Routes) on Netlify, they cannot permanently write to local files. Any updates you make through the `/admin/projects` portal will be destroyed as soon as the function terminates or when the project rebuilds.

### How to Fix for Production:
If the client needs to edit projects on the live deployed Netlify site, you will need to replace the local JSON read/write logic with a persistent database. Recommended choices:
- **Supabase / Vercel Postgres:** Fast, relational SQL databases to store the fields.
- **Firebase / MongoDB:** Simple NoSQL databases.
- **Headless CMS integration (Sanity.io, Strapi):** Perfect for architecture portfolios.

Until a database is connected, to change projects on the live site, update the `src/data/projects.json` file on your local machine and commit the changes to Git. Netlify will automatically rebuild and show the new projects!
