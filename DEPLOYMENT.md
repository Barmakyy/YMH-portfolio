# Portfolio MERN Deployment Guide

## Backend Deployment to Render

### Step 1: Push to GitHub

1. Initialize git in server (if not already):

   ```bash
   cd server
   git init
   git add .
   git commit -m "Initial server commit"
   ```

2. Push to your GitHub repo:
   ```bash
   git push origin main
   ```

### Step 2: Deploy to Render

1. Go to [render.com](https://render.com) and sign up
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repo
4. Fill in deployment settings:
   - **Name**: `portfolio-backend` (or your preference)
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or Paid if you want better performance)

### Step 3: Set Environment Variables

In Render dashboard, go to your service → **Environment**:

Add all variables from your `server/.env`:

- `NODE_ENV` = `production`
- `MONGODB_URI` = your MongoDB connection string
- `JWT_SECRET` = your secret (use a strong one!)
- `JWT_EXPIRES_IN` = `8h`
- `JWT_COOKIE_EXPIRES_IN` = `8`
- `ADMIN_EMAIL` = your email
- `ADMIN_PASSWORD` = your password
- `CLIENT_URL` = your Vercel frontend URL (e.g., `https://yourname.vercel.app`)
- `LOGIN_RATE_LIMIT_MAX` = `5`
- `LOGIN_RATE_LIMIT_WINDOW_MS` = `900000`

### Step 4: Deploy

- Click **"Create Web Service"**
- Render will automatically deploy from your repo
- Get your Render URL (looks like: `https://your-portfolio-backend.onrender.com`)

> **Note**: Free tier apps spin down after 15 minutes of inactivity. Upgrade to Pro for always-on service.

---

## Frontend Deployment to Vercel

### Step 1: Update API URL

Update `client/.env.production` with your Render backend URL:

```
VITE_API_URL=https://your-portfolio-backend.onrender.com/api
```

### Step 2: Push to GitHub

```bash
cd client
git add .
git commit -m "Update API URL for production"
git push origin main
```

### Step 3: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repo
4. Select the **`client`** directory as root:
   - Under **"Project Settings"** → **"Root Directory"** → select `client/`

### Step 4: Set Environment Variables

In Vercel dashboard → **Settings** → **Environment Variables**:

Add from `client/.env`:

- `VITE_GITHUB_URL`
- `VITE_LINKEDIN_URL`
- `VITE_TWITTER_URL`
- `VITE_INSTAGRAM_URL`
- `VITE_EMAIL`
- `VITE_SITE_NAME`
- `VITE_SITE_TITLE`
- `VITE_API_URL` = `https://your-portfolio-backend.onrender.com/api` (your Render URL)

### Step 5: Deploy

- Click **"Deploy"**
- Wait for deployment to complete
- You'll get a URL like: `https://your-portfolio.vercel.app`

---

## Update Backend CORS

After you have your Vercel URL, update the backend `CLIENT_URL`:

1. Go to Render dashboard → your service → **Environment**
2. Update `CLIENT_URL` to your Vercel URL
3. Redeploy (should auto-redeploy on environment change)

---

## Testing Your Deployment

1. Visit your Vercel frontend URL
2. Test these features:
   - Page loads correctly
   - Admin login works
   - API calls succeed (check Network tab)
   - File uploads work
   - Analytics tracking works

If you see CORS errors, make sure `CLIENT_URL` in Render matches your Vercel URL exactly.

---

## Troubleshooting

**Problem**: "Cannot GET /api/..."

- **Solution**: Check `VITE_API_URL` in Vercel env vars matches your Render URL

**Problem**: CORS errors when API calls made

- **Solution**: Check `CLIENT_URL` in Render env vars matches your Vercel URL exactly (including https://)

**Problem**: Render app spins down

- **Solution**: Upgrade to Paid plan, or use a monitoring service like UptimeRobot to keep it alive

**Problem**: File uploads not working

- **Solution**: Render's free tier doesn't persist files. Upgrade to Pro for persistent storage, or use cloud storage (AWS S3, etc.)

---

## Security Checklist

- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Change `ADMIN_PASSWORD` to a secure password
- [ ] Don't commit `.env` files to git
- [ ] Use strong JWT_SECRET (generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
- [ ] Keep MongoDB credentials secure
- [ ] Enable HTTPS (both Render and Vercel do this automatically)

---

## Git Setup (if you haven't already)

Initialize git at project root:

```bash
cd c:/Users/Admin/Documents/Portfolio\ MERN
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

Verify with:

```bash
git remote -v
```
