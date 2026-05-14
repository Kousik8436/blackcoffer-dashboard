# Blackcoffer Analytics Dashboard

A full-stack MERN (MongoDB, Express, React, Node.js) web application that provides a comprehensive, interactive data visualization dashboard. It allows users to track metrics such as intensity, likelihood, and relevance across various sectors, regions, and topics.

## 🚀 Features

- **Interactive Data Visualizations:** Features a variety of charts including:
  - Trend Evolution (Intensity vs. Likelihood by Year)
  - High-Impact Topics by Intensity
  - Sector Distribution Pie Chart
  - Country/Region Activity Charts
  - PESTLE Risk & Opportunity Breakdown
  - Risk Matrix Scatter Plot
- **Advanced Filtering:** Dynamically filter dashboard data by End Year, Topic, Sector, Region, PESTLE, Source, Country, and SWOT.
- **Responsive UI:** Modern, clean, and responsive design with a collapsible sidebar and a sticky top navigation bar.
- **Dark Mode:** Built-in theme toggling between Light and Dark modes.
- **Settings & Help Pages:** Custom dashboard settings and a "Connect with Me" support form.

## 💻 Tech Stack

**Frontend:**
- React.js (Bootstrapped with Vite)
- Axios (for API requests)
- Custom CSS Variables for Theming

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose (ODM)
- Cors & Dotenv

**Deployment:**
- Vercel (Serverless backend & static frontend)
- MongoDB Atlas (Cloud Database)

---

## 📂 Project Structure

```text
blackcoffer-dashboard/
├── backend/
│   ├── models/           # Mongoose schemas (Data.js)
│   ├── routes/           # Express API routes (dataRoutes.js)
│   ├── importData.js     # Script to seed MongoDB with jsondata.json
│   ├── jsondata.json     # Raw dataset
│   ├── server.js         # Entry point for the Express server
│   └── vercel.json       # Vercel serverless configuration
│
├── frontend/
│   ├── src/
│   │   ├── components/   # React components (Topbar, Sidebar, Charts, etc.)
│   │   ├── App.jsx       # Main application layout and state
│   │   └── main.jsx      # React DOM rendering
│   └── package.json
│
└── README.md
```

---

## 🛠️ Local Development Setup

### Prerequisites
- [Node.js](https://nodejs.org/) installed
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or a local MongoDB instance)

### 1. Database Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install backend dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` folder and add your MongoDB connection string:
   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/blackcoffer?retryWrites=true&w=majority
   PORT=5000
   ```
4. **Seed the Database:** Run the import script to load the provided `jsondata.json` into your MongoDB database:
   ```bash
   node importData.js
   ```
5. Start the backend server:
   ```bash
   npm run dev
   # or: node server.js
   ```
   *The server should now be running on `http://localhost:5000`.*

### 2. Frontend Setup
1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the `frontend` folder to point to your backend API:
   ```env
   VITE_API_BASE_URL=http://localhost:5000
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   *The React app should now be accessible, typically at `http://localhost:5173`.*

---

## ☁️ Deployment (Vercel)

The project is configured to be deployed as two separate projects on Vercel from the same repository.

### Backend Deployment
1. Import the repository into Vercel.
2. Set the **Root Directory** to `backend`.
3. Add the `MONGO_URI` Environment Variable.
4. Deploy. Vercel will use `vercel.json` to run `server.js` as a serverless function.
5. Copy the generated backend URL (e.g., `https://blackcoffer-backend.vercel.app`).

### Frontend Deployment
1. Import the repository into Vercel again as a new project.
2. Set the **Root Directory** to `frontend`.
3. Add an Environment Variable named `VITE_API_BASE_URL` and paste the backend URL you copied.
4. Deploy.