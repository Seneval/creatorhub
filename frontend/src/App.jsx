import { useState } from 'react';
import { CssBaseline, Box, AppBar, Toolbar, Typography, Container, IconButton, ThemeProvider } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LogoutIcon from '@mui/icons-material/Logout';
import { theme } from './theme';
import { Auth } from './components/Auth';
import { MediaUpload } from './components/MediaUpload';
import { MediaGallery } from './components/MediaGallery';
import { Profile } from './components/Profile';

export default function App() {
  const [user, setUser] = useState(null);
  const [mediaKey, setMediaKey] = useState(0);
  const [mediaCount, setMediaCount] = useState(0);

  const handleLogin = (username) => {
    setUser(username);
  };

  const handleUploadComplete = () => {
    // Force MediaGallery to refresh by changing its key
    setMediaKey(prev => prev + 1);
    setMediaCount(prev => prev + 1);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'background.default'
      }}>
        <CssBaseline />
        <AppBar 
          position="fixed" 
          elevation={0}
          sx={{ 
            backgroundColor: 'rgba(44, 62, 80, 0.98)',
            backdropFilter: 'blur(8px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <Toolbar>
            <CloudUploadIcon sx={{ mr: 2 }} />
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                flexGrow: 1, 
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #fff 30%, #3498db 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              CreatorHub
            </Typography>
            {user && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontWeight: 500,
                    color: 'primary.contrastText'
                  }}
                >
                  {user}
                </Typography>
                <IconButton 
                  color="inherit" 
                  onClick={() => setUser(null)}
                  sx={{ 
                    '&:hover': { 
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      transform: 'scale(1.1)'
                    },
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  <LogoutIcon />
                </IconButton>
              </Box>
            )}
          </Toolbar>
        </AppBar>

        <Toolbar /> {/* Spacer for fixed AppBar */}
        
        <Container 
          maxWidth="lg" 
          sx={{ 
            py: 4,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 3
          }}
        >
          {!user ? (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flex: 1
            }}>
              <Auth onLogin={handleLogin} />
            </Box>
          ) : (
            <>
              <Profile username={user} mediaCount={mediaCount} />
              <MediaUpload onUploadComplete={handleUploadComplete} />
              <MediaGallery 
              key={mediaKey} 
              onDelete={() => setMediaCount(prev => Math.max(0, prev - 1))}
            />
            </>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}
