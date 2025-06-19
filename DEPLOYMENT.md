# Basketball Attendance App Deployment Guide

This guide will walk you through deploying the Basketball Attendance application for free using:
- MongoDB Atlas (database)
- Render (backend)
- Netlify (frontend)

## Step 1: Set Up MongoDB Atlas

1. Create a free MongoDB Atlas account at https://www.mongodb.com/cloud/atlas/register
2. Create a new project named "Basketball Attendance"
3. Build a free shared cluster:
   - Choose a cloud provider (AWS, Google Cloud, or Azure)
   - Select a free tier region
   - Choose "M0 Sandbox" (Free tier)
   - Name your cluster (e.g., "basketball-cluster")
4. Create a database user:
   - Go to Database Access → Add New Database User
   - Username: Choose a username
   - Password: Generate a secure password
   - Database User Privileges: Read and write to any database
   - Add User
5. Set up network access:
   - Go to Network Access → Add IP Address
   - Select "Allow access from anywhere" (for simplicity)
   - Confirm
6. Get your connection string:
   - Go to Clusters → Connect → Connect your application
   - Copy the connection string (looks like: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/basketball-attendance?retryWrites=true&w=majority`)
   - Replace `<username>` and `<password>` with your database user credentials

## Step 2: Deploy Backend to Render

1. Create a Render account at https://render.com
2. Connect your GitHub repository
3. Create a new Web Service:
   - Select your repository
   - Name: "basketball-attendance-api"
   - Runtime: Node
   - Build Command: `npm install && npm install --prefix server`
   - Start Command: `npm start`
4. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (Render will override this but it's good to set it)
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `CLIENT_URL`: Leave blank for now (we'll update after deploying frontend)
5. Choose Free plan and click "Create Web Service"
6. Note your backend URL (e.g., `https://basketball-attendance-api.onrender.com`)

## Step 3: Deploy Frontend to Netlify

1. Create a Netlify account at https://www.netlify.com
2. Click "New site from Git"
3. Connect to GitHub and select your repository
4. Configure your deploy settings:
   - Base directory: `client`
   - Build command: `npm run build`
   - Publish directory: `build`
5. Add Environment Variable:
   - `REACT_APP_API_URL`: Your Render backend URL (e.g., `https://basketball-attendance-api.onrender.com/api`)
6. Deploy site
7. Note your frontend URL (e.g., `https://basketball-attendance.netlify.app`)

## Step 4: Update Client URL on Render

1. Go back to your Render dashboard
2. Open your basketball-attendance-api web service
3. Go to Environment
4. Update `CLIENT_URL` to your Netlify frontend URL
5. Click "Save Changes"
6. Trigger a manual deploy for changes to take effect

## Step 5: Test Your Deployed Application

1. Open your Netlify frontend URL in a browser
2. Test all functionality:
   - Adding/editing players
   - Taking attendance
   - Viewing attendance history
   - Dashboard statistics

## Troubleshooting

- **MongoDB Connection Issues**:
  - Verify your connection string is correct
  - Check that your IP whitelist includes 0.0.0.0/0 (allow all)
  
- **Backend API Errors**:
  - Check Render logs for specific error messages
  - Verify environment variables are set correctly
  - If you see "Module not found" errors, try manually rebuilding the service in Render dashboard
  - Ensure dependencies are being installed correctly by checking the build logs
  
- **Frontend Not Connecting to Backend**:
  - Check that REACT_APP_API_URL is set correctly
  - Ensure backend CORS is configured properly

## Maintaining Your Application

- MongoDB Atlas free tier gives you 512MB storage (more than enough for this app)
- Render free tier may sleep after inactivity, causing slow initial loads
- Netlify free tier gives you 100GB bandwidth/month and 300 build minutes/month 