import { useState } from 'react';
import { Box, Button, TextField, Typography, Container, Paper, Fade } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LoginIcon from '@mui/icons-material/Login';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? 'login' : 'register';
    
    try {
      const response = await axios.post(`${API_URL}/${endpoint}`, {
        username,
        password
      });
      
      if (response.data) {
        if (isLogin) {
          onLogin(username);
        } else {
          setIsLogin(true);
          setError('Registration successful! Please log in.');
          setUsername('');
          setPassword('');
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <Container maxWidth="sm">
      <Fade in timeout={800}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4,
            mt: 8,
            borderRadius: 3,
            background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: 'linear-gradient(45deg, #2c3e50 30%, #3498db 90%)',
            }}
          />

          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <PersonIcon 
              sx={{ 
                fontSize: 48, 
                color: 'primary.main',
                p: 1,
                borderRadius: '50%',
                backgroundColor: 'rgba(44, 62, 80, 0.1)',
                mb: 2
              }} 
            />
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #2c3e50 30%, #3498db 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              {isLogin ? 'Sign in to continue' : 'Join our creative community'}
            </Typography>
          </Box>

          {error && (
            <Typography 
              color={error.includes('successful') ? 'success.main' : 'error'} 
              align="center" 
              sx={{ 
                mb: 2,
                p: 1,
                borderRadius: 1,
                backgroundColor: error.includes('successful') ? 'success.light' : 'error.light',
                color: error.includes('successful') ? 'success.dark' : 'error.dark'
              }}
            >
              {error}
            </Typography>
          )}

          <Box 
            component="form" 
            onSubmit={handleSubmit} 
            sx={{ 
              mt: 2,
              '& .MuiTextField-root': {
                mb: 2
              }
            }}
          >
            <TextField
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              variant="outlined"
              InputProps={{
                sx: { borderRadius: 2 }
              }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              InputProps={{
                sx: { borderRadius: 2 }
              }}
            />
            
            <Button
              fullWidth
              variant="contained"
              type="submit"
              size="large"
              startIcon={isLogin ? <LoginIcon /> : <HowToRegIcon />}
              sx={{ 
                mt: 3,
                mb: 2,
                height: 48,
                borderRadius: 2,
              }}
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </Button>

            <Button
              fullWidth
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              sx={{ 
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: 'rgba(52, 152, 219, 0.1)'
                }
              }}
            >
              {isLogin ? 'Need an account? Register' : 'Have an account? Sign In'}
            </Button>
          </Box>
        </Paper>
      </Fade>
    </Container>
  );
}
