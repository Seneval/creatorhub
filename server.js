import express from 'express';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join, extname } from 'path';
import fs from 'fs';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';
const NODE_ENV = process.env.NODE_ENV || 'development';

// Create uploads directory if it doesn't exist
if (!fs.existsSync(join(__dirname, 'uploads'))) {
  fs.mkdirSync(join(__dirname, 'uploads'), { recursive: true });
}

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Security middlewares for production
if (NODE_ENV === 'production') {
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });
}
app.use(express.json());
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max file size
  createParentPath: true
}));

// Serve uploaded files
app.use('/uploads', express.static(join(__dirname, 'uploads')));

// Routes
const users = [];
const profiles = new Map(); // Store profile information
const media = [];

// Helper to get profile info
const getProfile = (username) => {
  if (!profiles.has(username)) {
    profiles.set(username, {
      displayName: username,
      avatar: null,
      coverPhoto: null,
      bio: ''
    });
  }
  return {
    ...profiles.get(username),
    mediaCount: media.length
  };
};

// Profile routes
app.get('/api/profile/:username', (req, res) => {
  const { username } = req.params;
  const profile = getProfile(username);
  res.json(profile);
});

app.post('/api/profile/:username', (req, res) => {
  const { username } = req.params;
  const { displayName, bio } = req.body;
  const profile = getProfile(username);
  
  if (displayName) profile.displayName = displayName;
  if (bio) profile.bio = bio;
  
  res.json(profile);
});

app.post('/api/profile/:username/avatar', (req, res) => {
  try {
    const { username } = req.params;
    if (!req.files || !req.files.avatar) {
      return res.status(400).json({ error: 'No avatar file uploaded.' });
    }

    const avatar = req.files.avatar;
    const uploadPath = join(__dirname, 'uploads', `avatar-${username}${extname(avatar.name)}`);
    
    avatar.mv(uploadPath, (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      const profile = getProfile(username);
      profile.avatar = `/uploads/avatar-${username}${extname(avatar.name)}`;
      
      res.json(profile);
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cover photo upload route
app.post('/api/profile/:username/cover', (req, res) => {
  try {
    const { username } = req.params;
    if (!req.files || !req.files.cover) {
      return res.status(400).json({ error: 'No cover photo uploaded.' });
    }

    const cover = req.files.cover;
    const uploadPath = join(__dirname, 'uploads', `cover-${username}${extname(cover.name)}`);
    
    cover.mv(uploadPath, (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      const profile = getProfile(username);
      profile.coverPhoto = `/uploads/cover-${username}${extname(cover.name)}`;
      
      res.json(profile);
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Auth routes
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ error: 'Username already exists' });
  }
  users.push({ username, password });
  res.status(201).json({ message: 'User registered successfully' });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  res.json({ 
    message: 'Login successful',
    profile: getProfile(username)
  });
});

// Media upload route
app.post('/api/upload', (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ error: 'No files were uploaded.' });
    }

    const file = req.files.file;
    const uploadPath = join(__dirname, 'uploads', file.name);

    file.mv(uploadPath, (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      media.push({
        name: file.name,
        path: `/uploads/${file.name}`,
        type: file.mimetype,
        uploadedAt: new Date()
      });

      res.json({
        message: 'File uploaded successfully',
        file: `/uploads/${file.name}`
      });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all media
app.get('/api/media', (req, res) => {
  res.json(media);
});

// Delete media
app.delete('/api/media/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const mediaIndex = media.findIndex(item => item.name === filename);
    
    if (mediaIndex === -1) {
      return res.status(404).json({ error: 'Media not found' });
    }

    const mediaItem = media[mediaIndex];
    const filePath = join(__dirname, 'uploads', filename);

    // Remove file from filesystem
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      console.error('Error deleting file:', err);
    }

    // Remove from media array
    media.splice(mediaIndex, 1);
    
    res.json({ message: 'Media deleted successfully', deleted: mediaItem });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
