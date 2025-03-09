import { Box, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export function EmptyState() {
  return (
    <Box
      sx={{
        textAlign: 'center',
        py: 8,
        px: 3,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        mt: 4,
        animation: 'fadeIn 0.5s ease-out',
      }}
    >
      <CloudUploadIcon
        sx={{
          fontSize: 80,
          color: 'text.secondary',
          mb: 2,
          opacity: 0.5,
        }}
      />
      <Typography variant="h6" color="text.secondary" gutterBottom>
        No creations yet
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Start by uploading your AI-generated content above
      </Typography>
    </Box>
  );
}
