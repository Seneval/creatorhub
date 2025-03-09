import { useState } from 'react';
import { Box, Typography, Container, Paper, IconButton, Fade } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import axios from 'axios';
import { LoadingOverlay } from './LoadingOverlay';

const API_URL = 'http://localhost:3000/api';

export function MediaUpload({ onUploadComplete }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = async (file) => {
    if (!file) return;

    // Validate file type
    const validTypes = [
      'image/jpeg', 'image/png', 'image/gif',       // Images
      'audio/mpeg', 'audio/wav', 'audio/mp4',       // Audio
      'video/mp4', 'video/quicktime', 'video/webm'  // Video
    ];

    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Please upload an image, audio, or video file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    setError('');
    
    try {
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        },
      });

      if (response.data) {
        onUploadComplete(response.data);
        setProgress(0);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      {uploading && <LoadingOverlay message={`Uploading... ${progress}%`} />}
      <Container maxWidth="md">
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            mt: 4,
            mb: 4,
            backgroundColor: dragActive ? 'rgba(52, 152, 219, 0.05)' : 'background.paper',
            transition: 'all 0.3s ease'
          }}
        >
          <Box
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            sx={{
              border: '2px dashed',
              borderColor: dragActive ? 'primary.main' : 'divider',
              borderRadius: 2,
              p: 6,
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              position: 'relative',
              background: dragActive 
                ? 'linear-gradient(120deg, rgba(161, 196, 253, 0.1) 0%, rgba(194, 233, 251, 0.1) 100%)'
                : 'none',
              '&:hover': {
                borderColor: 'primary.main',
                backgroundColor: 'rgba(52, 152, 219, 0.05)',
                transform: 'translateY(-2px)'
              }
            }}
          >
            <input
              type="file"
              onChange={(e) => handleFile(e.target.files?.[0])}
              accept=".jpg,.jpeg,.png,.gif,.mp3,.wav,.mp4,.mov,.webm"
              style={{
                opacity: 0,
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                cursor: 'pointer'
              }}
            />
            
            <Fade in={uploadSuccess}>
              <Box>
                <CheckCircleIcon 
                  color="success" 
                  sx={{ 
                    fontSize: 80,
                    mb: 2,
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                  }} 
                />
              </Box>
            </Fade>
            
            {!uploadSuccess && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2
                }}
              >
                <FileUploadIcon 
                  sx={{ 
                    fontSize: 80,
                    color: dragActive ? 'primary.main' : 'text.secondary',
                    opacity: dragActive ? 1 : 0.7,
                    transition: 'all 0.3s ease',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                  }} 
                />
                <Box>
                  <Typography variant="h5" gutterBottom fontWeight="medium">
                    {dragActive ? 'Drop your files here' : 'Share your creation'}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Drag and drop your files or click to browse
                  </Typography>
                </Box>
              </Box>
            )}

            {error && (
              <Typography 
                color="error" 
                sx={{ 
                  mt: 2,
                  p: 1,
                  borderRadius: 1,
                  backgroundColor: 'error.light',
                  color: 'error.dark'
                }}
              >
                {error}
              </Typography>
            )}

            <Typography 
              variant="body2" 
              sx={{ 
                mt: 4,
                color: 'text.secondary',
                p: 1,
                borderRadius: 1,
                backgroundColor: 'rgba(0, 0, 0, 0.03)',
                display: 'inline-block',
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              Supported formats: JPG, PNG, GIF, MP3, WAV, MP4, MOV, WebM
            </Typography>
          </Box>
        </Paper>
      </Container>
    </>
  );
}
