import { Box, CircularProgress, Typography } from '@mui/material';

export function LoadingOverlay({ message = 'Loading...' }) {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(5px)',
        zIndex: 9999,
      }}
    >
      <CircularProgress 
        size={60}
        thickness={4}
        sx={{
          color: 'primary.main',
          mb: 2
        }}
      />
      <Typography 
        variant="h6"
        sx={{
          color: 'text.primary',
          fontWeight: 500
        }}
      >
        {message}
      </Typography>
    </Box>
  );
}
