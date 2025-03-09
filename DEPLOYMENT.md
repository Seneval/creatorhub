# Deployment Checklist

## Before Pushing to GitHub

1. Configure Git (run these commands):
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

2. Update Environment Files:

   In `.env.production`:
   ```
   PORT=3000
   API_URL=https://[your-hostgator-domain]/api
   CORS_ORIGIN=https://[your-netlify-app-name].netlify.app
   ```

   In `frontend/.env.production`:
   ```
   VITE_API_URL=https://[your-hostgator-domain]/api
   ```

   In `netlify.toml`:
   ```toml
   [context.production.environment]
     VITE_API_URL = "https://[your-hostgator-domain]/api"
   ```

## Hostgator Deployment

1. Create a subdomain or use your main domain for the API
2. Access cPanel and navigate to "Setup Node.js App"
3. Configuration settings:
   - Node.js version: 16.x or higher
   - NPM version: 8.x or higher
   - Application root: /path/to/your/directory
   - Application URL: your-api-domain
   - Application startup file: server.js
   - Environment: production

4. Upload files via FTP:
   ```
   server.js
   package.json
   package-lock.json
   Procfile
   .env (renamed from .env.production)
   ```

5. Create and configure uploads directory:
   ```bash
   mkdir uploads
   chmod 755 uploads
   ```

6. Install dependencies:
   ```bash
   npm install
   ```

## Netlify Deployment

1. Push your code to GitHub:
   ```bash
   git remote add origin https://github.com/your-username/your-repo.git
   git push -u origin main
   ```

2. In Netlify Dashboard:
   - Click "Add new site" > "Import an existing project"
   - Connect to GitHub and select your repository
   - Configure build settings:
     * Base directory: frontend
     * Build command: npm run build
     * Publish directory: frontend/dist
   - Add environment variables:
     * VITE_API_URL: https://[your-hostgator-domain]/api

3. After deployment, copy your Netlify URL and update:
   - Hostgator .env file with the CORS_ORIGIN
   - Restart Node.js application in cPanel

## Testing Checklist

1. Backend:
   - [ ] Server starts without errors
   - [ ] API endpoints are accessible
   - [ ] CORS is properly configured
   - [ ] File uploads work
   - [ ] Uploads directory has proper permissions

2. Frontend:
   - [ ] Site loads correctly
   - [ ] Authentication works
   - [ ] File uploads work
   - [ ] Media displays correctly
   - [ ] Audio/video playback works
   - [ ] Delete functionality works

## Troubleshooting

1. CORS Issues:
   - Verify CORS_ORIGIN in backend .env
   - Check frontend API_URL
   - Ensure protocols match (https)

2. Upload Issues:
   - Check uploads directory permissions
   - Verify directory exists
   - Check file size limits

3. Build Issues:
   - Check Node.js and NPM versions
   - Verify all dependencies are installed
   - Check build logs for errors

4. Runtime Issues:
   - Check server logs
   - Monitor memory usage
   - Verify environment variables

## Support Files

Remember to keep these files backed up:
- All .env files
- uploads directory
- package.json configurations
