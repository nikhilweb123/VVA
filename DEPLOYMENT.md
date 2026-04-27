# Production Deployment Guide

This guide provides step-by-step instructions to take the **VVA Architecture Portfolio** live on a production domain with a persistent MongoDB database.

## 📋 Prerequisites

1.  **Domain Name**: A domain (e.g., `vva-design.com`) purchased from a registrar like GoDaddy, Namecheap, or Google Domains.
2.  **Hosting Provider**: **Vercel** is highly recommended for Next.js projects, but you can also use Netlify or a VPS (DigitalOcean/AWS).
3.  **MongoDB Atlas Account**: A free or paid account at [mongodb.com](https://www.mongodb.com/cloud/atlas).

---

## 🛠️ Step 1: Set Up MongoDB Atlas

Since the production environment cannot save data to local files, we use MongoDB Atlas for persistent storage.

1.  **Create a Cluster**: Log in to MongoDB Atlas and create a new free cluster.
2.  **Database User**: Create a database user with a username and password. **Important**: Save these credentials.
3.  **Network Access**: Add `0.0.0.0/0` to the IP Access List to allow connections from your hosting provider.
4.  **Get Connection String**:
    - Click **Connect** > **Connect your application**.
    - Copy the connection string (e.g., `mongodb+srv://<username>:<password>@cluster0.mongodb.net/...`).
    - Replace `<password>` with your actual database user password.

---

## 🚀 Step 2: Deploy to Vercel (Recommended)

Vercel is the creator of Next.js and provides the most seamless deployment experience.

1.  **Push to GitHub**: Upload your project code to a private GitHub repository.
2.  **Import to Vercel**:
    - Log in to [Vercel](https://vercel.com).
    - Click **Add New** > **Project**.
    - Import your GitHub repository.
3.  **Configure Environment Variables**:
    In the "Environment Variables" section during setup, add the following:
    - `MONGODB_URI`: Your MongoDB connection string from Step 1.
    - `ADMIN_USERNAME`: Your desired admin username.
    - `ADMIN_PASSWORD`: Your desired admin password.
4.  **Deploy**: Click **Deploy**. Vercel will build and host your site on a `.vercel.app` subdomain.

---

## 🔗 Step 3: Connect Your Custom Domain

1.  In your Vercel Dashboard, go to **Settings** > **Domains**.
2.  Enter your custom domain (e.g., `vva-design.com`).
3.  Follow the instructions to update your DNS records at your domain registrar (usually adding an **A record** or **CNAME**).
4.  Vercel will automatically provision an SSL certificate (HTTPS) for you.

---

## 📦 Step 4: Migrate Existing Data

Once the site is live, you need to move your existing projects from the local JSON files to your new MongoDB database.

1.  Update your local `.env.local` file with the production `MONGODB_URI`.
2.  Run the seeding script from your terminal:
    ```bash
    node seed-db.js
    ```
3.  Your production database is now populated with all your projects!

---

## 📝 Ongoing Management

- **Admin Dashboard**: Access `yourdomain.com/admin` to add, edit, or delete projects.
- **Images**: When you upload images via the dashboard, they are stored in the `public/uploads` directory. 
    - *Note*: If using Vercel, the filesystem is ephemeral. For a truly professional production setup, it is recommended to use a service like **Cloudinary** or **AWS S3** for image storage.

---

## 🛡️ Security Checklist
- [ ] Change the default `ADMIN_PASSWORD` in your production environment variables.
- [ ] Ensure `MONGODB_URI` is never committed to GitHub (it should only be in `.env.local` or hosting provider settings).
- [ ] Regularly backup your MongoDB database via the Atlas dashboard.
