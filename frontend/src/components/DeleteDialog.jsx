import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';

export function DeleteDialog({ open, onClose, onConfirm, itemName }) {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 2,
          minWidth: 320
        }
      }}
    >
      <DialogTitle sx={{ 
        pb: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        color: 'error.main'
      }}>
        <DeleteIcon />
        Delete Confirmation
      </DialogTitle>

      <DialogContent>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          mb: 2,
          p: 2,
          bgcolor: 'error.light',
          borderRadius: 1
        }}>
          <WarningIcon color="error" />
          <Typography>
            This action cannot be undone.
          </Typography>
        </Box>
        <Typography>
          Are you sure you want to delete <strong>{itemName}</strong>?
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: 2,
            px: 3
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
          sx={{
            borderRadius: 2,
            px: 3,
            '&:hover': {
              bgcolor: 'error.dark'
            }
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
