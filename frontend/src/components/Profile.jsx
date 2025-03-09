import { useState, useEffect } from 'react';
import { Box, Avatar, Typography, Button, IconButton, TextField, Paper, Divider, Stack } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CollectionsIcon from '@mui/icons-material/Collections';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export function Profile({ username, mediaCount = 0 }) {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ displayName: '', bio: '' });
  const [coverPhoto, setCoverPhoto] = useState(null);

  useEffect(() => {
    loadProfile();
  }, [username]);

  const loadProfile = async () => {
    try {
      const response = await axios.get(`${API_URL}/profile/${username}`);
      setProfile(response.data);
      setEditForm({
        displayName: response.data.displayName || '',
        bio: response.data.bio || ''
      });
    } catch (err) {
      console.error('Failed to load profile:', err);
    }
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await axios.post(
        `${API_URL}/profile/${username}/avatar`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setProfile(response.data);
    } catch (err) {
      console.error('Failed to update avatar:', err);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      const response = await axios.post(`${API_URL}/profile/${username}`, editForm);
      setProfile(response.data);
      setEditing(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  if (!profile) return null;

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        mb: 4,
        position: 'relative',
        borderRadius: 2,
        overflow: 'hidden'
      }}
    >
      {/* Cover Photo */}
      <Box
        sx={{
          height: 250,
          width: '100%',
          bgcolor: 'grey.200',
          backgroundImage: coverPhoto ? `url(${coverPhoto})` : 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative'
        }}
      >
        <IconButton
          component="label"
          sx={{
            position: 'absolute',
            right: 16,
            bottom: 16,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' }
          }}
        >
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (e) => setCoverPhoto(e.target?.result);
                reader.readAsDataURL(file);
              }
            }}
          />
          <CameraAltIcon />
        </IconButton>
      </Box>

      {/* Main Content */}
      <Box sx={{ px: 4, pb: 4 }}>
        {/* Profile Header */}
        <Box sx={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: -8,
          position: 'relative',
          zIndex: 1
        }}>
          {/* Avatar */}
          <Box sx={{ position: 'relative', mb: 2 }}>
            <Avatar
              src={profile.avatar ? `http://localhost:3000${profile.avatar}` : undefined}
              sx={{ 
                width: 160,
                height: 160,
                border: 6,
                borderColor: 'background.paper',
                boxShadow: 3
              }}
            />
            <IconButton
              component="label"
              sx={{
                position: 'absolute',
                bottom: 8,
                right: 8,
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': { 
                  backgroundColor: 'primary.dark'
                }
              }}
            >
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleAvatarChange}
              />
              <PhotoCameraIcon />
            </IconButton>
          </Box>

          {/* Profile Info */}
          {editing ? (
            <Box sx={{ width: '100%', maxWidth: 500, mt: 2 }}>
              <TextField
                fullWidth
                label="Display Name"
                value={editForm.displayName}
                onChange={(e) => setEditForm(prev => ({ ...prev, displayName: e.target.value }))}
                variant="filled"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Bio"
                value={editForm.bio}
                onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                variant="filled"
                multiline
                rows={3}
                sx={{ mb: 2 }}
              />
              <Stack direction="row" spacing={2} justifyContent="center">
                <Button 
                  variant="contained" 
                  onClick={handleProfileUpdate}
                  sx={{ px: 4 }}
                >
                  Save Changes
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </Button>
              </Stack>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'medium', mb: 1 }}>
                {profile.displayName}
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary" 
                sx={{ 
                  mb: 3,
                  maxWidth: 600,
                  mx: 'auto',
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.6
                }}
              >
                {profile.bio || 'No bio yet'}
              </Typography>
              <Button
                startIcon={<EditIcon />}
                onClick={() => setEditing(true)}
                variant="outlined"
                size="small"
                sx={{ mb: 3 }}
              >
                Edit Profile
              </Button>

              {/* Stats */}
              <Divider sx={{ mb: 3 }} />
              <Box sx={{ 
                display: 'flex',
                justifyContent: 'center',
                gap: 4
              }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" color="primary">
                    {mediaCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Creations
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center', display: 'flex', alignItems: 'center' }}>
                  <CollectionsIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    Media Gallery
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Paper>
  );
}
