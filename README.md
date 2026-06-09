# Do with AI - All-in-One AI SaaS Platform 🚀

A comprehensive MERN stack SaaS application that provides a suite of AI-powered tools. Built with a beautiful, professional, and fully responsive UI using React and Tailwind CSS.

## 🌟 Features

*   **User Authentication:** Secure login and registration powered by Clerk.
*   **Stripe Integration:** Pro and Enterprise subscription plans with Stripe Checkout.
*   **AI Image Generation:** Generate realistic and stylized images from text prompts.
*   **Background Removal:** Instantly remove backgrounds from images.
*   **Object Removal:** Magically erase unwanted objects from photos.
*   **Resume Review (CV):** AI-powered analysis and feedback for PDF resumes.
*   **Article Writer:** Generate long-form, SEO-optimized articles.
*   **Blog Title Generator:** Create catchy, high-converting blog titles.
*   **Responsive Design:** Fully responsive across Mobile, Tablet, and Desktop.

## 💻 Tech Stack

**Frontend:**
*   React (Vite)
*   Tailwind CSS
*   Lucide React (Icons)
*   Clerk (Authentication)
*   React Router DOM

**Backend:**
*   Node.js & Express
*   MongoDB (Mongoose)
*   Stripe (Payments)
*   Google Gemini AI API
*   ClipDrop API (Image Processing)
*   Multer (File Uploads)

---

## 🛠️ Local Setup

1. **Clone the repository**

2. **Setup the Backend (`/server`)**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret
   STRIPE_SECRET_KEY=your_stripe_secret_key
   GEMINI_API_KEY=your_gemini_api_key
   CLIPDROP_API=your_clipdrop_api_key
   ```
   Run the server: `npm run server`

3. **Setup the Frontend (`/client`)**
   ```bash
   cd client
   npm install
   ```
   Create a `.env` file in the `client` directory:
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   ```
   Run the frontend: `npm run dev`

---

## 🚀 Deployment Guide (Vercel & Render)

Since this is a MERN stack application, the best approach is to host the **Frontend on Vercel** and the **Backend on a service like Render or Railway**.

### Step 1: Deploy the Backend (Render.com)
1. Push your code to GitHub.
2. Go to [Render](https://render.com/) and create a new **Web Service**.
3. Connect your GitHub repository and select the `server` folder as the Root Directory.
4. Set the Build Command to `npm install` and the Start Command to `node server.js`.
5. Add all the Environment Variables from your `server/.env` file.
6. Deploy! Once deployed, copy your backend URL (e.g., `https://your-api.onrender.com`).

### Step 2: Update Frontend API URL
Before deploying the frontend, you need to point it to your live backend.
1. In your frontend code (wherever you use `axios`), change `http://localhost:5000` to your new Render backend URL.
2. *Tip: You can use an environment variable like `import.meta.env.VITE_BACKEND_URL` for this.*

### Step 3: Deploy the Frontend (Vercel)
1. Go to [Vercel](https://vercel.com/) and create a new project.
2. Import your GitHub repository.
3. Set the **Framework Preset** to `Vite`.
4. Set the **Root Directory** to `client`.
5. In Environment Variables, add your `VITE_CLERK_PUBLISHABLE_KEY` (and `VITE_BACKEND_URL` if you set it up).
6. Click **Deploy**.

🎉 Your All-in-One AI SaaS is now live!
