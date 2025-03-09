# CreatorHub

A full-stack media gallery application built with React and Express.

## Features

- 🖼️ Image gallery with modal view
- 🎵 Audio player with controls
- 🎥 Video player with fullscreen support
- 👤 User profiles with avatars
- 📤 Drag and drop file uploads
- 🗑️ Media management (delete, download)

## Deployment Instructions

### Backend (Hostgator)

1. Upload the following files to your Hostgator directory (e.g., `public_html` or a subdirectory):
   ```
   server.js
   package.json
   package-lock.json
   Procfile
   .env.production (rename to .env)
   ```

2. Create `uploads` directory:
   ```bash
   mkdir uploads
   chmod 755 uploads
   ```

3. SSH into your Hostgator account and run:
   ```bash
   cd your_directory
   npm install
   ```

4. Set up Node.js application in Hostgator:
   - Go to cPanel > Setup Node.js App
   - Select your application directory
   - Set Node.js version (16.x or higher)
   - Set NPM version (8.x or higher)
   - Application mode: Production
   - Application URL: Your domain/subdomain
   - Application root: /path/to/your/directory
   - Application startup file: server.js
   - Save and restart application

5. Update `.env` file with your domain:
   ```
   PORT=3000
   CORS_ORIGIN=https://your-netlify-app.netlify.app
   NODE_ENV=production
   ```

### Frontend (Netlify)

1. Login to your Netlify account

2. Click "Import project" and select your GitHub repository

3. Configure build settings:
   - Base directory: frontend
   - Build command: npm run build
   - Publish directory: frontend/dist

4. Add environment variables in Netlify dashboard:
   ```
   VITE_API_URL=https://your-hostgator-domain.com/api
   ```

5. Deploy! Netlify will automatically build and deploy your site.

### Local Development

1. Install dependencies:
   ```bash
   # Root directory
   npm install
   
   # Frontend directory
   cd frontend
   npm install
   ```

2. Create `.env` file:
   ```
   PORT=3000
   ```

3. Start development servers:
   ```bash
   ./start-dev.sh
   ```

Access the app at `http://localhost:5173`

## Tech Stack

- Frontend:
  - React
  - Material-UI
  - Vite
  - Axios

- Backend:
  - Express
  - express-fileupload
  - CORS

## Notes

- Ensure all environment variables are properly set
- Update CORS settings in server.js with your Netlify domain
- Keep uploads directory writable
- Maximum file upload size is 50MB
