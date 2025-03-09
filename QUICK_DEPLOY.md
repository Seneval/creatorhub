# Quick Deployment Steps

## 1. Frontend (Netlify)
1. Go to https://app.netlify.com/
2. Click "Add new site" > "Import an existing project"
3. Select GitHub and choose "Seneval/creatorhub"
4. Configure build settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`

## 2. Backend (Hostgator)
1. Upload `hostgator-files.zip` to your Hostgator directory
2. SSH into Hostgator:
   ```bash
   unzip hostgator-files.zip
   npm install
   node server.js
   ```

## 3. Connect Frontend to Backend
After both are deployed:
1. Copy your Netlify URL (e.g., creatorhub-xxxx.netlify.app)
2. Copy your Hostgator API URL
3. Update the environment variables in Netlify:
   - Go to Site settings > Environment variables
   - Add: `VITE_API_URL=https://your-hostgator-domain/api`

Your app should now be live! Test:
1. Creating an account
2. Uploading media
3. Playing audio/video files
4. Viewing and deleting media
