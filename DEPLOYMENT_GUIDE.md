# SpotIt Citizen Issue Tracker - Deployment Guide

## Overview

SpotIt is a full-stack civic issue tracking application with:
- **Frontend**: Next.js React app (deployed on Vercel)
- **Backend**: Node.js + Express API (deployed on Railway/Render)
- **Database**: MongoDB (hosted on MongoDB Atlas)

## Prerequisites

- GitHub account
- Vercel account (free)
- Railway or Render account (free tier available)
- MongoDB Atlas account (free tier available)

---

## Step 1: Setup MongoDB Atlas (Database)

### 1.1 Create MongoDB Atlas Account
1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new project called "SpotIt"

### 1.2 Create a Cluster
1. Click "Create" to build a new cluster
2. Select "M0 Sandbox" (free tier)
3. Choose your preferred region (closest to your users)
4. Click "Create Cluster" and wait 5-10 minutes

### 1.3 Create Database User
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Create username: `spotit_user`
4. Create password: (save this securely)
5. Click "Add User"

### 1.4 Whitelist IP Address
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere" (0.0.0.0/0) for development
4. Click "Confirm"

### 1.5 Get Connection String
1. Click "Connect" on your cluster
2. Select "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Replace `myFirstDatabase` with `spotit`

Example: `mongodb+srv://spotit_user:password@cluster.mongodb.net/spotit?retryWrites=true&w=majority`

---

## Step 2: Deploy Backend (Node.js API)

### Option A: Deploy on Railway (Recommended)

#### 2A.1 Push Backend to GitHub
\`\`\`bash
# In your backend directory
git init
git add .
git commit -m "Initial backend commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/spotit-backend.git
git push -u origin main
\`\`\`

#### 2A.2 Deploy on Railway
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Select your `spotit-backend` repository
6. Railway auto-detects Node.js and deploys

#### 2A.3 Add Environment Variables
1. In Railway dashboard, go to your project
2. Click "Variables"
3. Add these variables:
   \`\`\`
   MONGODB_URI=mongodb+srv://spotit_user:password@cluster.mongodb.net/spotit
   JWT_SECRET=your-super-secret-key-change-this
   PORT=5000
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-url.vercel.app
   \`\`\`
4. Click "Deploy"

#### 2A.4 Get Backend URL
1. In Railway, go to "Deployments"
2. Click on your deployment
3. Copy the URL (e.g., `https://spotit-backend.railway.app`)
4. Save this for frontend configuration

### Option B: Deploy on Render

#### 2B.1 Push Backend to GitHub (same as 2A.1)

#### 2B.2 Deploy on Render
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click "New +"
4. Select "Web Service"
5. Connect your GitHub repository
6. Fill in the form:
   - **Name**: spotit-backend
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
7. Click "Create Web Service"

#### 2B.3 Add Environment Variables
1. In Render dashboard, go to your service
2. Click "Environment"
3. Add the same variables as Railway (see 2A.3)
4. Click "Save"

#### 2B.4 Get Backend URL
1. Your service URL will be displayed (e.g., `https://spotit-backend.onrender.com`)
2. Save this for frontend configuration

---

## Step 3: Deploy Frontend (Next.js App)

### 3.1 Push Frontend to GitHub
\`\`\`bash
# In your frontend directory
git init
git add .
git commit -m "Initial frontend commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/spotit-frontend.git
git push -u origin main
\`\`\`

### 3.2 Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project"
4. Import your `spotit-frontend` repository
5. Vercel auto-detects Next.js configuration

### 3.3 Add Environment Variables
1. In Vercel, go to your project settings
2. Click "Environment Variables"
3. Add this variable:
   \`\`\`
   NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
   \`\`\`
   (Replace with your actual backend URL from Step 2)
4. Click "Save"

### 3.4 Deploy
1. Click "Deploy"
2. Wait for deployment to complete
3. Your frontend URL will be displayed (e.g., `https://spotit-citizen.vercel.app`)

---

## Step 4: Update Backend CORS

### 4.1 Update Backend Environment Variable
1. Go back to your backend deployment (Railway/Render)
2. Update the `FRONTEND_URL` variable:
   \`\`\`
   FRONTEND_URL=https://your-frontend-url.vercel.app
   \`\`\`
3. Redeploy the backend

---

## Step 5: Test the Application

### 5.1 Test Frontend
1. Open your frontend URL in browser
2. You should see the SpotIt homepage
3. Try signing up and logging in

### 5.2 Test Backend API
\`\`\`bash
# Test health check
curl https://your-backend-url/health

# Test registration
curl -X POST https://your-backend-url/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "city": "Hyderabad"
  }'
\`\`\`

### 5.3 Test Full Flow
1. Register a new user on the frontend
2. Log in
3. Report an issue
4. Check the leaderboard
5. View notifications

---

## Troubleshooting

### Backend Not Connecting to Frontend
- Check `FRONTEND_URL` in backend environment variables
- Verify CORS is enabled in backend
- Check browser console for CORS errors

### Database Connection Error
- Verify MongoDB URI is correct
- Check IP whitelist in MongoDB Atlas
- Ensure database user password is correct

### Frontend API Calls Failing
- Check `NEXT_PUBLIC_API_URL` in frontend environment variables
- Verify backend is running and accessible
- Check network tab in browser DevTools

### Deployment Fails
- Check build logs in Railway/Render/Vercel
- Ensure all dependencies are in package.json
- Verify environment variables are set correctly

---

## Production Checklist

- [ ] Change JWT_SECRET to a strong random string
- [ ] Set NODE_ENV to "production"
- [ ] Enable HTTPS (automatic on Vercel/Railway/Render)
- [ ] Setup MongoDB backup
- [ ] Configure email notifications (optional)
- [ ] Setup monitoring and logging
- [ ] Test all critical user flows
- [ ] Setup custom domain (optional)
- [ ] Enable rate limiting on API
- [ ] Setup error tracking (Sentry, etc.)

---

## Monitoring & Maintenance

### View Logs
- **Railway**: Dashboard → Deployments → Logs
- **Render**: Dashboard → Service → Logs
- **Vercel**: Dashboard → Deployments → Logs

### Update Code
\`\`\`bash
# Make changes locally
git add .
git commit -m "Your changes"
git push origin main

# Automatic redeploy on Railway/Render/Vercel
\`\`\`

### Scale Resources
- **Railway**: Increase plan as needed
- **Render**: Upgrade to paid plan for more resources
- **MongoDB**: Upgrade cluster tier if needed

---

## Cost Estimation (Monthly)

| Service | Free Tier | Cost |
|---------|-----------|------|
| Vercel | ✅ Included | $0 |
| Railway | ✅ $5 credit | $0-20 |
| Render | ✅ Limited | $0-7 |
| MongoDB Atlas | ✅ 512MB | $0 |
| **Total** | | **$0-27** |

---

## Next Steps

1. Setup custom domain (optional)
2. Configure email notifications
3. Setup analytics
4. Add more features based on user feedback
5. Scale infrastructure as needed

For support, contact: support@spotit.com
